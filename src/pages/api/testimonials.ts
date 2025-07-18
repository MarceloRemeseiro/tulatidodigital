import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { testimonials, testimonialsConfig } from '../../lib/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const authHeader = url.searchParams.get('auth') || request.headers.get('authorization');
  
  // Verificar tanto Basic Auth como Bearer token para compatibilidad
  const isBasicAuth = authHeader && authHeader.startsWith('Basic ');
  const isBearerAuth = authHeader === 'Bearer admin-token';
  
  if (!authHeader || (!isBasicAuth && !isBearerAuth)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const [configResult, testimonialsResult] = await Promise.all([
      db.select().from(testimonialsConfig).limit(1),
      db.select().from(testimonials)
    ]);
    
    const config = configResult[0];
    const testimonialsList = testimonialsResult;
    
    if (!config) {
      return new Response(JSON.stringify({ error: 'Configuración no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      config,
      testimonials: testimonialsList
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al obtener testimonials:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const authHeader = url.searchParams.get('auth') || request.headers.get('authorization');
  
  // Verificar tanto Basic Auth como Bearer token para compatibilidad
  const isBasicAuth = authHeader && authHeader.startsWith('Basic ');
  const isBearerAuth = authHeader === 'Bearer admin-token';
  
  if (!authHeader || (!isBasicAuth && !isBearerAuth)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    
    // Validar estructura de datos
    if (!data || (!data.config && !data.title)) {
      return new Response(JSON.stringify({ error: 'Estructura de datos inválida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Normalizar datos - manejar tanto estructura anidada como plana
    const configData = data.config || { title: data.title, subtitle: data.subtitle };
    const testimonialsData = data.testimonials || [];
    
    // Actualizar configuración
    const existingConfig = await db.select().from(testimonialsConfig).limit(1);
    
    if (existingConfig.length > 0) {
      await db.update(testimonialsConfig)
        .set({
          title: configData.title,
          subtitle: configData.subtitle,
          updatedAt: new Date()
        })
        .where(eq(testimonialsConfig.id, existingConfig[0].id));
    } else {
      await db.insert(testimonialsConfig).values({
        title: configData.title,
        subtitle: configData.subtitle
      });
    }
    
    // Actualizar testimonials (eliminar todos y recrear)
    await db.delete(testimonials);
    
    if (testimonialsData && testimonialsData.length > 0) {
      await db.insert(testimonials).values(
        testimonialsData.map((testimonial: any, index: number) => ({
          quote: testimonial.quote || testimonial.content,
          author: testimonial.name || testimonial.author,
          role: testimonial.role,
          position: index,
          isActive: true
        }))
      );
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al guardar testimonials:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
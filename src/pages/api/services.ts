import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { services, servicesConfig } from '../../lib/schema';
import { eq, asc } from 'drizzle-orm';

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
    const [configResult, servicesResult] = await Promise.all([
      db.select().from(servicesConfig).limit(1),
      db.select().from(services).orderBy(asc(services.position))
    ]);
    
    const config = configResult[0];
    const servicesList = servicesResult;
    
    return new Response(JSON.stringify({
      config: config || { title: 'Servicios', subtitle: '' },
      services: servicesList
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
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
    
    // Actualizar configuración
    const existingConfig = await db.select().from(servicesConfig).limit(1);
    
    if (existingConfig.length > 0) {
      await db.update(servicesConfig)
        .set({
          title: data.config.title,
          subtitle: data.config.subtitle,
          updatedAt: new Date()
        })
        .where(eq(servicesConfig.id, existingConfig[0].id));
    } else {
      await db.insert(servicesConfig).values({
        title: data.config.title,
        subtitle: data.config.subtitle
      });
    }
    
    // Actualizar servicios (eliminar todos y recrear para simplificar)
    await db.delete(services);
    
    if (data.services && data.services.length > 0) {
      await db.insert(services).values(
        data.services.map((service: any, index: number) => ({
          title: service.title,
          description: service.description,
          cta: service.cta,
          linkType: service.linkType,
          customLink: service.customLink,
          position: index,
          isActive: true
        }))
      );
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al guardar servicios:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
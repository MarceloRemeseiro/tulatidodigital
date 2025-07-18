import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { videoShowcase } from '../../lib/schema';
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
    const result = await db.select().from(videoShowcase).limit(1);
    const content = result[0];
    
    if (!content) {
      return new Response(JSON.stringify({ error: 'Contenido no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(content), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al obtener videoshowcase:', error);
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
    
    // Actualizar o insertar contenido
    const existing = await db.select().from(videoShowcase).limit(1);
    
    if (existing.length > 0) {
      // Actualizar existente
      await db.update(videoShowcase)
        .set({
          mainTitle: data.mainTitle,
          mainTitleHighlight: data.mainTitleHighlight,
          subtitle: data.subtitle,
          videoSubtitle: data.videoSubtitle,
          videoFileName: data.videoFileName,
          featuresTitle: data.featuresTitle,
          features: data.features,
          idealForTitle: data.idealForTitle,
          idealForItems: data.idealForItems,
          buttons: data.buttons,
          updatedAt: new Date()
        })
        .where(eq(videoShowcase.id, existing[0].id));
    } else {
      // Insertar nuevo
      await db.insert(videoShowcase).values({
        mainTitle: data.mainTitle,
        mainTitleHighlight: data.mainTitleHighlight,
        subtitle: data.subtitle,
        videoSubtitle: data.videoSubtitle,
        videoFileName: data.videoFileName,
        featuresTitle: data.featuresTitle,
        features: data.features,
        idealForTitle: data.idealForTitle,
        idealForItems: data.idealForItems,
        buttons: data.buttons
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al guardar videoshowcase:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { layoutConfig } from '../../lib/schema';
import { eq } from 'drizzle-orm';

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
    const result = await db.select().from(layoutConfig).limit(1);
    const content = result[0];
    
    if (!content) {
      return new Response(JSON.stringify({ error: 'Configuración no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(content), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al leer configuración' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  
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
    
    // Validar estructura básica
    if (!data.components || !Array.isArray(data.components)) {
      return new Response(JSON.stringify({ error: 'Datos inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar que cada componente tenga los campos requeridos
    for (const component of data.components) {
      if (!component.id || !component.name || !component.component || 
          typeof component.enabled !== 'boolean' || typeof component.position !== 'number') {
        return new Response(JSON.stringify({ error: 'Estructura de componente inválida' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Obtener el registro existente
    const existing = await db.select().from(layoutConfig).limit(1);
    
    if (existing.length > 0) {
      // Actualizar registro existente
      await db.update(layoutConfig)
        .set({ 
          components: data.components,
          updatedAt: new Date()
        })
        .where(eq(layoutConfig.id, existing[0].id));
    } else {
      // Crear nuevo registro
      await db.insert(layoutConfig).values({
        components: data.components
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al guardar configuración' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
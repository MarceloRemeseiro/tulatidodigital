import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_FILE = path.join(process.cwd(), 'src/content/layout.json');

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
    const content = fs.readFileSync(CONTENT_FILE, 'utf-8');
    return new Response(content, {
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

    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));
    
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
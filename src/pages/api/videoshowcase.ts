import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_FILE = path.join(process.cwd(), 'src/content/videoshowcase.json');

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const authHeader = url.searchParams.get('auth') || request.headers.get('authorization');
  
  if (!authHeader || authHeader !== 'Bearer admin-token') {
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
    return new Response(JSON.stringify({ error: 'Error al leer contenido' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  
  // Aceptar tanto Basic Auth como Bearer token
  const isValidAuth = authHeader && (
    authHeader.startsWith('Basic ') || 
    authHeader === 'Bearer admin-token'
  );
  
  if (!isValidAuth) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    
    // Validar estructura básica
    if (!data.mainTitle || !data.features || !Array.isArray(data.features)) {
      return new Response(JSON.stringify({ error: 'Datos inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al guardar contenido' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
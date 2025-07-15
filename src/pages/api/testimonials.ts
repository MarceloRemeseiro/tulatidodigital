import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { verifyApiAuth, createAuthResponse } from '../../utils/auth';

const testimonialsPath = path.join(process.cwd(), 'src/content/testimonials.json');

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = await fs.readFile(testimonialsPath, 'utf-8');
    return new Response(data, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "File not found" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verificar autenticación
    if (!verifyApiAuth(request)) {
      return createAuthResponse();
    }

    const data = await request.json();
    
    // Aquí podrías añadir validación de datos con Zod si quieres más seguridad

    await fs.writeFile(testimonialsPath, JSON.stringify(data, null, 2));

    return new Response(JSON.stringify({ message: 'Contenido guardado con éxito' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error al guardar el contenido' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 
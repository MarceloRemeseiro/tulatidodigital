import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';

const heroPath = path.join(process.cwd(), 'src/content/hero.json');

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    await fs.writeFile(heroPath, JSON.stringify(data, null, 2));

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
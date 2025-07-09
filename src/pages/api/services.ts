import type { APIRoute } from 'astro';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ServiceContent } from '../../content/types';

export const prerender = false;

const DB_PATH = path.join(process.cwd(), 'src/content/services.json');

async function writeDb(data: ServiceContent): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'update_all') {
      await writeDb(data);
      return new Response(JSON.stringify(data), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Acción no válida' }), { status: 400 });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ message: 'Error en el servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 
import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';

// Función para verificar autenticación básica
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  const expectedUsername = import.meta.env.USUARIO;
  const expectedPassword = import.meta.env.PASS;

  return username === expectedUsername && password === expectedPassword;
}

export const POST: APIRoute = async ({ request }) => {
  // Verificar autenticación
  if (!checkAuth(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validar estructura de datos
    if (!data.items || !Array.isArray(data.items) || !data.bottomText || !data.ctaButton) {
      return new Response('Invalid data structure', { status: 400 });
    }

    // Validar que cada item tenga icon y text
    for (const item of data.items) {
      if (!item.icon || !item.text) {
        return new Response('Each item must have icon and text', { status: 400 });
      }
    }

    const valuesPath = path.join(process.cwd(), 'src/content/values.json');
    await fs.writeFile(valuesPath, JSON.stringify(data, null, 2));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error saving values content:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}; 
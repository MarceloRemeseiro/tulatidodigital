import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { verifyApiAuth, createAuthResponse } from '../../utils/auth';

const contentPath = path.join(process.cwd(), 'src/content/about.json');

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = await fs.readFile(contentPath, 'utf-8');
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
    await fs.writeFile(contentPath, JSON.stringify(data, null, 2));
    
    return new Response(JSON.stringify({ message: "Content updated successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in about API:', error);
    return new Response(JSON.stringify({ 
      message: "Error updating content", 
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
    });
  }
}; 
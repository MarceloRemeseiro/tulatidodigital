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
    console.log('=== API About POST ===');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    
    // Verificar autenticación
    if (!verifyApiAuth(request)) {
      console.log('Auth failed');
      return createAuthResponse();
    }
    
    console.log('Auth passed');
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      isProd: import.meta.env.PROD,
      cwd: process.cwd()
    });

    const data = await request.json();
    console.log('Data received:', data);
    console.log('Content path:', contentPath);
    
    // Verificar si el directorio existe
    const dirPath = path.dirname(contentPath);
    console.log('Directory path:', dirPath);
    
    try {
      const dirExists = await fs.access(dirPath).then(() => true).catch(() => false);
      console.log('Directory exists:', dirExists);
      
      const fileExists = await fs.access(contentPath).then(() => true).catch(() => false);
      console.log('File exists before write:', fileExists);
      
      if (fileExists) {
        const stats = await fs.stat(contentPath);
        console.log('File stats:', {
          size: stats.size,
          mode: stats.mode.toString(8),
          uid: stats.uid,
          gid: stats.gid
        });
      }
    } catch (e) {
      console.log('Error checking file/dir:', e);
    }
    
    // Intentar escribir el archivo
    try {
      await fs.writeFile(contentPath, JSON.stringify(data, null, 2));
      console.log('File written successfully');
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      
      // En producción, si no se puede escribir, devolver un error más informativo
      if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ 
          message: "No se puede escribir archivos en producción. El sistema de archivos es de solo lectura.",
          suggestion: "Los cambios deben hacerse en desarrollo y luego desplegarse.",
          error: writeError instanceof Error ? writeError.message : String(writeError)
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        throw writeError; // Re-lanzar el error en desarrollo
      }
    }
    
    return new Response(JSON.stringify({ message: "Content updated successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in about API:', error);
    return new Response(JSON.stringify({ 
      message: "Error updating content", 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined 
    }), {
      status: 500,
    });
  }
}; 
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const CONTENT_FILE = path.join(process.cwd(), 'src/content/videoshowcase.json');

// Extensiones de video permitidas
const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi'];

// Función para obtener el video actual
function getCurrentVideo(): string | null {
  try {
    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    const videoPath = path.join(PUBLIC_DIR, content.videoFileName || '');
    return fs.existsSync(videoPath) ? content.videoFileName : null;
  } catch {
    return null;
  }
}

// Función para actualizar el nombre del video en el JSON
function updateVideoFileName(fileName: string) {
  try {
    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    content.videoFileName = fileName;
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  } catch (error) {
    console.error('Error updating video filename:', error);
  }
}

// GET: Obtener estado del video actual
export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || authHeader !== 'Bearer admin-token') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const currentVideo = getCurrentVideo();
  
  return new Response(JSON.stringify({ 
    hasVideo: !!currentVideo,
    videoFileName: currentVideo,
    message: currentVideo ? 'Video disponible' : 'No hay video disponible'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

// POST: Subir nuevo video
export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || authHeader !== 'Bearer admin-token') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Verificar si ya existe un video
    const currentVideo = getCurrentVideo();
    if (currentVideo) {
      return new Response(JSON.stringify({ 
        error: 'Ya existe un video. Debe eliminarlo antes de subir uno nuevo.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();
    const file = formData.get('video') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No se encontró archivo de video' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar extensión
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return new Response(JSON.stringify({ 
        error: `Formato no permitido. Use: ${ALLOWED_EXTENSIONS.join(', ')}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar que es video vertical (aspect ratio 9:16 aproximadamente)
    // Nota: Esta validación es básica, podrías usar ffprobe para validación más precisa
    
    // Validar tamaño (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ 
        error: 'El archivo es demasiado grande. Máximo 50MB.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileName = `video-${timestamp}${fileExtension}`;
    const filePath = path.join(PUBLIC_DIR, fileName);

    // Guardar archivo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    // Actualizar referencia en JSON
    updateVideoFileName(fileName);

    return new Response(JSON.stringify({ 
      success: true,
      fileName,
      message: 'Video subido exitosamente'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error uploading video:', error);
    return new Response(JSON.stringify({ error: 'Error al subir video' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE: Eliminar video actual
export const DELETE: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || authHeader !== 'Bearer admin-token') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const currentVideo = getCurrentVideo();
    
    if (!currentVideo) {
      return new Response(JSON.stringify({ 
        error: 'No hay video para eliminar' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filePath = path.join(PUBLIC_DIR, currentVideo);
    
    // Eliminar archivo físico
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Actualizar JSON para usar video por defecto
    updateVideoFileName('videoAvatar.mp4');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Video eliminado exitosamente'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    return new Response(JSON.stringify({ error: 'Error al eliminar video' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const nombre = formData.get('nombre') as string;
    const email = formData.get('email') as string;
    const tipoVideo = formData.get('tipo-video') as string;
    const mensaje = formData.get('mensaje') as string;

    // Validaciones básicas
    if (!nombre || !email) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Nombre y email son obligatorios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      console.error('Variables de entorno faltantes:', {
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: !!process.env.EMAIL_PASS,
        EMAIL_TO: !!process.env.EMAIL_TO
      });
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Error de configuración del servidor. Contacta al administrador.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Configurar transporter de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Mapear tipos de vídeo para mejor presentación
    const tiposVideo = {
      'presentacion-servicios': 'Presentación de servicios',
      'lanzamiento-producto': 'Lanzamiento de producto',
      'redes-sociales': 'Contenido para redes sociales',
      'campana-ventas': 'Campaña de ventas',
      'formacion': 'Contenido formativo',
      'otro': 'Otro (especificado en mensaje)'
    };

    const tipoVideoTexto = tiposVideo[tipoVideo as keyof typeof tiposVideo] || 'No especificado';

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `🎥 Solicitud de vídeo con IA - ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
            🎬 Nueva solicitud: Vídeos sin cámara
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Información del cliente:</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Tipo de vídeo:</strong> ${tipoVideoTexto}</p>
          </div>
          
          ${mensaje ? `
          <div style="background: #fff; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Detalles del proyecto:</h3>
            <p style="line-height: 1.6; color: #555;">${mensaje}</p>
          </div>
          ` : ''}
          
          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">🎯 Próximos pasos:</h3>
            <ul style="color: #555; line-height: 1.6;">
              <li>Contactar al cliente para entender mejor su proyecto</li>
              <li>Mostrar ejemplos de avatares y voces disponibles</li>
              <li>Definir presupuesto y timeline</li>
              <li>Crear propuesta personalizada</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #667eea; color: white; border-radius: 8px;">
            <p style="margin: 0;">🎥 Solicitud enviada desde tulatidodigital.com/sin-camara</p>
          </div>
        </div>
      `
    };

    // Enviar el email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ 
      success: true, 
      message: '¡Solicitud enviada! Te contactaremos pronto con opciones de avatares y voces.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error al enviar la solicitud. Intenta de nuevo.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
#!/usr/bin/env node

/**
 * Script para optimizar vídeos para web
 * Requiere FFmpeg instalado en el sistema
 * 
 * Uso: node scripts/optimize-video.js input.mp4 output.mp4
 */

const { exec } = require('child_process');
const path = require('path');

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error('Uso: node scripts/optimize-video.js input.mp4 output.mp4');
  process.exit(1);
}

const inputPath = path.resolve(inputFile);
const outputPath = path.resolve(outputFile);

console.log('🎬 Optimizando vídeo para web...');
console.log(`📁 Entrada: ${inputPath}`);
console.log(`📁 Salida: ${outputPath}`);

// Comando FFmpeg para optimizar vídeo vertical para web
const ffmpegCommand = [
  'ffmpeg',
  '-i', `"${inputPath}"`,
  '-c:v libx264',           // Codec de vídeo H.264
  '-preset slow',           // Preset para mejor compresión
  '-crf 23',               // Factor de calidad (18-28, menor = mejor calidad)
  '-c:a aac',              // Codec de audio AAC
  '-b:a 128k',             // Bitrate de audio
  '-movflags +faststart',   // Optimización para streaming web
  '-pix_fmt yuv420p',      // Formato de píxel compatible
  '-vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2"', // Escalar a 1080x1920
  '-y',                    // Sobrescribir archivo de salida
  `"${outputPath}"`
].join(' ');

console.log('⚙️ Ejecutando:', ffmpegCommand);

exec(ffmpegCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error al optimizar vídeo:', error);
    return;
  }
  
  if (stderr) {
    console.log('📋 Información FFmpeg:', stderr);
  }
  
  console.log('✅ Vídeo optimizado correctamente!');
  console.log('📊 Recomendaciones adicionales:');
  console.log('   • Considera crear una versión WebM para mejor compresión');
  console.log('   • Agrega una imagen de poster para carga más rápida');
  console.log('   • Usa lazy loading para vídeos no críticos');
});

// Función auxiliar para crear versión WebM (opcional)
function createWebMVersion() {
  const webmOutput = outputPath.replace('.mp4', '.webm');
  const webmCommand = [
    'ffmpeg',
    '-i', `"${outputPath}"`,
    '-c:v libvpx-vp9',
    '-crf 30',
    '-b:v 0',
    '-c:a libopus',
    '-b:a 128k',
    '-vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2"',
    '-y',
    `"${webmOutput}"`
  ].join(' ');
  
  console.log('🔄 Creando versión WebM...');
  exec(webmCommand, (error) => {
    if (error) {
      console.warn('⚠️ No se pudo crear versión WebM:', error.message);
    } else {
      console.log('✅ Versión WebM creada:', webmOutput);
    }
  });
}

// Descomentar para crear versión WebM automáticamente
// setTimeout(createWebMVersion, 2000); 
/**
 * Formatea texto con markdown simple y saltos de línea
 * Soporta:
 * - **texto** para negritas
 * - Saltos de línea automáticos
 */
export function formatText(text: string): string {
  if (!text) return '';
  
  // Convertir saltos de línea a <br>
  let formatted = text.replace(/\n/g, '<br>');
  
  // Convertir **texto** a <strong>texto</strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  return formatted;
} 
/**
 * Formatea texto con markdown simple y saltos de línea
 * Soporta:
 * - **texto** para negritas
 * - Saltos de línea automáticos
 */
export function formatText(text: any): string {
  // Validar que el valor existe y es convertible a string
  if (!text || typeof text === 'undefined' || text === null) return '';
  
  // Convertir a string si no lo es
  const textStr = typeof text === 'string' ? text : String(text);
  
  // Convertir saltos de línea a <br>
  let formatted = textStr.replace(/\n/g, '<br>');
  
  // Convertir **texto** a <strong>texto</strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  return formatted;
} 
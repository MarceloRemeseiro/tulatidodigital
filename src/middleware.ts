import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, cookies, redirect } = context;
  const session = cookies.get('session');
  const isAuthenticated = session?.value === 'admin-logged-in';
  const isPublic = import.meta.env.PUBLICA === 'true';

  // Si está autenticado, tiene acceso a todo (excepto /logout, que tiene su propia página)
  if (isAuthenticated) {
    return next();
  }

  // --- Lógica para visitantes no autenticados ---

  if (isPublic) {
    // --- MODO PÚBLICO ---
    // El sitio es visible. Solo se protege /admin
    if (url.pathname.startsWith('/admin')) {
      return redirect('/login');
    }
  } else {
    // --- MODO "EN CONSTRUCCIÓN" ---
    // El sitio no es visible. Todo redirige a /en-construccion
    const allowedPaths = ['/en-construccion', '/login', '/sin-camara'];
    const currentPath = url.pathname;
    
    // Permitir archivos estáticos (extensiones comunes)
    const staticFileExtensions = ['.mp4', '.webm', '.mov', '.avi', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.css', '.js', '.woff', '.woff2', '.ttf'];
    const isStaticFile = staticFileExtensions.some(ext => currentPath.toLowerCase().endsWith(ext));
    
    console.log(`Middleware: Original URL: ${url.href}`);
    console.log(`Middleware: Pathname: "${currentPath}"`);
    console.log(`Middleware: PUBLICA=${isPublic}`);
    console.log(`Middleware: Is static file:`, isStaticFile);
    console.log(`Middleware: Allowed paths:`, allowedPaths);
    console.log(`Middleware: Path included in allowed:`, allowedPaths.includes(currentPath));
    console.log(`Middleware: Starts with /api/:`, currentPath.startsWith('/api/'));
    
    if (!allowedPaths.includes(currentPath) && !currentPath.startsWith('/api/') && !isStaticFile) {
      console.log(`Middleware: ❌ Redirecting ${currentPath} to /en-construccion`);
      return redirect('/en-construccion');
    }
    
    console.log(`Middleware: ✅ Allowing access to ${currentPath}`);
  }

  return next();
}; 
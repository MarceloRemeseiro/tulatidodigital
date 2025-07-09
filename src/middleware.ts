import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, cookies, redirect } = context;
  const session = cookies.get('session');
  const isAuthenticated = session?.value === 'admin-logged-in';
  const isPublic = import.meta.env.PUBLICA === 'true';

  // Logout siempre disponible para usuarios logueados
  if (isAuthenticated && url.pathname === '/logout') {
    cookies.delete('session', { path: '/' });
    return redirect('/login');
  }

  // Si está autenticado, tiene acceso a todo
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
    const allowedPaths = ['/en-construccion', '/login'];
    if (!allowedPaths.includes(url.pathname) && !url.pathname.startsWith('/api/')) {
      return redirect('/en-construccion');
    }
  }

  return next();
}; 
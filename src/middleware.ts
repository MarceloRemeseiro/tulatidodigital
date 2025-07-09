import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, cookies, redirect } = context;
  const session = cookies.get('session');
  const isAuthenticated = session?.value === 'admin-logged-in';

  // Si el usuario está autenticado, puede ver toda la web.
  // Solo gestionamos el logout.
  if (isAuthenticated) {
    if (url.pathname === '/logout') {
      cookies.delete('session', { path: '/' });
      return redirect('/login');
    }
    return next(); // Acceso total para usuarios logueados
  }

  // --- A partir de aquí, el usuario NO está autenticado ---

  // Rutas públicas que un visitante normal puede ver
  const publicPaths = ['/en-construccion', '/login'];

  // Permite el acceso a las rutas públicas y a la API (necesaria para el login)
  if (publicPaths.includes(url.pathname) || url.pathname.startsWith('/api/')) {
    return next();
  }

  // Para cualquier otra ruta, redirigir a "En Construcción"
  return redirect('/en-construccion');
}; 
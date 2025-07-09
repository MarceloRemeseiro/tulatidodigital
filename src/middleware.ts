import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, cookies, redirect } = context;

  // Ruta de logout
  if (url.pathname === '/logout') {
    cookies.delete('session', { path: '/' });
    return redirect('/login');
  }

  // Si se intenta acceder a /api, no hacer nada (para las llamadas del admin)
  if (url.pathname.startsWith('/api')) {
    return next();
  }
  
  // Si ya estamos en la página de login, no hacer nada para evitar bucles
  if (url.pathname === '/login') {
    return next();
  }

  // Proteger rutas de admin
  if (url.pathname.startsWith('/admin')) {
    const session = cookies.get('session');
    if (!session || session.value !== 'admin-logged-in') {
      return redirect('/login');
    }
  }

  return next();
}; 
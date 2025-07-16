export function verifyApiAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.slice(6); // Remove 'Basic '
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');

  const secretUser = process.env.USUARIO || import.meta.env.USUARIO;
  const secretPass = process.env.PASS || import.meta.env.PASS;

  return username === secretUser && password === secretPass;
}

export function createAuthResponse() {
  return new Response(JSON.stringify({ 
    message: 'Autenticación requerida. Incluye las credenciales en el header Authorization.' 
  }), {
    status: 401,
    headers: { 
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'Basic realm="API"'
    },
  });
} 
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  // Redireciona para o domínio personalizado, sem porta
  if (host === "novakapp.azurewebsites.net") {
    return NextResponse.redirect('https://novk.com.br' + request.nextUrl.pathname);
  }

  // Procura o usuário e verifica a senha
  const user = users.find(user => 
    user.email === credentials.email && 
    user.password === credentials.password && 
    user.active
  )

  // Rest of your middleware code...
  const pathname = request.nextUrl.pathname;

  // Lista de rotas que não precisam de autenticação
  const publicRoutes = [
    '/auth',     // Todas as rotas de autenticação
    '/api/auth', // APIs de autenticação
    '/_next',    // Arquivos Next.js
    '/favicon.ico'
  ];

  // Se for uma rota pública, permite o acesso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Obtém o token de autenticação
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Se não estiver autenticado, redireciona para login
  if (!token) {
    const loginUrl = new URL("/auth/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next|fonts|images|favicon.ico).*)',
  ],
};
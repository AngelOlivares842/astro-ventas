import { defineMiddleware } from "astro:middleware";

// Astro BUSCA específicamente esta exportación llamada "onRequest"
export const onRequest = defineMiddleware((context, next) => {
  const { cookies, url, redirect } = context;
  
  // Verificamos si existe la cookie
  const token = cookies.get("access_token")?.value;

  // REGLA 1: Si intenta entrar al panel sin token -> Lo manda al Login
  if (url.pathname.startsWith("/panel") && !token) {
    return redirect("/");
  }

  // REGLA 2: Si intenta entrar al Login teniendo token -> Lo manda al Panel
  if (url.pathname === "/" && token) {
     return redirect("/panel");
  }

  return next();
});
# Job Application Challenge

Aplicación web desarrollada con **Next.js 16**, **React** y **TypeScript** como parte de un challenge técnico.

## ¿Qué hace?

Muestra un listado de posiciones laborales obtenidas desde una API externa. Por cada posición, el candidato puede ingresar la URL de su repositorio de GitHub y enviar su postulación.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS


## Correr el proyecto

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

## Decisiones técnicas

- **Server Component para el fetch inicial**: los datos llegan pre-renderizados, sin loading spinner al entrar a la página.
- **Estado por posición con `Record`**: cada card maneja su propio `repoUrl`, `loading`, `submitted` y `error` de forma independiente.
- **Validación antes del POST**: se verifica que el campo no esté vacío y que la URL sea un repositorio de GitHub válido.
- **Manejo de errores de red**: el `try/catch` en el submit captura tanto errores de conectividad como respuestas no-ok del servidor y los muestra en la UI.
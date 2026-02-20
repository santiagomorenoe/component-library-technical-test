# Prueba Tecnica T1 | System Design con Telemetria

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

Sistema de telemetria para una libreria de componentes de UI. Registra eventos de uso (renders, clicks, hovers) en tiempo real, los almacena en MongoDB y expone un dashboard de analiticas donde puedes ver que componentes se usan mas, con que variantes y con que frecuencia.

El proyecto esta dividido en dos partes: un backend en Express que actua como API de ingestion y reporting, y un frontend en Next.js que contiene tanto la libreria de componentes como el dashboard de metricas.

**Demo desplegada:**
- Frontend: https://component-library-technical-test.vercel.app
- API: https://component-library-technical-test.onrender.com

El backend corre en el plan gratuito de Render, por lo que puede tardar unos segundos (hasta 50s) en responder la primera vez si estuvo inactivo un rato. Es normal, una vez que recibe el primer request despierta y responde con normalidad.

---

## API Endpoints

Base URL: `http://localhost:4000`

### Auth

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | No | Crea un usuario nuevo |
| `POST` | `/api/auth/login` | No | Retorna un JWT |

**Body login/register:**
```json
{ "email": "tu@email.com", "password": "minimo8chars", "name": "Nombre" }
```

### Components

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `POST` | `/api/components/track` | No | Registra un evento de uso de un componente |
| `GET` | `/api/components/stats` | No | Devuelve metricas agregadas por componente |
| `GET` | `/api/components/export` | JWT | Descarga todos los eventos en CSV |
| `GET` | `/api/components/export/json` | JWT | Descarga todos los eventos en JSON |

**Body track:**
```json
{
  "componentName": "Button",
  "variant": "primary",
  "action": "click",
  "projectId": "mi-proyecto"
}
```

Los endpoints de stats y export aceptan los query params `from`, `to`, `componentName` y `projectId` para filtrar resultados.

### Health

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `/api/health` | Verifica que el servidor esta corriendo |

---

## Setup local

**Requisitos:** Node.js 20+, MongoDB corriendo localmente o una URI de Atlas.

### Backend

```bash
cd backend
cp .env.example .env
# Edita .env: agrega MONGODB_URI y un JWT_SECRET
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:3000` y el backend en `http://localhost:4000`.

### Usuario de prueba

Con el backend corriendo y la base de datos conectada:

```bash
cd backend
npm run seed
```

Esto crea el usuario `morenoestradasantiago@gmail.com` con password `password123`.

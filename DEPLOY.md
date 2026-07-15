# Nexlynk Deployment Guide

## Prerrequisitos

1. Cuenta en [Cloudflare](https://cloudflare.com) (gratis)
2. Cuenta en [Vercel](https://vercel.com) (gratis)
3. Cuenta en [Render](https://render.com) (gratis)
4. Cuenta en [Supabase](https://supabase.com) (ya configurada)
5. Dominio registrado (opcional pero recomendado)

---

## 1. Deploy API (Render)

### Pasos:
1. Ve a [render.com](https://render.com)
2. Inicia sesión con GitHub
3. Haz click en "New" → "Web Service"
4. Conecta tu repositorio `nexlynk`
5. Configura:
   - **Name**: `nexlynk-api`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Runtime**: Docker
   - **Dockerfile Path**: `Dockerfile`

### Variables de Entorno:
```
NODE_ENV=production
PORT=10000
SUPABASE_URL=tu-url-de-supabase
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
JWT_SECRET=tu-secreto-jwt-seguro
```

### Resultado:
Tu API estará en: `https://nexlynk-api.onrender.com`

---

## 2. Deploy Admin (Vercel)

### Pasos:
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Haz click en "New Project"
4. Selecciona el repositorio `nexlynk`
5. En "Configure Project":
   - **Framework Preset**: Angular
   - **Root Directory**: `/` (dejar vacío, no `apps/admin`)
   - **Build Command**: usar el default (`npm install && npm run build:admin`)
   - **Output Directory**: usar el default (`dist/browser`)

### Variables de Entorno:
```
API_URL=https://nexlynk-api.onrender.com/api
```

### Resultado:
Tu admin estará en: `https://tu-admin.vercel.app`

> **Nota importante**: El `vercel.json` está en la raíz del repo. NO pongas `apps/admin` como Root Directory — el build genera `dist/browser` en la raíz.

---

## 3. Deploy Web (Cloudflare Pages)

### Pasos:
1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Ve a "Workers & Pages" → "Create Application" → "Connect to Git"
3. Selecciona tu repositorio `nexlynk`
4. Configura:
   - **Production branch**: `main`
   - **Build command**: `npm ci && npm run build --workspace=apps/web`
   - **Build output directory**: `apps/web/dist`
   - **Root directory**: `/` (dejar vacío o seleccionar la raíz)

### Variables de Entorno:
```
API_URL=https://nexlynk-api.onrender.com/api
NODE_VERSION=18
```

### Resultado:
Tu página pública estará en: `https://tu-pagina.pages.dev`

---

## 4. Configurar Dominio (Opcional)

### En Cloudflare Pages:
1. Ve a tu proyecto → "Custom Domains"
2. Agrega `nexlynk.app`
3. Configura los DNS records

### En Vercel:
1. Ve a tu proyecto → "Settings" → "Domains"
2. Agrega `admin.nexlynk.app`
3. Configura los DNS records

---

## 5. Configurar Supabase para Producción

### URLs Autorizadas:
1. Ve a Supabase Dashboard → Settings → API
2. En "API Settings" → "JWT Settings"
3. Agrega las URLs:
   - `https://tu-pagina.pages.dev`
   - `https://tu-admin.vercel.app`

### Redirect URLs (Auth):
1. Ve a Authentication → URL Configuration
2. Agrega:
   - Site URL: `https://tu-admin.vercel.app`
   - Redirect URLs:
     - `https://tu-admin.vercel.app/dashboard`
     - `http://localhost:4300/dashboard`

---

## Comandos Útiles

```bash
# Verificar build local
npm run build

# Deploy manual web
cd apps/web && npm run build

# Deploy manual admin
cd apps/admin && npm run build

# Deploy manual API
cd apps/api && npm run build
```

---

## Variables de Entorno Resumen

### API (Render)
| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | URL de tu proyecto Supabase |
| `SUPABASE_ANON_KEY` | Key pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Key privada de Supabase |
| `JWT_SECRET` | Secreto para JWT (genera uno seguro) |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

### Admin (Vercel)
| Variable | Descripción |
|----------|-------------|
| `API_URL` | URL de tu API + `/api` |

### Web (Cloudflare Pages)
| Variable | Descripción |
|----------|-------------|
| `API_URL` | URL de tu API + `/api` |

---

## Costos Estimados

| Servicio | Plan | Costo |
|----------|------|-------|
| Supabase | Free | $0 |
| Render | Free | $0 (con limitaciones) |
| Vercel | Free | $0 |
| Cloudflare Pages | Free | $0 |
| **Total** | | **$0/mes** |

---

## Notas Importantes

### Render Free Tier:
- Se duerme después de 15 minutos de inactividad
- Tarda ~30-50 segundos en despertar
- 750 horas/mes gratis
- Perfecto para desarrollo y producción inicial

### Para producción con tráfico:
- Considera el plan Starter de Render ($7/mo)
- O upgrade a Vercel Pro ($20/mo) para el admin

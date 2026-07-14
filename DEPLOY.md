# Nexlynk Deployment Guide

## Prerrequisitos

1. Cuenta en [Cloudflare](https://cloudflare.com) (gratis)
2. Cuenta en [Vercel](https://vercel.com) (gratis)
3. Cuenta en [Railway](https://railway.app) (gratis tier)
4. Cuenta en [Supabase](https://supabase.com) (ya configurada)
5. Dominio registrado (opcional pero recomendado)

---

## 1. Deploy API (Railway)

### Pasos:
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Haz click en "New Project" → "Deploy from GitHub repo"
4. Selecciona el repositorio `nexlynk`
5. Configura:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/main`

### Variables de Entorno:
```
SUPABASE_URL=tu-url-de-supabase
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
JWT_SECRET=tu-secreto-jwt-seguro
NODE_ENV=production
PORT=3000
```

### Resultado:
Tu API estará en: `https://tu-proyecto.up.railway.app`

---

## 2. Deploy Admin (Vercel)

### Pasos:
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Haz click en "New Project"
4. Selecciona el repositorio `nexlynk`
5. Configura:
   - **Framework Preset**: Angular
   - **Root Directory**: `apps/admin`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist/browser`

### Variables de Entorno:
```
API_URL=https://tu-api.up.railway.app/api
```

### Resultado:
Tu admin estará en: `https://tu-admin.vercel.app`

---

## 3. Deploy Web (Cloudflare Pages)

### Pasos:
1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Ve a "Workers & Pages" → "Create Application"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Production branch**: `main`
   - **Build command**: `cd apps/web && npm install && npm run build`
   - **Build output directory**: `apps/web/dist`
   - **Node.js version**: 18

### Variables de Entorno:
```
API_URL=https://tu-api.up.railway.app/api
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

### API (Railway)
| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | URL de tu proyecto Supabase |
| `SUPABASE_ANON_KEY` | Key pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Key privada de Supabase |
| `JWT_SECRET` | Secreto para JWT (genera uno seguro) |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

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
| Railway | Hobby | $5/mes (o free con limitaciones) |
| Vercel | Free | $0 |
| Cloudflare Pages | Free | $0 |
| **Total** | | **$0 - $5/mes** |

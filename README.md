# Nexlynk

> El enlace entre tu negocio y el mundo

## Descripción

Nexlynk es una plataforma SaaS que permite a negocios locales crear su página de negocio interactiva con un solo enlace. Similar a Linktree pero enfocado en negocios locales con integración directa de WhatsApp, Google Maps y menús interactivos.

## Características Principales

- **Página de Negocio Interactiva**: Un solo enlace con toda la información de tu negocio
- **Integración con WhatsApp**: Pedidos directos por WhatsApp con mensaje prellenado
- **Google Maps**: Ubicación exacta del negocio con un clic
- **Menú Interactivo**: Menú digital que permite seleccionar items y generar pedidos
- **Analytics**: Estadísticas de visitas e interacciones (plan Pro+)
- **Multi-ubicación**: Soporte para negocios con múltiples sucursales

## Stack Tecnológico

- **Frontend (Público)**: Astro - Framework estático con 0KB JS por defecto
- **Admin Panel**: Angular - Framework completo para aplicaciones empresariales
- **API**: NestJS - Framework backend escalable y modular
- **Base de Datos**: PostgreSQL via Supabase - BaaS con auth integrado
- **Monorepo**: Nx - Workspace para múltiples aplicaciones

## Estructura del Proyecto

```
nexlynk/
├── apps/
│   ├── web/          # Página pública (Astro)
│   ├── admin/        # Panel de administración (Angular)
│   └── api/          # Backend API (NestJS)
├── libs/
│   └── shared/       # Código compartido entre apps
│       └── src/
│           ├── types/    # Definiciones de tipos TypeScript
│           ├── constants/ # Constantes de la aplicación
│           └── utils/    # Utilidades y helpers
└── tools/            # Scripts de build y herramientas
```

## Planes y Precios

| Plan | Precio | Items | Escaneos/mes |
|------|--------|-------|--------------|
| Free | $0 | 15 | 100 |
| Basic | $5/mes | 50 | 500 |
| Pro | $12/mes | 200 | 5,000 |
| Business | $25/mes | 1,000 | 25,000 |
| Enterprise | Personalizado | Ilimitado | Ilimitado |

## Desarrollo

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Iniciar solo la app web
npm run dev:web

# Iniciar solo el admin
npm run dev:admin

# Iniciar solo la API
npm run dev:api
```

### Comandos Disponibles

```bash
npm run build          # Build todas las apps
npm run test           # Ejecutar todos los tests
npm run lint           # Verificar código con ESLint
npm run format         # Formatear código con Prettier
npm run format:check   # Verificar formato sin modificar
```

## Deployment

- **Web (Astro)**: Cloudflare Pages
- **Admin (Angular)**: Vercel
- **API (NestJS)**: Railway
- **Base de Datos**: Supabase

## Roadmap

### Fase 1 - MVP (Semanas 1-4)
- [ ] Autenticación de usuarios
- [ ] CRUD de negocios
- [ ] CRUD de menús
- [ ] Página pública básica
- [ ] Integración WhatsApp

### Fase 2 - Core (Semanas 5-8)
- [ ] Analytics básico
- [ ] Multi-ubicación
- [ ] Personalización de temas
- [ ] Optimización SEO

### Fase 3 - Growth (Semanas 9-12)
- [ ] Sistema de pagos
- [ ] Planes premium
- [ ] Integraciones adicionales
- [ ] App móvil (React Native)

## Contribuir

Las contribuciones son bienvenidas. Por favor, lee el CONTRIBUTING.md para más detalles.

## Licencia

MIT © Nexlynk

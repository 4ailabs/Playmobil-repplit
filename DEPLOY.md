# Guía de Despliegue - Los Cuatro Caminos de la Vida

## 📋 Pre-requisitos

- Cuenta de GitHub
- Cuenta de Vercel
- Node.js 18+ (para desarrollo local)

## 🚀 Pasos para Subir a GitHub

### 1. Preparar el repositorio local

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Aplicación Los Cuatro Caminos de la Vida"
```

### 2. Crear repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. Nombre sugerido: `cuatro-caminos-vida`
3. Descripción: "Aplicación web 3D para dinámicas sistémicas - Playworld Pro"
4. Público o privado según tus necesidades
5. NO inicialices con README (ya tienes uno)

### 3. Conectar y subir

```bash
# Agregar origin remoto (reemplaza con tu URL)
git remote add origin https://github.com/TU-USUARIO/cuatro-caminos-vida.git

# Subir al repositorio
git branch -M main
git push -u origin main
```

## 🌐 Desplegar en Vercel

### Opción 1: Deploy desde GitHub (Recomendado)

1. Ve a [Vercel](https://vercel.com)
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Configuración automática detectada:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Para producción
vercel --prod
```

## ⚙️ Configuración de Variables de Entorno

Si usas base de datos, configura en Vercel Dashboard:

```
DATABASE_URL=tu_url_de_postgresql
NODE_ENV=production
```

## 🔧 Configuración de Build

La aplicación está configurada para:

- **Frontend**: Build estático con Vite → `dist/public`
- **Backend**: Bundle con ESBuild → `dist/index.js`
- **Routing**: SPA con fallback a `index.html`

## 📱 Verificaciones Post-Deploy

Después del deploy, verifica:

1. ✅ La aplicación carga correctamente
2. ✅ Los muñecos 3D se renderizan
3. ✅ La colocación automática funciona
4. ✅ Los controles táctiles en móvil/tablet
5. ✅ La exportación de imagen funciona
6. ✅ El modo pantalla completa funciona

## 🐛 Troubleshooting

### Build falla
- Verificar que todas las dependencias estén en `package.json`
- Revisar errores de TypeScript: `npm run check`

### Assets 3D no cargan
- Verificar rutas de texturas en `/client/public/`
- Confirmar configuración de assets estáticos

### Errores de memoria
- Configurar `--max-old-space-size=4096` si es necesario

## 🔄 Updates Automáticos

Con la configuración actual:
- Push a `main` → Deploy automático en Vercel
- Pull requests → Preview deployments
- Rollbacks disponibles en Vercel Dashboard

## 🌍 Dominio Personalizado

Para usar tu propio dominio:
1. En Vercel Dashboard → Settings → Domains
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones de Vercel

## 📊 Monitoreo

Vercel incluye automáticamente:
- Analytics de performance
- Logs de función
- Métricas de uso
- Error tracking

## 🔐 Consideraciones de Seguridad

- Variables sensibles solo en Vercel Environment Variables
- No incluir `.env` en el repositorio
- Revisar permisos de repositorio según necesidad (público/privado)

---

**¡Tu aplicación estará lista para terapeutas en todo el mundo!** 🌟
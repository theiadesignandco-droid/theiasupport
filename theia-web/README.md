# THEIA — Plataforma Web

## Cómo deployar en Vercel (sin código)

### PASO 1 — Subir a GitHub
1. Entrá a https://github.com
2. Creá una cuenta gratis (si no tenés)
3. Click en "New repository" → nombre: `theia-web` → Public → Create
4. Click en "uploading an existing file"
5. Arrastrá TODOS los archivos de esta carpeta (incluyendo la carpeta `src`)
6. Click "Commit changes"

### PASO 2 — Deployar en Vercel
1. Entrá a https://vercel.com
2. "Sign up" con tu cuenta de GitHub
3. Click "Add New Project"
4. Seleccioná el repo `theia-web`
5. Framework: **Vite** (lo detecta automático)
6. Click "Deploy"
7. En 2 minutos tenés la URL: `theia-web.vercel.app`

### PASO 3 — Variables de entorno (opcional)
Si en el futuro querés proteger la API key de Claude:
- En Vercel → Settings → Environment Variables
- Agregar: `VITE_ANTHROPIC_KEY` = tu-api-key

## Usuarios del sistema
| Usuario  | Contraseña  | Rol           |
|----------|-------------|---------------|
| admin    | theia2026   | Administrador |
| vendedor | vende2026   | Vendedor      |
| theia    | cliente123  | Cliente       |

## Tecnologías
- React 18 + Vite
- Claude API (Anthropic)
- Google Fonts (Outfit)

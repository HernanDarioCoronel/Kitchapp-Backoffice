# Kitchapp Backoffice

Aplicación de escritorio para la gestión de restaurantes. Proporciona un backoffice completo con gestión de platos, productos, pedidos, mesas, cocina, inventario, proveedores y caja registradora.

> Este repositorio contiene **solo el frontend/escritorio**. Requiere el backend `Kitchapp-Backend` corriendo en `localhost:8080`.

## Stack técnico

- **Electron** 39 — aplicación de escritorio multiplataforma
- **React** 19 + **TypeScript** 5.9
- **Vite** 7 + electron-vite — build y dev server
- **TailwindCSS** 4 + **shadcn/ui** — componentes y estilos
- **TanStack React Query** 5 — gestión de estado del servidor
- **React Router** 7 — enrutamiento con HashRouter
- **React Hook Form** — formularios
- **Axios** — cliente HTTP con interceptor JWT

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js     | 18.x o superior |
| npm         | 9.x o superior |
| Backend     | Kitchapp-Backend corriendo en `localhost:8080` |

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Kitchapp-Backoffice
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y rellena los valores:

```bash
cp .env.example .env
```

Contenido del `.env`:

```dotenv
API_URL=http://localhost:8080/api
VITE_API_URL=http://localhost:8080/api
SWAGGER_URL=http://localhost:8080/v3/api-docs
```

> Ajusta la URL si el backend corre en un host o puerto distinto.

### 4. Levantar el backend

Antes de arrancar el backoffice, asegúrate de que `Kitchapp-Backend` está corriendo. Consulta su README para las instrucciones de puesta en marcha.

### 5. Modo desarrollo

```bash
npm run dev
```

Abre la ventana de Electron con hot-reload habilitado.

## Compilar para producción

```bash
# Windows (.exe / NSIS installer)
npm run build:win

# macOS (.dmg)
npm run build:mac

# Linux (.AppImage / .deb / .snap)
npm run build:linux
```

Los artefactos se generan en la carpeta `dist/`.

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Dev server con hot-reload en Electron |
| `npm run build` | Compila con chequeo de tipos (todos los targets) |
| `npm run build:win` | Ejecutable Windows |
| `npm run build:mac` | App macOS |
| `npm run build:linux` | App Linux |
| `npm run typecheck` | Verificación TypeScript sin emitir |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Estructura del proyecto

```
src/
├── main/               # Proceso principal de Electron
│   └── index.ts        # Creación de ventana, IPC handlers
├── preload/            # Bridge entre main y renderer
└── renderer/src/       # Aplicación React
    ├── App.tsx          # Raíz con routing de autenticación
    ├── components/      # Componentes compartidos y UI (shadcn)
    ├── pages/           # Páginas por módulo
    │   ├── login/       # Auth (contexto, hooks)
    │   ├── dashboard/
    │   ├── dishes/
    │   ├── products/
    │   ├── orders/
    │   ├── kitchen/
    │   ├── masters/     # Tablas, empleados, categorías...
    │   └── suppliers/
    ├── lib/
    │   └── api-client.ts  # Instancia Axios con interceptor JWT
    └── hooks/           # Hooks reutilizables
```

## Módulos de la aplicación

| Ruta | Módulo | Descripción |
|------|--------|-------------|
| `/` | Dashboard | Resumen general |
| `/dishes` | Platos | Catálogo de platos con ingredientes |
| `/products` | Productos | Ingredientes y productos de inventario |
| `/orders` | Pedidos | Mapa de mesas y gestión de comandas |
| `/kitchen` | Cocina | Vista de cocina con estado de platos |
| `/masters` | Maestros | Tablas, categorías, empleados, unidades... |
| `/suppliers` | Proveedores | Gestión de proveedores |

## Autenticación

La app usa JWT. El token se almacena en `localStorage` y se renueva automáticamente 60 segundos antes de su expiración. Si el refresco falla, el usuario es redirigido al login.

Credenciales por defecto del backend de desarrollo:

- **Usuario:** `admin@kitchapp.local`
- **Contraseña:** `Admin123!`

## IDE recomendado

[VSCode](https://code.visualstudio.com/) con las extensiones:
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Notas de desarrollo

- Se usa `HashRouter` en lugar de `BrowserRouter` por compatibilidad con Electron.
- El proxy de Vite (`/api` → `http://localhost:8080`) solo funciona en modo desarrollo. En producción, la app apunta directamente a `VITE_API_URL`.
- El preload tiene `sandbox: false` para permitir acceso a las utilidades de electron-toolkit.

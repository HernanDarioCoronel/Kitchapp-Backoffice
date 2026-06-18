# Guía de uso — Kitchapp Backoffice

Manual de usuario de la aplicación de escritorio Kitchapp. Cubre los módulos principales del backoffice de restaurante.

---

## Requisitos previos

Antes de abrir la aplicación, asegúrate de que:

1. El backend `Kitchapp-Backend` está corriendo en `http://localhost:8080`.
2. La base de datos PostgreSQL está activa (`docker compose up -d`).

---

## Inicio de sesión

Al abrir la aplicación se muestra la pantalla de login.

| Campo | Valor por defecto |
|-------|-------------------|
| Email | `admin@kitchapp.local` |
| Contraseña | `Admin123!` |

Tras autenticarte correctamente, se carga el **Dashboard** principal.

> El token de sesión se renueva automáticamente. Si la sesión expira, la aplicación redirige al login.

---

## Navegación

La barra lateral izquierda contiene el menú principal. Puede colapsarse con el botón de la esquina superior izquierda para ganar espacio en pantalla.

---

## Dashboard

Vista general con métricas del restaurante. Proporciona un resumen del estado actual de las operaciones.

---

## Platos (`/dishes`)

Gestión del catálogo de platos del restaurante.

### Ver platos

La página muestra todos los platos en formato de tarjetas con imagen, nombre, precio y disponibilidad.

Usa la **barra de búsqueda** (parte superior) para filtrar por nombre en tiempo real.

### Crear un plato

1. Pulsa **Nuevo plato**.
2. Completa el formulario:
   - **Nombre** — nombre del plato
   - **Descripción** — descripción breve
   - **Tiempo de preparación** — en minutos
   - **Precio** — precio de venta
   - **Categoría** — categoría del plato (debe existir en maestros)
   - **Disponible** — activa o desactiva el plato en la carta
   - **Imagen** — sube una imagen desde tu equipo
   - **Ingredientes** — añade productos con cantidad y marca si son opcionales
3. Pulsa **Guardar**.

### Editar un plato

Haz clic en la tarjeta del plato y modifica los campos necesarios.

### Eliminar un plato

Abre el plato y pulsa **Eliminar**. Se pedirá confirmación antes de borrar.

---

## Productos (`/products`)

Gestión de ingredientes y productos del inventario.

### Ver productos

Lista todos los productos con nombre, SKU, tipo, categoría y estado.

Filtra por nombre usando la barra de búsqueda.

### Tipos de producto

| Tipo | Descripción |
|------|-------------|
| `INGREDIENT` | Ingrediente que forma parte de un plato |
| `PRODUCT` | Producto consumible que se vende directamente |

### Crear un producto

1. Pulsa **Nuevo producto**.
2. Completa el formulario:
   - **SKU** — código único del producto
   - **Nombre**
   - **Tipo** — INGREDIENT o PRODUCT
   - **Categoría** — categoría de producto/ingrediente
   - **Tipo de unidad** — kg, litros, unidades, etc.
   - **Calorías por 100g** — opcional
   - **Activo** — si está disponible para su uso
   - **Alérgenos** — selecciona los alérgenos que contiene
3. Pulsa **Guardar**.

### Editar / Eliminar

Misma mecánica que en Platos.

---

## Pedidos y mesas (`/orders`)

Gestión de ocupaciones de mesa y comandas.

### Mapa de mesas

La vista principal muestra un mapa visual con todas las mesas del restaurante organizadas por capas (sala, terraza, barra, etc.).

**Estados de mesa:**

| Color | Estado | Descripción |
|-------|--------|-------------|
| Verde | `OPEN` | Mesa libre, esperando clientes |
| Naranja | `OCCUPIED` | Mesa con ocupación activa |
| Rojo | `UNAVAILABLE` | Mesa fuera de servicio |
| Gris | `CLOSED` | Ocupación cerrada |

### Abrir una mesa

1. Haz clic en una mesa libre (verde).
2. Confirma la apertura de la ocupación.
3. La mesa pasa a estado **OCCUPIED**.

### Ver pedidos de una mesa

Haz clic en una mesa ocupada para ver los pedidos activos asociados a esa ocupación.

### Crear un pedido

1. Con una mesa ocupada seleccionada, pulsa **Nuevo pedido**.
2. Selecciona el empleado que toma el pedido.
3. Añade platos o productos consumibles con su cantidad.
4. Pulsa **Confirmar pedido**.

El pedido queda en estado `WAITING` y aparece en la vista de cocina.

### Estados de pedido

| Estado | Descripción |
|--------|-------------|
| `WAITING` | Pedido enviado, esperando preparación |
| `IN_PREPARATION` | La cocina está preparando el pedido |
| `DONE` | Pedido listo para servir |
| `DELIVERED` | Pedido entregado en mesa |
| `PAID` | Pedido pagado y cerrado |

### Cerrar una mesa

Una vez que todos los pedidos están pagados, cierra la ocupación desde la vista de la mesa. La mesa vuelve al estado libre.

---

## Cocina (`/kitchen`)

Vista diseñada para el personal de cocina. Muestra los pedidos activos agrupados por estado.

### Funcionalidad

- Los pedidos aparecen ordenados por hora de creación.
- Cada pedido muestra los platos que contiene con su cantidad.
- El cocinero actualiza el estado de cada plato o del pedido completo:
  - Pulsa **Preparando** para mover el pedido a `IN_PREPARATION`.
  - Pulsa **Listo** cuando el pedido esté terminado (`DONE`).

La vista de cocina se actualiza automáticamente.

---

## Maestros (`/masters`)

Gestión de tablas de configuración del sistema. Desde aquí se administran los datos que usa el resto de módulos.

### Tablas disponibles

| Sección | Descripción |
|---------|-------------|
| **Mesas** | Configuración de mesas del restaurante (número, capacidad, activa) |
| **Capas de mesas** | Agrupaciones visuales de mesas (sala, terraza, barra...) |
| **Empleados** | Alta y gestión de empleados con rol |
| **Categorías** | Categorías de platos, productos e ingredientes |
| **Tipos de unidad** | Unidades de medida (kg, L, uds, etc.) |
| **Alérgenos** | Listado de alérgenos para etiquetar productos |
| **Impuestos** | Tipos impositivos aplicables |

### Crear / editar registros

Cada sección tiene su propio formulario. El flujo es siempre el mismo:
1. Pulsa **Nuevo** para crear o haz clic en un registro para editarlo.
2. Rellena los campos del formulario.
3. Pulsa **Guardar**.

Para eliminar, abre el registro y pulsa **Eliminar** (se pedirá confirmación).

---

## Proveedores (`/suppliers`)

Gestión del catálogo de proveedores del restaurante.

### Información de un proveedor

| Campo | Descripción |
|-------|-------------|
| NIF | Identificación fiscal |
| Nombre comercial / Razón social | Nombres del proveedor |
| Tipo | PERISHABLES, DRINKS, KITCHENWARE, APPLIANCES, SERVICES |
| Días de reparto | Días de la semana en que hace entregas |
| Contacto | Email, teléfonos |
| IBAN | Cuenta bancaria para pagos |
| Nº RGSEAA | Registro sanitario (si aplica) |

### Crear un proveedor

1. Pulsa **Nuevo proveedor**.
2. Rellena el formulario con los datos del proveedor.
3. Pulsa **Guardar**.

---

## Ajustes y temas

La aplicación soporta modo claro y oscuro. Usa el selector de tema en la barra superior para cambiar entre modos.

---

## Solución de problemas habituales

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| Pantalla en blanco al abrir | Backend no está corriendo | Levanta `Kitchapp-Backend` y recarga |
| Error 401 en cualquier petición | Token expirado o inválido | Cierra sesión y vuelve a entrar |
| Las imágenes de platos no cargan | `ENV_STORAGE_BASE_URL` mal configurado | Verifica la variable en el `.env` del backend |
| Los datos no se actualizan | Caché de React Query | Recarga la página con `Ctrl+R` |
| No aparecen mesas en el mapa | No hay mesas creadas en maestros | Ve a Maestros → Mesas y crea las mesas |

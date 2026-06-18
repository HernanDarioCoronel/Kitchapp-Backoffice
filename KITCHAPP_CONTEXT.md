# KitchApp — Contexto del Proyecto

KitchApp es un sistema de gestión para restaurantes compuesto por un backend REST en Java y una aplicación de escritorio (backoffice) en Electron + React.

---

## Backend

- **Lenguaje / Framework:** Java 21 + Spring Boot 4.0.1
- **Base de datos:** PostgreSQL con migraciones Flyway
- **ORM:** Spring Data JPA + Hibernate
- **Seguridad:** Spring Security con JWT stateless (jjwt 0.12.6), BCrypt para contraseñas
- **Documentación:** Springdoc OpenAPI 2.8.9, Swagger UI disponible en `/swagger-ui`
- **Arquitectura:** Hexagonal / Clean Architecture — capas `api`, `application`, `domain`, `infrastructure`
- **Extras:** MapStruct (mapeo de DTOs), Lombok, WebSocket, spring-dotenv

### Endpoints disponibles (base `/api`)

`/auth`, `/allergens`, `/cash-drawers`, `/categories`, `/dishes`, `/employees`, `/images`, `/inventory-movements`, `/layers`, `/orders`, `/payments`, `/products`, `/purchase-orders`, `/reservations`, `/tables`, `/stock`, `/suppliers`, `/table-occupations`, `/taxes`, `/unit-types`, `/work-logs`

Todos siguen CRUD estándar (`GET` lista, `POST`, `GET /{id}`, `PATCH /{id}`, `DELETE /{id}`) salvo auth y algunos con endpoints adicionales (ej. `/table-occupations/tables/{tableId}/open`, `/orders/{orderId}/dishes/{dishId}`).

---

## Frontend (Backoffice)

- **Runtime:** Electron v39 (aplicación de escritorio Windows/Mac/Linux)
- **UI:** React 19 + TypeScript 5.9
- **Build:** Vite 7 + electron-vite 5
- **Estilos:** TailwindCSS v4 + shadcn/ui (Radix UI) + Lucide icons
- **Estado servidor:** TanStack React Query v5 (caché, queries, mutations)
- **HTTP:** Axios con interceptor que inyecta JWT automáticamente desde localStorage
- **Routing:** React Router v7 con HashRouter (necesario para Electron)
- **Formularios:** React Hook Form
- **Notificaciones:** Sonner (toasts)
- **Temas:** next-themes (dark/light)

### Patrón de código

Cada módulo tiene su carpeta en `src/renderer/src/pages/<modulo>/` con:
- `api/<modulo>.ts` — llamadas Axios
- `hooks/use<Modulo>.ts` — React Query (queries y mutations)
- Componentes de la página y subcomponentes

---

## Módulos implementados (13 rutas activas)

| Módulo | Ruta | Descripción |
|---|---|---|
| **Dashboard** | `/` | Panel operativo en tiempo real: KPIs (órdenes activas, mesas ocupadas, platillos disponibles, empleados activos), ingresos del día, estado de caja registradora, desglose de órdenes por estado, últimas 5 órdenes y pagos del día por método de pago |
| **Dishes** | `/dishes` | CRUD completo de platillos: nombre, descripción, precio, tiempo de preparación, categoría, imagen, disponibilidad e ingredientes (con cantidad y si son opcionales) |
| **Products** | `/products` | CRUD de productos e ingredientes: SKU, nombre, tipo (`INGREDIENT`/`PRODUCT`), categoría, tipo de unidad, calorías, alérgenos |
| **Orders** | `/orders` | Gestión de órdenes con tres vistas: mapa visual de mesas, lista de órdenes filtradas por ocupación, y creación de nueva orden (selección de mesa, empleado, platos y consumibles con control de cantidades) |
| **Kitchen** | `/kitchen` | Vista para cocina: muestra órdenes activas con sus platos y permite cambiar el estado de cada plato (`WAITING` → `IN_PREPARATION` → `DONE`) |
| **Bar** | `/bar` | Vista para barra: muestra los consumibles (bebidas/productos) pendientes en órdenes activas |
| **Table Map** | `/table-map` | Gestión visual del restaurante: administra capas (salones/zonas) y las mesas dentro de cada capa |
| **Masters** | `/masters` | CRUD de datos maestros de infraestructura: capas y mesas del restaurante |
| **Fichaje** | `/fichaje` | Control de jornada laboral: registro de entrada/salida por empleado y calendario de vacaciones |
| **TPV** | `/tpv` | Terminal punto de venta: apertura y cierre de caja registradora (con arqueo), cobro de órdenes con 5 métodos de pago (efectivo con cálculo de cambio, tarjeta crédito/débito, online, transferencia), posibilidad de añadir artículos durante el cobro, y arqueo comparando efectivo esperado vs. contado físico |
| **Almacén** | `/almacen` | Gestión de inventario: niveles de stock por producto con indicadores de estado (Sin Stock / Bajo / OK) y umbral mínimo configurable; registro de movimientos de inventario (Compra, Venta, Merma, Ajuste) con empleado, cantidad y motivo |
| **Proveedores** | `/proveedores` | CRUD de proveedores: NIF, nombre comercial, razón social, tipo (Perecederos / Bebidas / Menaje / Electrodomésticos / Servicios), días de entrega, contacto (email, teléfonos), IBAN, número RGSEAA y flag de recargo de equivalencia |
| **Compras** | `/compras` | Gestión de órdenes de compra a proveedores: ciclo de vida completo (Borrador → Enviado → Recibido → Verificado → Cancelado), líneas de pedido con producto, cantidad, precio unitario e IVA, y cálculo automático de subtotales, base imponible y total |

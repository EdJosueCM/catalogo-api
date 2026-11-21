# Catálogo API

API REST con Node.js, Express, MongoDB y autenticación JWT para gestionar un catálogo de productos y la lista de favoritos de cada usuario.

## 1. Integrantes del equipo

| Integrante | Usuario de GitHub | Aportes principales |
|---|---|---|
| _Nombre Apellido 1_ | _@usuario1_ | _p. ej. modelos, CRUD de productos, colección de Postman_ |
| _Nombre Apellido 2_ | _@usuario2_ | _p. ej. autenticación JWT, roles, favoritos, README_ |

## 2. Propósito del proyecto

- Cualquier persona puede consultar el catálogo y filtrarlo por categoría.
- Los usuarios registrados inician sesión con JWT y gestionan **sus propios** favoritos.
- Solo el administrador crea, actualiza y elimina productos.

## 3. Elección de base de datos

Usamos **MongoDB** con **Mongoose** por estas razones:

- Los tres recursos (usuarios, productos y favoritos) se representan bien como documentos.
- Mongoose permite declarar validaciones e **índices únicos** en el esquema:
  - correo de usuario único;
  - nombre de producto único, sin distinguir mayúsculas ni acentos;
  - par `usuario + producto` único en favoritos.
- `populate` resuelve la relación entre un favorito y su producto.
- Contra inyección NoSQL:
  - los validadores solo aceptan cadenas y números (un objeto como `{"$ne": null}` se rechaza);
  - solo se copian los campos permitidos (`req.datos`);
  - `strictQuery` está activo.

Los modelos están en [`src/models`](src/models).

### Modelo de datos

| Colección | Campos | Reglas |
|---|---|---|
| `usuarios` | `nombre`, `correo`, `passwordHash`, `rol`, fechas | `correo` único; `rol` ∈ {`usuario`, `admin`}; `passwordHash` nunca se devuelve |
| `productos` | `nombre`, `descripcion`, `categoria`, `precio`, fechas | todos obligatorios; `precio > 0`; `nombre` único |
| `favoritos` | `usuario` (ref), `producto` (ref), `agregadoEn` | índice único `{usuario, producto}` |

**Eliminación de productos:** al eliminar un producto se borran también, en cascada, todos los favoritos que lo referencian ([`productos.repository.js`](src/repositories/productos.repository.js)). La respuesta indica cuántos favoritos se eliminaron (`favoritosEliminados`). Así ningún favorito apunta a un producto inexistente.

### Estructura del proyecto

```
src/
  config/        variables de entorno y conexión a MongoDB
  models/        esquemas de Mongoose (Usuario, Producto, Favorito)
  repositories/  acceso a datos (únicas piezas que usan los modelos)
  controllers/   lógica de cada endpoint
  routes/        definición de rutas y middlewares por ruta
  middlewares/   JWT y roles, validaciones, manejo de errores
  utils/         ApiError y formato de respuestas
  app.js         configuración de Express
  server.js      punto de entrada
scripts/         seed de productos, creación del admin, ejecución de pruebas
postman/         colección y entorno de ejemplo
```

## 4. Requisitos de instalación

- Node.js 20 o superior (probado con Node 24) y npm.
- MongoDB 6 o superior. Puede ser:
  - local ([MongoDB Community Server](https://www.mongodb.com/try/download/community));
  - un clúster gratuito de MongoDB Atlas.
- Postman (opcional; las pruebas también corren con Newman desde la terminal).

## 5. Instalación de dependencias

```bash
git clone https://github.com/<usuario>/<repositorio>.git
cd <repositorio>
npm ci        # instala exactamente lo que indica package-lock.json
```

## 6. Configuración de variables de entorno

Copia la plantilla y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto HTTP | `3000` |
| `MONGODB_URI` | Cadena de conexión | `mongodb://127.0.0.1:27017/catalogo` |
| `JWT_SECRET` | Secreto de firma, mínimo 32 caracteres | genera uno con el comando de abajo |
| `JWT_EXPIRES_IN` | Vigencia del token | `1h` |
| `BCRYPT_ROUNDS` | Costo de bcrypt | `10` |
| `ADMIN_NOMBRE` / `ADMIN_CORREO` / `ADMIN_PASSWORD` | Datos del administrador inicial | — |

Para generar un secreto seguro:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`.env` está en `.gitignore` y **nunca** debe subirse al repositorio.

## 7. Inicialización de datos y del administrador

```bash
npm run seed          # inserta 7 productos ficticios (se puede repetir sin duplicar)
npm run crear-admin   # crea o actualiza el admin con ADMIN_CORREO y ADMIN_PASSWORD
```

El script `crear-admin` es la **única** forma de obtener el rol `admin`.

- El registro público ignora cualquier campo `rol` y siempre crea usuarios con rol `usuario`.
- Si el correo del admin ya existe, el script lo promueve a `admin` y actualiza su contraseña.

## 8. Comandos de ejecución

```bash
npm start      # producción
npm run dev    # desarrollo, reinicia al guardar cambios (node --watch)
```

La API queda en `http://localhost:3000/api`. Comprobación rápida: `GET /api/salud`.

## 9. Documentación de las rutas

Prefijo: `/api`. Todas las respuestas son JSON con el mismo formato:

```jsonc
// Éxito
{ "ok": true, "mensaje": "Producto creado", "data": { ... } }

// Error
{ "ok": false, "error": { "codigo": "DATOS_INVALIDOS", "mensaje": "Datos inválidos", "detalles": { "precio": "..." } } }
```

Las rutas protegidas requieren la cabecera `Authorization: Bearer <token>`.

### Resumen

| Método | Ruta | Acceso | Éxito | Errores posibles |
|---|---|---|---|---|
| POST | `/auth/registro` | Público | 201 | 400, 409 |
| POST | `/auth/login` | Público | 200 | 400, 401 |
| GET | `/productos?categoria=` | Público | 200 | 400 |
| GET | `/productos/:id` | Público | 200 | 400, 404 |
| POST | `/productos` | Admin | 201 | 400, 401, 403, 409 |
| PUT | `/productos/:id` | Admin | 200 | 400, 401, 403, 404, 409 |
| DELETE | `/productos/:id` | Admin | 200 | 400, 401, 403, 404 |
| GET | `/favoritos` | Autenticado | 200 | 401 |
| POST | `/favoritos` | Autenticado | 201 | 400, 401, 404, 409 |
| DELETE | `/favoritos/:productoId` | Autenticado | 200 | 400, 401, 404 |

### Códigos HTTP

| Código | Uso en esta API |
|---|---|
| 200 | Consultas, actualizaciones y eliminaciones exitosas. Las eliminaciones devuelven 200 con un cuerpo de confirmación. |
| 201 | Creación exitosa (registro, producto, favorito). |
| 400 | Datos inválidos: campos faltantes o vacíos, correo mal formado, precio ≤ 0 o no numérico, identificador no válido, JSON mal formado. Usamos **400** para todos los errores de validación. |
| 401 | Falta el token, token con firma inválida, token vencido o credenciales incorrectas en el login. |
| 403 | Usuario autenticado sin el rol necesario (un `usuario` intentando modificar el catálogo). |
| 404 | Producto o favorito inexistente, o ruta desconocida. |
| 409 | Duplicados: correo ya registrado, nombre de producto repetido, producto ya en favoritos. |
| 500 | Error inesperado. Se responde con un mensaje genérico, sin trazas ni detalles internos. |

### `POST /auth/registro`

Petición:

```json
{ "nombre": "Ana López", "correo": "ana@ejemplo.test", "password": "ClaveSegura1" }
```

- `nombre`: obligatorio, máximo 80 caracteres.
- `correo`: formato válido; se guarda en minúsculas.
- `password`: entre 8 y 72 caracteres.
- Cualquier otro campo (incluido `rol`) se ignora.

Respuesta `201`:

```json
{ "ok": true, "mensaje": "Usuario registrado",
  "data": { "id": "665f...", "nombre": "Ana López", "correo": "ana@ejemplo.test", "rol": "usuario",
            "createdAt": "...", "updatedAt": "..." } }
```

### `POST /auth/login`

Petición: `{ "correo": "ana@ejemplo.test", "password": "ClaveSegura1" }`

Respuesta `200`:

```json
{ "ok": true,
  "data": { "token": "eyJhbGciOi...", "tipo": "Bearer", "expiraEn": "1h",
            "usuario": { "id": "665f...", "nombre": "Ana López", "correo": "ana@ejemplo.test", "rol": "usuario" } } }
```

- El JWT (HS256) lleva `sub` (id del usuario), `rol`, `iat` y `exp`.
- En cada ruta protegida se verifican la firma y la expiración.
- Después se carga el usuario desde la base de datos para usar su rol actual.
- El login responde `401 "Credenciales incorrectas"` tanto si el correo no existe como si la contraseña es incorrecta.

### `GET /productos`

- Lista los productos ordenados por nombre.
- Filtro opcional: `?categoria=Hogar`. No distingue mayúsculas ni acentos.

Respuesta `200`: `{ "ok": true, "data": [ { "id", "nombre", "descripcion", "categoria", "precio", ... } ] }`

### `GET /productos/:id`

- `200` con el producto.
- `404` si no existe.
- `400` si el id no es un ObjectId válido.

### `POST /productos` y `PUT /productos/:id` (admin)

```json
{ "nombre": "Lámpara", "descripcion": "Lámpara LED", "categoria": "Hogar", "precio": 459.0 }
```

- Los cuatro campos son obligatorios en ambos métodos: `PUT` reemplaza el producto completo.
- `precio` debe ser un número mayor que 0.
- Los campos no reconocidos se ignoran.
- Respuestas: `201` al crear; `200` al actualizar con el producto resultante.

### `DELETE /productos/:id` (admin)

Respuesta `200`:

```json
{ "ok": true, "mensaje": "Producto eliminado", "data": { "id": "665f...", "favoritosEliminados": 2 } }
```

### `GET /favoritos`

Respuesta `200` con los favoritos del usuario del token:

```json
{ "ok": true, "data": [ { "id": "...", "producto": { "id": "...", "nombre": "...", "precio": 899 }, "agregadoEn": "..." } ] }
```

### `POST /favoritos`

Petición: `{ "productoId": "665f..." }`

| Código | Caso |
|---|---|
| `201` | Favorito agregado. |
| `400` | Id inválido. |
| `404` | El producto no existe. |
| `409` | El producto ya está en favoritos. |

### `DELETE /favoritos/:productoId`

- `200` si se quitó.
- `404` si el producto no está en los favoritos **del usuario autenticado**. Esto incluye los favoritos de otros usuarios: para quien hace la petición, simplemente no existen.

> La identidad del usuario se toma siempre del token verificado (`req.usuario.id`). La API nunca recibe un id de usuario en el cuerpo ni en la URL de favoritos.

## 10. Pasos para ejecutar las pruebas

La colección está en [`postman/Catalogo.postman_collection.json`](postman/Catalogo.postman_collection.json). El entorno de ejemplo, sin secretos, está en [`postman/Catalogo.postman_environment.json`](postman/Catalogo.postman_environment.json).

Antes de empezar:

- MongoDB debe estar en marcha.
- Ya ejecutaste `npm run seed` y `npm run crear-admin`.
- El servidor está iniciado con `npm start`.

### Opción A: terminal (Newman)

```bash
npm run test:postman       # ejecuta "Flujo principal" con los datos de .env
# Detén el servidor (Ctrl+C) y vuelve a iniciarlo con: npm start
npm run test:persistencia  # comprueba que usuarios, productos y favoritos siguen ahí
```

- El script pasa `ADMIN_CORREO`, `ADMIN_PASSWORD` y `JWT_SECRET` a Newman en memoria; no los escribe en ningún archivo.
- Guarda en `postman/*.local.json` (ignorado por git) solo los correos de prueba generados, para que la prueba de persistencia los reutilice.

### Opción B: Postman

1. Importa la colección y el entorno.
2. En el entorno **Catálogo API - local**, escribe en *Current value* (no en *Initial value*, para no exportarlos):
   - `admin_correo` y `admin_password`: los mismos de tu `.env`;
   - `jwt_secret`: el mismo `JWT_SECRET` del `.env`. Sirve para fabricar un token vencido válido; sin él la prueba sigue esperando `401`, pero omite comprobar el motivo.
3. Ejecuta la carpeta **Flujo principal** con el *Collection Runner*, en orden.
4. Reinicia el servidor y ejecuta **Persistencia (ejecutar tras reiniciar)**.

### Casos cubiertos

| Carpeta | Casos |
|---|---|
| 1. Autenticación | Registro A y B (B envía `rol: admin` y se ignora); correo duplicado `409`; datos inválidos `400`; login correcto; contraseña incorrecta y correo inexistente `401`; login de admin |
| 2. Catálogo público | Listar sin token; filtrar por categoría; consultar por id; inexistente `404`; id inválido `400` |
| 3. CRUD admin | Crear `201`; nombre duplicado `409`; precio negativo, cero y no numérico `400`; campos vacíos `400`; consultar; actualizar `200`; actualizar inexistente `404` |
| 4. Autenticación y permisos | Sin token `401` (producto y favoritos); token vencido `401`; token manipulado `401`; crear, actualizar y eliminar con rol usuario `403` |
| 5. Favoritos | Agregar `201`; duplicado `409`; inexistente `404`; id inválido u objeto `{"$ne":null}` `400`; listar; quitar `200`; quitar de nuevo `404` |
| 6. Aislamiento | B no ve el favorito de A; B intenta quitar el favorito de A `404`; el favorito de A permanece |
| 7. Eliminación | El admin elimina un producto y se borra en cascada el favorito de B; consultar eliminado `404`; eliminar de nuevo `404` |
| Persistencia | Tras reiniciar: login de A, catálogo con al menos 5 productos y el favorito de A sigue guardado |

Cada ejecución usa correos nuevos (`usuario.a.<id>@ejemplo.test`), así que la colección se puede repetir sin limpiar la base de datos.

## Recursos y herramientas de apoyo

- Documentación oficial de [Express 5](https://expressjs.com/), [Mongoose](https://mongoosejs.com/docs/), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [bcryptjs](https://github.com/dcodeIO/bcrypt.js) y [Newman](https://github.com/postmanlabs/newman).
- _Indiquen aquí cualquier otra herramienta (por ejemplo, asistentes de IA) y qué partes del código apoyó._

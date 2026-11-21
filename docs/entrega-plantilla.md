# Entrega: Catálogo API

> Plantilla para generar `Entrega_Catalogo_Apellido1_Apellido2.pdf`. Completen los campos en cursiva y exporten a PDF.

- **Integrantes:** _Nombre Apellido 1_, _Nombre Apellido 2_
- **Repositorio público:** _https://github.com/usuario/repositorio_
- **Video explicativo:** _enlace de YouTube (no listado) o Drive (lectura con enlace)_
- **Commit final:** _hash completo de `git rev-parse HEAD`_

## Resumen de aportes

| Integrante | Aportes |
|---|---|
| _Integrante 1_ | _…_ |
| _Integrante 2_ | _…_ |

## Tabla de pruebas

Completen la columna "Resultado obtenido" con lo que muestre Postman o `npm run test:postman`.

| # | Caso | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| 1 | Registro de usuario A | 201, rol `usuario`, sin contraseña en la respuesta | |
| 2 | Registro de B enviando `rol: admin` | 201, rol `usuario` | |
| 3 | Registro con correo duplicado | 409 | |
| 4 | Registro con datos inválidos | 400 con detalle por campo | |
| 5 | Login correcto | 200 con JWT | |
| 6 | Login con contraseña incorrecta o correo inexistente | 401 | |
| 7 | Listar productos sin token | 200, al menos 5 productos | |
| 8 | Filtrar por categoría | 200, solo esa categoría | |
| 9 | Consultar producto existente / inexistente | 200 / 404 | |
| 10 | Crear producto (admin) | 201 | |
| 11 | Crear con precio ≤ 0 o no numérico | 400 | |
| 12 | Crear con campos vacíos | 400 | |
| 13 | Crear con nombre duplicado | 409 | |
| 14 | Actualizar producto (admin) | 200 con datos nuevos | |
| 15 | Eliminar producto (admin) | 200, favoritos borrados en cascada | |
| 16 | Ruta protegida sin token | 401 | |
| 17 | Ruta protegida con token vencido | 401 "El token ha expirado" | |
| 18 | Ruta protegida con token manipulado | 401 "Token inválido" | |
| 19 | Crear, actualizar o eliminar con rol usuario | 403 | |
| 20 | Agregar favorito | 201 | |
| 21 | Favorito duplicado | 409 | |
| 22 | Favorito de producto inexistente | 404 | |
| 23 | Listar y quitar favorito | 200 / 200 | |
| 24 | B lista favoritos | No incluye los de A | |
| 25 | B intenta quitar el favorito de A | 404, y el favorito de A permanece | |
| 26 | Reiniciar servidor y consultar | Usuarios, productos y favoritos persisten | |

## Comprobaciones antes de entregar

- [ ] Los enlaces del repositorio y del video abren en una ventana privada.
- [ ] El commit indicado es el último del repositorio y coincide con el código mostrado en el video.
- [ ] `git clone` + `npm ci` + configurar `.env` + `npm run seed` + `npm run crear-admin` + `npm start` funciona desde una carpeta limpia.
- [ ] El repositorio no contiene `node_modules`, `.env`, tokens vigentes ni datos personales reales.

---

## Guion del video (10:00, dos integrantes)

- **Integrante 1 (I1):** proyecto, modelo de datos y CRUD.
- **Integrante 2 (I2):** JWT, roles y favoritos.

Cada uno habla unos 5 minutos.

| Tiempo | Quién | Contenido | Pantalla |
|---|---|---|---|
| 0:00–0:40 | I1 + I2 | Cada uno se presenta y dice qué hizo. I1 explica en una frase el propósito de la API. | README |
| 0:40–1:40 | I1 | Estructura de carpetas y los tres modelos con sus reglas: correo único, precio mayor que 0, favorito sin duplicados. | `src/`, `src/models/` |
| 1:40–3:00 | I1 | CRUD: crear un producto, de la ruta a la validación, el controlador y el repositorio. Borrado en cascada de favoritos. | `productos.routes.js`, `productos.controller.js`, `productos.repository.js` |
| 3:00–4:20 | I2 | Login: bcrypt y firma del JWT. `verificarToken`: cabecera Bearer, `jwt.verify`, vencido o inválido, usuario cargado de la BD. | `auth.controller.js`, `middlewares/auth.js` |
| 4:20–5:10 | I2 | Control de rol con `requerirRol('admin')`. Control de propiedad: los favoritos se filtran por `req.usuario.id`, que sale del token. | `productos.routes.js`, `favoritos.repository.js` |
| 5:10–6:10 | I2 | Seguimiento de `POST /api/favoritos`: Postman, ruta, token, controlador, MongoDB (Compass) y respuesta JSON. | Postman + VS Code + Compass |
| 6:10–7:10 | I1 | Demo del flujo exitoso: login de admin, crear producto, consultar y filtrar. Demo de validación: precio negativo `400`, campos vacíos `400`, correo duplicado `409`. | Postman |
| 7:10–8:20 | I2 | Demo de permisos: sin token `401`, token vencido `401`, rol usuario `403`. Demo de aislamiento: B no ve los favoritos de A, al quitar uno de A recibe `404` y el de A sigue. | Postman |
| 8:20–9:10 | I1 | Persistencia: Ctrl+C, `npm start` y ejecutar la carpeta "Persistencia". | Terminal + Postman |
| 9:10–10:00 | I2 | Una dificultad y su solución. Cómo ejecutar el proyecto desde el repositorio. | README |

Durante la grabación, no muestren el archivo `.env` ni tokens completos.

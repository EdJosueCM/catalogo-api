# Guía para grabar el video (paso a paso)

Esta guía es para quien nunca ha grabado un video de este tipo. Explica:

- qué preparar antes de grabar;
- qué hacer en pantalla en cada momento;
- un texto que cada integrante puede leer o decir con sus propias palabras.

**Duración total:** 10 minutos. El profesor pide entre 10 y 15, así que **no puede durar menos de 10**.

**Quién hace qué:**

- **Integrante 1:** presenta el proyecto, la base de datos y cómo se crean y borran productos.
- **Integrante 2:** explica el inicio de sesión (JWT), los permisos y los favoritos.

> **Antes de empezar:** lean la sección *Palabras que van a usar* al final. Si entienden esas palabras, el resto del guion tendrá sentido.

---

## Paso 1. Preparar todo (una sola vez, sin grabar)

Háganlo en la computadora donde está el proyecto.

### 1.1 Encender el servidor

1. Abran la carpeta `catalogo-api` en **VS Code**.
2. Abran una terminal: menú *Terminal → New Terminal*.
3. Escriban `npm start` y presionen Enter.
4. Debe aparecer `API escuchando en http://localhost:3000/api`.
5. **No cierren esa terminal** mientras usen la API.

### 1.2 Configurar Postman

Postman es el programa con el que se envían peticiones a la API.

1. Abran **Postman**.
2. Presionen **Import** (arriba a la izquierda) y arrastren estos dos archivos de la carpeta `catalogo-api/postman/`:
   - `Catalogo.postman_collection.json`
   - `Catalogo.postman_environment.json`
3. Vayan a **Environments** en el menú de la izquierda y abran **Catálogo API - local**.
4. Abran el archivo `.env` del proyecto en VS Code y copien estos valores en la columna **Current value** (no en *Initial value*):

   | Variable en Postman | Valor que copian del `.env` |
   |---|---|
   | `admin_correo` | `ADMIN_CORREO` |
   | `admin_password` | `ADMIN_PASSWORD` |
   | `jwt_secret` | `JWT_SECRET` |

5. Presionen **Save** (Ctrl+S).
6. Arriba a la derecha hay un menú que dice *No environment*. Cambien a **Catálogo API - local**.

> ⚠️ Esta pantalla tiene contraseñas. **No la muestren en el video.** Tampoco muestren el archivo `.env`.

### 1.3 Hacer una prueba completa

Así confirman que todo funciona antes de grabar.

1. En la izquierda, en **Collections → Catálogo API**, pasen el mouse sobre la carpeta **Flujo principal**.
2. Presionen los tres puntos `···` y luego **Run folder**.
3. En la ventana que se abre, presionen **Run Catálogo API**.
4. Todas las pruebas deben salir en verde (*Passed*).

Si algo sale en rojo, revisen que el servidor esté encendido y que el entorno esté seleccionado.

### 1.4 Configurar MongoDB Compass

Compass es el programa para ver la base de datos.

1. Abran **MongoDB Compass**.
2. Conéctense a `mongodb://localhost:27017`.
3. Abran la base de datos **catalogo**.
4. Verán tres colecciones: `productos`, `usuarios` y `favoritos`.

### 1.5 Preparar la pantalla para grabar

- En VS Code, suban el tamaño de letra con **Ctrl + +** dos o tres veces, para que el código se lea en el video.
- Dejen abiertas cuatro cosas, sin más pestañas: **VS Code**, **Postman**, **Compass** y la **terminal**.
- Cierren WhatsApp, el correo y las notificaciones.

### 1.6 Elegir cómo grabar

| Situación | Cómo grabar |
|---|---|
| Están juntos en la misma computadora | Usen la **Barra de juegos de Windows** (**Win + Alt + R** para empezar y terminar) u **OBS Studio** (gratis). Se pasan el mouse cuando le toca al otro. |
| Cada uno está en su casa | Hagan una videollamada en **Google Meet, Zoom o Teams** y usen **Grabar**. Quien tiene el proyecto comparte pantalla. Cuando habla el otro, el que comparte hace los clics que le vayan diciendo. |

Prueben el micrófono grabando 20 segundos y escuchándolos antes de grabar en serio.

---

## Paso 2. El guion

Cada parte indica:

- **quién habla**;
- **qué debe verse en pantalla**;
- **qué hacer** (los clics);
- **qué decir** (pueden leerlo, pero suena mejor con sus propias palabras).

Los textos entre corchetes, como **[tu nombre]**, los cambian por sus datos.

---

### Parte 1. Presentación · 0:00 a 0:40 · hablan los dos

**En pantalla:** el archivo `README.md` abierto en VS Code.

**Integrante 1 dice:**
> "Hola, soy **[nombre 1]**. Este proyecto es una API REST hecha con Node.js, Express y MongoDB. Sirve para manejar un catálogo de productos: cualquiera puede ver los productos, los usuarios registrados pueden guardar sus favoritos y solo el administrador puede crear, modificar o borrar productos. Yo me encargué de **[sus aportes, p. ej. la base de datos y el CRUD de productos]**."

**Integrante 2 dice:**
> "Y yo soy **[nombre 2]**. Me encargué de **[sus aportes, p. ej. el inicio de sesión con JWT, los permisos y los favoritos]**."

---

### Parte 2. Cómo está organizado el proyecto · 0:40 a 1:40 · habla el Integrante 1

**En pantalla:** VS Code, con el panel de archivos de la izquierda visible.

**Qué hacer:**

1. Desplieguen la carpeta `src` y vayan señalando cada subcarpeta mientras hablan.
2. Abran `src/models/Usuario.js` y señalen la **línea 8** (`unique: true`) y la **línea 10** (`select: false`).
3. Abran `src/models/Producto.js` y señalen la **línea 14** (precio mayor que cero).
4. Abran `src/models/Favorito.js` y señalen la **línea 23** (índice único).

**Qué decir:**
> "Separamos el código por responsabilidades. En `routes` están las direcciones de la API. En `controllers` está lo que hace cada una. En `repositories` está el código que habla con la base de datos. En `middlewares` están las revisiones que se hacen antes de llegar al controlador, como validar datos o revisar el token.
>
> La base de datos tiene tres colecciones.
> - **Usuarios:** el correo es único, así que no se puede registrar dos veces el mismo. La contraseña no se guarda tal cual, se guarda cifrada, y con `select: false` nunca sale en las respuestas.
> - **Productos:** tienen nombre, descripción, categoría y precio, y aquí validamos que el precio sea mayor que cero.
> - **Favoritos:** unen un usuario con un producto. Este índice único impide que un usuario guarde el mismo producto dos veces."

---

### Parte 3. Crear y borrar un producto (el CRUD) · 1:40 a 3:00 · habla el Integrante 1

**En pantalla:** VS Code.

**Qué hacer:**

1. Abran `src/routes/productos.routes.js` y señalen la **línea 15**: `router.post('/', soloAdmin, validarProducto, ctrl.crear)`.
2. Abran `src/middlewares/validaciones.js` y bajen a la **línea 56** (`validarProducto`).
3. Abran `src/controllers/productos.controller.js` y señalen la función `crear` (**línea 16**).
4. Abran `src/repositories/productos.repository.js` y señalen `eliminar` (**líneas 24 a 30**).

**Qué decir:**
> "CRUD significa crear, leer, actualizar y borrar. Les muestro cómo se crea un producto.
>
> Cuando llega un POST a `/api/productos`, la petición pasa por tres pasos en orden:
> 1. `soloAdmin` revisa que quien la envía sea administrador.
> 2. `validarProducto` revisa los datos: que no haya campos vacíos y que el precio sea un número mayor que cero. Si algo está mal, responde con error 400 y la petición no continúa. Además, solo copia los campos permitidos, así nadie puede colar datos extra.
> 3. El controlador `crear` llama al repositorio, el repositorio guarda en MongoDB y respondemos 201, que significa 'creado'.
>
> Para borrar tuvimos que decidir qué pasa con los favoritos de ese producto. Decidimos borrarlos también, con este `deleteMany`. Así ningún usuario se queda con un favorito que apunta a un producto que ya no existe."

---

### Parte 4. Inicio de sesión y token JWT · 3:00 a 4:20 · habla el Integrante 2

**En pantalla:** VS Code.

**Qué hacer:**

1. Abran `src/controllers/auth.controller.js`:
   - señalen la **línea 19** (`bcrypt.compare`);
   - señalen la **línea 23** (`jwt.sign`).
2. Abran `src/middlewares/auth.js` y recorran `verificarToken`, de la **línea 9** a la **27**.

**Qué decir:**
> "Cuando alguien inicia sesión, comparamos la contraseña que escribe con la versión cifrada guardada, usando bcrypt. Si coincide, generamos un **JWT**: un texto firmado con una clave secreta que solo conoce el servidor. Lleva el id del usuario, su rol y una fecha de vencimiento de una hora. El usuario manda ese token en cada petición protegida.
>
> Este middleware, `verificarToken`, revisa el token así:
> 1. Busca la cabecera `Authorization: Bearer` con el token. Si no hay, responde 401.
> 2. Con `jwt.verify` revisa dos cosas: que la firma sea correcta, es decir, que nadie lo haya modificado, y que no esté vencido. Si está vencido responde 'El token ha expirado'; si fue alterado, 'Token inválido'. Las dos respuestas son 401.
> 3. Busca al usuario en la base de datos para usar su rol real y no confiar en lo que diga el cliente."

---

### Parte 5. Permisos: quién puede hacer qué · 4:20 a 5:10 · habla el Integrante 2

**En pantalla:** VS Code.

**Qué hacer:**

1. Abran `src/routes/productos.routes.js` y señalen la **línea 7**: `soloAdmin = [verificarToken, requerirRol('admin')]`.
2. Abran `src/repositories/favoritos.repository.js` y señalen que todas las funciones reciben `usuarioId`.

**Qué decir:**
> "Hay dos tipos de control.
>
> El primero es por **rol**. Para crear, modificar o borrar productos, primero se verifica el token y después `requerirRol('admin')` revisa que el rol sea administrador. Un usuario normal recibe 403, que significa 'no tienes permiso'.
>
> El segundo es por **propiedad**, en los favoritos. Cada búsqueda filtra por el id del usuario, y ese id sale del token verificado, nunca de algo que mande el cliente. Así un usuario solo puede ver y borrar sus propios favoritos.
>
> Y el rol de administrador no se puede conseguir registrándose: el registro siempre crea usuarios normales. El administrador se crea con un script aparte, `npm run crear-admin`."

---

### Parte 6. El viaje de una petición · 5:10 a 6:10 · habla el Integrante 2

**En pantalla:** Postman, luego VS Code, luego Compass.

**Qué hacer:**

1. En Postman abran **Flujo principal → 3. CRUD de productos (admin) → Crear producto**.
2. Muestren la pestaña **Body**, con los datos del producto, y la pestaña **Headers**, con `Authorization: Bearer ...`. No hace falta leer el token completo.
3. Presionen **Send**. Debe responder **201 Created**.
   - Si responde **401**, el token venció porque ya pasó más de una hora desde la prueba del paso 1.3. Abran **1. Autenticación → Login administrador**, presionen **Send** y vuelvan a intentar. Para evitarlo, hagan la prueba del paso 1.3 justo antes de grabar.
4. Pasen a VS Code y muestren, uno tras otro:
   - `src/routes/productos.routes.js`, **línea 15**;
   - `src/middlewares/auth.js`, función `verificarToken`;
   - `src/controllers/productos.controller.js`, función `crear`;
   - `src/repositories/productos.repository.js`, función `crear`.
5. Pasen a Compass y abran la colección **productos**. Presionen el botón de recargar (🔄) y muestren el producto nuevo (se llama *Producto de prueba …*).
6. Regresen a Postman y muestren la respuesta JSON de abajo.

**Qué decir:**
> "Sigamos una petición de principio a fin. Desde Postman el administrador manda un POST a `/api/productos` con los datos del producto y su token en la cabecera.
>
> 1. La petición entra por esta ruta.
> 2. `verificarToken` revisa el token y sabe que es el administrador.
> 3. `requerirRol` confirma que tiene rol admin.
> 4. `validarProducto` revisa los datos.
> 5. Llega al controlador `crear`, que llama al repositorio.
> 6. El repositorio lo guarda en MongoDB: aquí en Compass aparece el documento nuevo.
> 7. Finalmente la API responde 201 con este JSON, que trae el producto creado y su id."

---

### Parte 7. Pruebas: todo funciona y se rechazan datos malos · 6:10 a 7:10 · habla el Integrante 1

**En pantalla:** Postman.

**Qué hacer:**

1. Pasen el mouse sobre la carpeta **Flujo principal**, presionen `···` y luego **Run folder**. Después presionen **Run Catálogo API**.
2. En los resultados, vayan señalando estas peticiones (todas en verde):
   - **Carpeta 1:** *Registro usuario A* (201), *Login usuario A* (200), *Registro con correo duplicado* (409).
   - **Carpeta 2:** *Listar productos (sin token)* (200), *Filtrar por categoría* (200).
   - **Carpeta 3:** *Crear producto* (201), *Actualizar producto* (200), *Crear producto con precio inválido* (400), *Crear producto con campos vacíos* (400).
3. Opcional: abran *Crear producto con precio inválido* en la colección, presionen **Send** y muestren el mensaje de error de la respuesta.

**Qué decir:**
> "Para demostrar que todo funciona, ejecutamos la colección completa de Postman. Son 47 peticiones y cada una revisa automáticamente el código de respuesta y los datos.
>
> Primero el **flujo exitoso**: se registra un usuario y responde 201; inicia sesión y recibe su token; cualquiera puede ver el catálogo y filtrarlo por categoría sin iniciar sesión; y el administrador crea y actualiza un producto.
>
> Ahora los **errores de validación**: si registramos un correo que ya existe, responde 409, que significa conflicto o duplicado. Si mandamos un precio negativo o campos vacíos, responde 400 y explica qué campo está mal."

---

### Parte 8. Pruebas: permisos y aislamiento entre usuarios · 7:10 a 8:20 · habla el Integrante 2

**En pantalla:** los mismos resultados del Runner en Postman.

**Qué hacer:** señalen estas peticiones en los resultados.

- **Carpeta 4:**
  - *Crear producto sin token*: 401.
  - *Listar favoritos con token vencido*: 401.
  - *Listar favoritos con token manipulado*: 401.
  - *Crear producto con rol usuario*: 403.
- **Carpeta 6:**
  - *B lista sus favoritos (no ve los de A)*;
  - *B intenta quitar el favorito de A*: 404;
  - *A conserva su favorito*.

**Qué decir:**
> "Ahora los **permisos**. Sin token, la API responde 401. Con un token vencido también responde 401, y el mensaje dice que expiró. Si alguien modifica el token, la firma ya no coincide y se rechaza. Si un usuario normal intenta crear, modificar o borrar un producto, recibe 403 porque no es administrador.
>
> Y el **aislamiento** entre usuarios. Tenemos dos usuarios, A y B. A guardó un favorito. Cuando B consulta sus favoritos, no ve el de A. Si B intenta borrar el favorito de A, recibe 404, porque para B ese favorito no existe. Y al consultar de nuevo con A, su favorito sigue ahí."

---

### Parte 9. Los datos se guardan aunque se apague el servidor · 8:20 a 9:10 · habla el Integrante 1

**En pantalla:** la terminal de VS Code y luego Postman.

**Qué hacer:**

1. En la terminal donde corre el servidor, presionen **Ctrl + C**. El servidor se apaga.
2. Escriban `npm start` y presionen Enter. Esperen a ver *API escuchando…*.
3. En Postman, pasen el mouse sobre la carpeta **Persistencia (ejecutar tras reiniciar)**, presionen `···` → **Run folder** → **Run**.
4. Muestren las 3 peticiones en verde.

**Qué decir:**
> "Ahora comprobamos la **persistencia**, es decir, que los datos no se pierden. Apagamos el servidor con Ctrl+C y lo volvemos a encender. Ejecutamos estas pruebas: el usuario A puede iniciar sesión, los productos siguen ahí y su favorito también. Esto funciona porque todo se guarda en MongoDB y no en la memoria del programa."

---

### Parte 10. Una dificultad y cómo ejecutar el proyecto · 9:10 a 10:00 · habla el Integrante 2

**En pantalla:** `README.md`, en las secciones 5 a 8.

**Qué decir sobre la dificultad.** Cuenten una que **ustedes** hayan tenido. Si no tienen una, pueden usar esta:
> "Una dificultad fue probar el token vencido, porque dura una hora y no podíamos esperar tanto. La resolvimos haciendo que Postman genere un token con la fecha de vencimiento en el pasado, firmado con la misma clave que el servidor. Así el servidor lo acepta como auténtico, pero lo rechaza por estar vencido."

**Qué decir sobre cómo ejecutarlo:**
> "Para ejecutar el proyecto:
> 1. Se clona el repositorio.
> 2. Se instala con `npm ci`.
> 3. Se copia `.env.example` como `.env` y se completan la clave secreta y los datos del administrador.
> 4. Con `npm run seed` se cargan los productos de ejemplo y con `npm run crear-admin` se crea el administrador.
> 5. Se enciende con `npm start`.
>
> Todo está explicado en el README. Gracias."

---

## Paso 3. Después de grabar

1. **Revisen el video completo**: que se escuche bien, que el código se lea y que no aparezcan el `.env` ni contraseñas.
2. **Revisen la duración**: tiene que medir **al menos 10:00**. Si les quedó más corto, hablen un poco más despacio en las explicaciones de código.
3. **Súbanlo a YouTube** y, en *Visibilidad*, elijan **No listado**. Otra opción es subirlo a Google Drive con *Compartir → Cualquier persona con el enlace → Lector*.
4. **Prueben el enlace** en una ventana de incógnito (**Ctrl + Shift + N**) para confirmar que abre sin iniciar sesión.
5. Copien el enlace en el PDF de entrega (`docs/entrega-plantilla.md`).

> El código que se ve en el video debe ser el del **último commit** que pongan en el PDF. Graben después de subir todo a GitHub y no cambien nada después.

> El enunciado pide **citar las herramientas de apoyo y explicar el código incorporado**. Si usaron un asistente de IA, menciónenlo en la sección *Recursos y herramientas de apoyo* del README. Por eso es importante que entiendan lo que explican en el video.

---

## Palabras que van a usar

| Palabra | Qué significa, en simple |
|---|---|
| **API REST** | Un programa que no tiene pantalla: recibe peticiones por internet y responde con datos en formato JSON. |
| **Petición** | Un mensaje a la API. Tiene un método y una dirección, por ejemplo `GET /api/productos`. |
| **GET / POST / PUT / DELETE** | Los métodos: **consultar**, **crear**, **modificar** y **borrar**. |
| **JSON** | El formato de texto de las respuestas, por ejemplo `{ "nombre": "Taza", "precio": 219.9 }`. |
| **Ruta** | La dirección de la petición, como `/api/favoritos`. |
| **Controlador** | La función que decide qué hacer con una petición. |
| **Repositorio** | El código que lee y escribe en la base de datos. |
| **Middleware** | Un paso de revisión que se ejecuta antes del controlador: validar datos, revisar el token o el rol. |
| **MongoDB** | La base de datos. Guarda "documentos" (como fichas) dentro de "colecciones" (como cajones). |
| **Mongoose** | La librería que conecta Node.js con MongoDB y define cómo es cada documento (el "modelo"). |
| **Hash / bcrypt** | La contraseña se transforma en un texto irreconocible antes de guardarla. No se puede volver atrás, solo comparar. |
| **JWT (token)** | Un "pase" firmado que recibe el usuario al iniciar sesión. Demuestra quién es y vence en una hora. |
| **Rol** | El tipo de usuario: `usuario` (normal) o `admin` (administrador). |
| **Postman** | El programa para enviar peticiones y ver las respuestas. |
| **Persistencia** | Que los datos sigan guardados aunque se apague el servidor. |

### Códigos de respuesta

| Código | Significado |
|---|---|
| **200** | Todo bien. |
| **201** | Se creó algo nuevo. |
| **400** | Los datos enviados están mal (vacíos, precio negativo, etc.). |
| **401** | No iniciaste sesión, o tu token está vencido o es falso. |
| **403** | Iniciaste sesión, pero no tienes permiso (no eres admin). |
| **404** | No existe lo que buscas. |
| **409** | Ya existe (duplicado). |

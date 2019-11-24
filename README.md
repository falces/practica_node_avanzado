# NODEPOP
API práctica del módulo Backend Avanzado con NodeJS

## VARIABLES DE ENTORNO
A partir del archivo de ejemplo:

```
.env.example
```
Crear un archivo

```
.env
```
Con las variables correctas.

## BASE DE DATOS

### Iniciar Mongo:
```
./bin/mongod --dbpath ./data/db --directoryperdb
```
### Instalar colección y juego de datos:
```
npm run installDB
```
## SERVIDOR LOCAL:
### Iniciar servidor web:

```
npm run dev
```
### Microservicios
#### Creación miniaturas:
```
node microservices/thumbnailWorker.js
```

## WEB
```
https://localhost:3000
```

## API SIN AUTENTICACIÓN

### LISTA DE TAGS
Request:

```
https://localhost:3000/apiv1/tags
```
Response:

```
{
    "success": true,
    "tags": [
        "lifestyle",
        "motor",
        "mobile",
        "home",
        "garden",
        "computer",
        "tv",
        "games"
    ]
}
```

### JWT LOGIN

Request:

```
https://localhost:3000/apiv1/login
```
Parámetros GET/POST:

```
{
    email: falces@gmail.com,
    password: 1234
}
```
Response:

```
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGQ4MTAzZjBlYzgyNTA2NGY0MDVlYTgiLCJpYXQiOjE1NzQ0NDE4MDYsImV4cCI6MTU3NDYxNDYwNn0._GRZyLPOMV15ksrZv_oVehNwX7hd_bTQm7hwx6U_Q-g"
}
```

## API CON AUTENTICACIÓN

### LISTA DE ANUNCIOS
Se requiere token de autenticación.

Request:

```
https://localhost:3000/apiv1/anuncios?tag=mobile,motor&nombre=&start=0&limit=100&sort=_id&venta=false&precio=-50
```
Autenticación POST/GET:
```
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGQ4MTAzZjBlYzgyNTA2NGY0MDVlYTgiLCJpYXQiOjE1NzQ0NDE4MDYsImV4cCI6MTU3NDYxNDYwNn0._GRZyLPOMV15ksrZv_oVehNwX7hd_bTQm7hwx6U_Q-g
```

Response:

```
{
	"success": true,
    "anuncios": [
        {
            "tags": [
                "lifestyle",
                "mobile"
            ],
            "_id": "5dd8103f0ec825064f405e9d",
            "nombre": "iPhone 3GS",
            "venta": false,
            "precio": 50,
            "foto": "iphone.jpg",
            "__v": 0
        },
        {
            "tags": [
                "lifestyle"
            ],
            "_id": "5dd8103f0ec825064f405ea2",
            "nombre": "Bicicleta Montaña",
            "venta": false,
            "precio": 90,
            "foto": "bici2.jpg",
            "__v": 0
        }
    ]
}

```
### NUEVO ANUNCIO
Se require token de autenticación

Request POST:

```
https://localhost:3000/apiv1/nuevo
```

Parámetros:

```
{
    nombre: "Bicicleta estática",
    "tags": ["lifestyle", "home"],
    precio: 100,
    venta: true,
    imagen: [ARCHIVO DE IMAGEN]
}
```
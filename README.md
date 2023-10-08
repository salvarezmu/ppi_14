<h1 align="center">TRON Pulse - PPI 14</h1>
<p align="center">Proyecto de programación para ingeniería grupo 14.</p>

## Tabla de contenido

- [Descripción](#descripción).
- [Integrantes](#integrantes).
- [Instalación](#instalación).
- [Despliegue](#despliegue).
    - [Backend](#backend).
    - [Frontend](#frontend).

## Descripción

TRON Pulse es un aplicativo vargandista que genera estadísticos y gráficos básicos a partir de transacciones de monedas
y contratos realizadas por un usuario en la blockchain TRON, permíte al cliente seleccionar su address de interés,
visualizar sus movimientos y analizar la cantidad de dinero que ha envíado y recibido desde su cuenta a partir de las 12
palabras de la wallet.

## Integrantes

- Santiago Álvarez Muñoz

  Correo: salvarezmu@unal.edu.co


- Omar Andres Zambrano Arias

  Correo: oazambranoa@unal.edu.co


- Russbell Noreña Mejia

  Correo: rnorena@unal.edu.co


## Instalación

Para instalar el proyecto ejecuta:

```bash
  git clone https://github.com/salvarezmu/ppi_14.git my-project 
  
  cd my-project
```

## Despliegue

- ### Backend

  Para ejecutar el backend de este proyecto ejectuta:

```bash
  cd backend/
  
  # Configura tú environment
  vim .env 
  
  # Despliega el backend
  python3 manage.py runserver
```

- ### Frontend
  Para ejecutar el frontend de este proyecto ejecuta:

```bash
  cd frontend/
  
  # Configura tú environment
  vim .env 
  
  # Instala tus dependencias
  npm install
  
  # Despliega el frontend
  npm start
```

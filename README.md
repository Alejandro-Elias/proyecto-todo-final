**ToDo** - web se tareas

ToDo es una aplicación web diseñada para gestionar tareas diarias. Permite crear, modificar, eliminar y marcar tareas como completadas.

!\[Imagen del la web funcionando\](assets/imagen.png)

📝 Características principales:

- En la página principal, puedes ver todas las tareas registradas, marcar como completadas las que ya realizaste o eliminarlas si ya no las necesitas.
    
- En la parte inferior, se muestra el número de tareas pendientes y puedes filtrar la vista para mostrar todas las tareas, solo las completadas o solo las pendientes.
    
- A través del enlace "Crear nueva tarea", puedes añadir una nueva tarea ingresando un título y una descripción (ambos campos son obligatorios).
    
- Si haces clic en una tarea existente, puedes editar su contenido.
    
- En todas las páginas, puedes alternar entre el modo claro y oscuro haciendo clic en el ícono de la luna o el sol, según corresponda
    

&nbsp;

**Instalación**

- descargar el proyecto desde el repositorio

`https://github.com/Alejandro-Elias/proyecto-todo-final.git`

- entrar en la carpeta BackEnd

`cd proyecto-todo-final/backend`

- instalar los módulos necesarios con npm:

`npm install`

- crear un archivo .env en la raíz del proyecto y usar las siguientes variables:

`DATA_FILE=../../data/tareas.json`

`API_KEY=@ut0r1z4d0`

`PORT=3030`

- iniciar el servido backend:

`npm run start`

- Navega a la carpeta frontend:

`cd ../frontend`

- instalar los módulos necesarios con npm:

`npm install`

- crear un archivo en la raíz llamado .env.local y añade las siguientes variables:

`NEXT_PUBLIC_API_URL="http://localhost:3030/api/tasks"`

`NEXT_PUBLIC_API_KEY=@ut0r1z4d0`

- Ejecuta el siguiente comando para iniciar el frontend:
    
    `npm run dev`
    
- Acceso a la aplicación: Abre un navegador y accede a la URL:
    
    `http://localhost:3000`
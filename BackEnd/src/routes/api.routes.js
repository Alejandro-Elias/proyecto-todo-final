const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/controller');
const validateTaskForm = require('../validation/validateTaskForm');

/**
 * Middleware para validar la API Key.
 * Asegura que la API Key proporcionada sea válida.
 *
 * @function
 * @name validateApiKey
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware o ruta.
 * @returns {Object} Respuesta con un código de estado 401 si la clave API es inválida.
 */

router.use((req, res, next) => {
    const apiKey = req.headers.authorization;
    
        
    if (!apiKey || apiKey !== "Bearer " + process.env.API_KEY) {
        return res.status(401).json({ error: 'Api key invalida' });
    }
    next()
});

/**
 * Ruta para obtener todas las tareas.
 * Llama a la función `getTasks` para devolver una lista de tareas.
 * 
 * @name GET /tasks
 * @function
 * @memberof module:routes
 * @returns {Object} Lista de todas las tareas almacenadas.
 */

router.get('/tasks', getTasks)

/**
 * Ruta para crear una nueva tarea.
 * Valida los datos de la tarea utilizando `validateTaskForm` y luego llama a `createTask`.
 *
 * @name POST /tasks
 * @function
 * @memberof module:routes
 * @param {Object} req.body - Los datos de la tarea a crear (title, description, completed, createdAt).
 * @returns {Object} La tarea creada.
 */

router.post('/tasks', validateTaskForm(), createTask)

/**
 * Ruta para actualizar una tarea existente.
 * Valida los datos de la tarea utilizando `validateTaskForm` y luego llama a `updateTask`.
 *
 * @name PUT /tasks/:id
 * @function
 * @memberof module:routes
 * @param {string} req.params.id - El ID de la tarea a actualizar.
 * @param {Object} req.body - Los nuevos datos de la tarea (title, description, completed).
 * @returns {Object} La tarea actualizada.
 */

router.put('/tasks/:id', validateTaskForm(), updateTask)

/**
 * Ruta para eliminar una tarea existente.
 * Llama a la función `deleteTask` para eliminar la tarea correspondiente por ID.
 *
 * @name DELETE /tasks/:id
 * @function
 * @memberof module:routes
 * @param {string} req.params.id - El ID de la tarea a eliminar.
 * @returns {Object} Respuesta con el estado de la eliminación.
 */

router.delete('/tasks/:id', deleteTask)

module.exports = router;

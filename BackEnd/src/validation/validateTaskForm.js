const { body, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación en las solicitudes.
 * @param {Object} req - La solicitud Express.
 * @param {Object} res - La respuesta Express.
 * @param {Function} next - La función next para pasar al siguiente middleware.
 * @returns {Object|undefined} Respuesta de error si hay errores de validación, o llama a `next()` si no hay errores.
 */

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }
  next();
};

/**
 * Middleware para validar el formulario de tarea.
 * Valida que los campos 'title' y 'description' sean cadenas no vacías.
 * @returns {Array} Un array de middlewares de Express para validar el formulario de tarea.
 */

const validateTaskForm = () => [

   /**
   * Valida que el campo 'title' no esté vacío y sea una cadena.
   * @type {ValidationChain}
   */

  body('title')
    .notEmpty()
    .withMessage('El campo título es obligatorio')
    .isString()
    .withMessage('El campo título debe ser texto'),

    /**
   * Valida que el campo 'description' no esté vacío y sea una cadena.tengo insalado, como creo un md con el 
   * @type {ValidationChain}
   */

  body('description')
    .notEmpty()
    .withMessage('El campo descripción es obligatorio')
    .isString()
    .withMessage('El campo descripción debe ser texto'),
  handleValidationErrors,
];

module.exports = validateTaskForm;

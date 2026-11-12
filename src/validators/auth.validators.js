import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.empty': 'El email es obligatorio',
        'string.email': 'El email debe ser válido',
        'any.required': 'El email es obligatorio'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'La contraseña es obligatoria',
        'any.required': 'La contraseña es obligatoria'
    })
});

export const registroSchema = Joi.object({
    nombre: Joi.string().min(2).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos {#limit} caracteres',
        'any.required': 'El nombre es obligatorio'
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.empty': 'El email es obligatorio',
        'string.email': 'El email debe ser válido',
        'any.required': 'El email es obligatorio'
    }),
    password: Joi.string().min(8).required().messages({
        'string.empty': 'La contraseña es obligatoria',
        'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
        'any.required': 'La contraseña es obligatoria'
    }),
    repetirPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'string.empty': 'Repetí la contraseña',
        'any.only': 'Las contraseñas no coinciden',
        'any.required': 'Repetí la contraseña'
    })
});
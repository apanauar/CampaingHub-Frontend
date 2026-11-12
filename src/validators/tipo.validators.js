import Joi from "joi";

export const tipoSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos {#limit} caracteres',
        'string.max': 'El nombre no puede superar los {#limit} caracteres',
        'any.required': 'El nombre es obligatorio'
    }),
    descripcion: Joi.string().max(200).allow("").messages({
        'string.max': 'La descripción no puede superar los {#limit} caracteres'
    })
})       


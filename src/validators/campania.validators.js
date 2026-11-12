import Joi from "joi";



export const ESTADOS = ["borrador", "activa", "pausada", "finalizada"];
export const CANALES = ["instagram", "tiktok", "meta_ads", "google_ads", "linkedin", "email"];
export const TRANSICIONES = {
    borrador: ["activa"],
    activa: ["pausada", "finalizada"],
    pausada: ["activa", "finalizada"],
    finalizada: []
};


export const campaniaSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos {#limit} caracteres',
        'string.max': 'El nombre no puede tener más de {#limit} caracteres',
        'any.required': 'El nombre es obligatorio'
    }),
    cliente: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El cliente es obligatorio',
        'string.min': 'El cliente debe tener al menos {#limit} caracteres',
        'any.required': 'El cliente es obligatorio'
    }),
    tipo: Joi.string().required().messages({
        'string.empty': 'Elegí un tipo de campaña',
        'any.required': 'Elegí un tipo de campaña'
    }),
    presupuesto: Joi.number().min(0).required().messages({
        'number.base': 'El presupuesto debe ser un número',
        'number.min': 'El presupuesto no puede ser negativo',
        'any.required': 'El presupuesto es obligatorio'
    }),
    fechaInicio: Joi.date().required().messages({
        'date.base': 'La fecha de inicio es obligatoria',
        'any.required': 'La fecha de inicio es obligatoria'
    }),
    fechaFin: Joi.date().min(Joi.ref('fechaInicio')).required().messages({
        'date.base': 'La fecha de fin es obligatoria',
        'date.min': 'La fecha de fin no puede ser anterior a la de inicio',
        'any.required': 'La fecha de fin es obligatoria'
    }),
    canales: Joi.array().items(Joi.string().valid(...CANALES)).min(1).required().messages({
        'array.base': 'Elegí al menos un canal',
        'array.min': 'Elegí al menos un canal',
        'any.required': 'Elegí al menos un canal'
    }),
    objetivo: Joi.string().min(5).max(500).required().messages({
        'string.empty': 'El objetivo es obligatorio',
        'string.min': 'El objetivo debe tener al menos {#limit} caracteres',
        'any.required': 'El objetivo es obligatorio'
    })
});

export const edicionSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'Mínimo {#limit} caracteres',
        'any.required': 'El nombre es obligatorio'
    }),
    cliente: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El cliente es obligatorio',
        'string.min': 'Mínimo {#limit} caracteres',
        'any.required': 'El cliente es obligatorio'
    }),
    presupuesto: Joi.number().min(0).required().messages({
        'number.base': 'Debe ser un número',
        'number.min': 'No puede ser negativo',
        'any.required': 'Obligatorio'
    }),
    estado: Joi.string().valid(...ESTADOS).required().messages({
        'any.only': 'Estado inválido',
        'any.required': 'Elegí un estado'
    })
});
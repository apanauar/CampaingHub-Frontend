import Joi from "joi";

export const PRECIOS = {
    mensual: 19,
    anual: 190
};

const anioActual = new Date().getFullYear();
const mesActual = new Date().getMonth() + 1;

export const MESES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const ANIOS = [];
for (let i = 0; i <= 10; i++) {
    ANIOS.push(anioActual + i);
}

export const planSchema = Joi.object({
    ciclo: Joi.string().valid("mensual", "anual").required().messages({
        'any.only': 'Elegí un ciclo de facturación',
        'any.required': 'Elegí un ciclo de facturación'
    }),
    titular: Joi.string().pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/).min(3).max(60).required().messages({
        'string.empty': 'El nombre del titular es obligatorio',
        'string.pattern.base': 'Solo letras y espacios',
        'string.min': 'Mínimo {#limit} caracteres',
        'any.required': 'El nombre del titular es obligatorio'
    }),
    numero: Joi.string()
        .pattern(/^\d+$/).message('Solo números, sin espacios ni guiones')
        .length(16).message('La tarjeta tiene que tener 16 dígitos')
        .pattern(/^(4|5[1-5]|2(22[1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/).message('Solo Visa (empieza con 4) o Mastercard (empieza con 5 o 2)')
        .creditCard().message('El número de tarjeta no es válido')
        .required()
        .messages({
            'string.empty': 'El número de tarjeta es obligatorio',
            'any.required': 'El número de tarjeta es obligatorio'
        }),
    mes: Joi.number().required()
        .when('anio', { is: Joi.number().valid(anioActual), then: Joi.number().min(mesActual) })
        .messages({
            'number.base': 'Elegí el mes',
            'number.min': 'La tarjeta está vencida',
            'any.required': 'Elegí el mes'
        }),
    anio: Joi.number().min(anioActual).max(anioActual + 10).required().messages({
        'number.base': 'Elegí el año',
        'number.min': 'La tarjeta está vencida',
        'any.required': 'Elegí el año'
    }),
    cvv: Joi.string().pattern(/^\d{3}$/).required().messages({
        'string.empty': 'El CVV es obligatorio',
        'string.pattern.base': 'El CVV son 3 dígitos',
        'any.required': 'El CVV es obligatorio'
    }),
    aceptaTerminos: Joi.boolean().valid(true).required().messages({
        'any.only': 'Tenés que aceptar los términos',
        'any.required': 'Tenés que aceptar los términos'
    })
});

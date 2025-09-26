const yup = require('yup');

// Tipos de seguimiento válidos
const TIPOS_SEGUIMIENTO = ['MEDICO', 'ADMINISTRATIVO', 'LEGAL', 'PREVENTIVO'];

// Estados de salud válidos
const ESTADOS_SALUD = ['MEJORANDO', 'ESTABLE', 'EMPEORANDO', 'RECUPERADO'];

// Schema para crear seguimiento
const createSeguimientoValidationSchema = yup.object().shape({
    accidenteId: yup
        .string()
        .required('accidenteId es requerido')
        .uuid('accidenteId debe ser un UUID válido'),
    
    fechaSeguimiento: yup
        .date()
        .required('fechaSeguimiento es requerida')
        .max(new Date(), 'fechaSeguimiento no puede ser futura'),
    
    tipoSeguimiento: yup
        .string()
        .required('tipoSeguimiento es requerido')
        .oneOf(TIPOS_SEGUIMIENTO, `tipoSeguimiento debe ser uno de: ${TIPOS_SEGUIMIENTO.join(', ')}`),
    
    descripcion: yup
        .string()
        .required('descripcion es requerida')
        .min(10, 'descripcion debe tener al menos 10 caracteres')
        .max(2000, 'descripcion no puede exceder 2000 caracteres'),
    
    responsable: yup
        .string()
        .required('responsable es requerido')
        .min(2, 'responsable debe tener al menos 2 caracteres')
        .max(255, 'responsable no puede exceder 255 caracteres'),
    
    // Campos específicos para seguimiento médico
    estadoSalud: yup
        .string()
        .nullable()
        .when('tipoSeguimiento', {
            is: 'MEDICO',
            then: (schema) => schema.oneOf(ESTADOS_SALUD, `estadoSalud debe ser uno de: ${ESTADOS_SALUD.join(', ')}`),
            otherwise: (schema) => schema.oneOf([...ESTADOS_SALUD, null], `estadoSalud debe ser uno de: ${ESTADOS_SALUD.join(', ')} o null`)
        }),
    
    porcentajeRecuperacion: yup
        .number()
        .nullable()
        .when('tipoSeguimiento', {
            is: 'MEDICO',
            then: (schema) => schema.min(0, 'porcentajeRecuperacion debe ser mayor o igual a 0')
                                   .max(100, 'porcentajeRecuperacion debe ser menor o igual a 100'),
            otherwise: (schema) => schema.nullable()
        }),
    
    restriccionesLaborales: yup
        .string()
        .nullable()
        .max(1000, 'restriccionesLaborales no puede exceder 1000 caracteres'),
    
    fechaProbableReintegro: yup
        .date()
        .nullable()
        .when('tipoSeguimiento', {
            is: 'MEDICO',
            then: (schema) => schema.min(yup.ref('fechaSeguimiento'), 'fechaProbableReintegro debe ser posterior a fechaSeguimiento'),
            otherwise: (schema) => schema.nullable()
        }),
    
    // Campos administrativos
    documentosPendientes: yup
        .string()
        .nullable()
        .max(1000, 'documentosPendientes no puede exceder 1000 caracteres'),
    
    gestionesRealizadas: yup
        .string()
        .nullable()
        .max(1000, 'gestionesRealizadas no puede exceder 1000 caracteres'),
    
    proximaAccion: yup
        .string()
        .nullable()
        .max(500, 'proximaAccion no puede exceder 500 caracteres'),
    
    fechaProximaAccion: yup
        .date()
        .nullable()
        .when('proximaAccion', {
            is: (val) => val && val.trim().length > 0,
            then: (schema) => schema.required('fechaProximaAccion es requerida cuando se especifica proximaAccion')
                                   .min(new Date(), 'fechaProximaAccion debe ser futura'),
            otherwise: (schema) => schema.nullable()
        }),
    
    seguimientoCompletado: yup
        .boolean()
        .default(false),
    
    observaciones: yup
        .string()
        .nullable()
        .max(1000, 'observaciones no puede exceder 1000 caracteres')
});

// Schema para actualizar seguimiento
const updateSeguimientoValidationSchema = yup.object().shape({
    fechaSeguimiento: yup
        .date()
        .optional()
        .max(new Date(), 'fechaSeguimiento no puede ser futura'),
    
    tipoSeguimiento: yup
        .string()
        .optional()
        .oneOf(TIPOS_SEGUIMIENTO, `tipoSeguimiento debe ser uno de: ${TIPOS_SEGUIMIENTO.join(', ')}`),
    
    descripcion: yup
        .string()
        .optional()
        .min(10, 'descripcion debe tener al menos 10 caracteres')
        .max(2000, 'descripcion no puede exceder 2000 caracteres'),
    
    responsable: yup
        .string()
        .optional()
        .min(2, 'responsable debe tener al menos 2 caracteres')
        .max(255, 'responsable no puede exceder 255 caracteres'),
    
    estadoSalud: yup
        .string()
        .nullable()
        .optional()
        .oneOf([...ESTADOS_SALUD, null], `estadoSalud debe ser uno de: ${ESTADOS_SALUD.join(', ')} o null`),
    
    porcentajeRecuperacion: yup
        .number()
        .nullable()
        .optional()
        .min(0, 'porcentajeRecuperacion debe ser mayor o igual a 0')
        .max(100, 'porcentajeRecuperacion debe ser menor o igual a 100'),
    
    restriccionesLaborales: yup
        .string()
        .nullable()
        .optional()
        .max(1000, 'restriccionesLaborales no puede exceder 1000 caracteres'),
    
    fechaProbableReintegro: yup
        .date()
        .nullable()
        .optional(),
    
    documentosPendientes: yup
        .string()
        .nullable()
        .optional()
        .max(1000, 'documentosPendientes no puede exceder 1000 caracteres'),
    
    gestionesRealizadas: yup
        .string()
        .nullable()
        .optional()
        .max(1000, 'gestionesRealizadas no puede exceder 1000 caracteres'),
    
    proximaAccion: yup
        .string()
        .nullable()
        .optional()
        .max(500, 'proximaAccion no puede exceder 500 caracteres'),
    
    fechaProximaAccion: yup
        .date()
        .nullable()
        .optional(),
    
    seguimientoCompletado: yup
        .boolean()
        .optional(),
    
    observaciones: yup
        .string()
        .nullable()
        .optional()
        .max(1000, 'observaciones no puede exceder 1000 caracteres')
});

// Schema para filtros de búsqueda
const filterValidationSchema = yup.object().shape({
    accidenteId: yup
        .string()
        .optional()
        .uuid('accidenteId debe ser un UUID válido'),
    
    tipoSeguimiento: yup
        .string()
        .optional()
        .oneOf(TIPOS_SEGUIMIENTO, `tipoSeguimiento debe ser uno de: ${TIPOS_SEGUIMIENTO.join(', ')}`),
    
    responsable: yup
        .string()
        .optional()
        .min(2, 'responsable debe tener al menos 2 caracteres'),
    
    estadoSalud: yup
        .string()
        .optional()
        .oneOf(ESTADOS_SALUD, `estadoSalud debe ser uno de: ${ESTADOS_SALUD.join(', ')}`),
    
    seguimientoCompletado: yup
        .boolean()
        .optional(),
    
    fechaDesde: yup
        .date()
        .optional(),
    
    fechaHasta: yup
        .date()
        .optional()
        .when('fechaDesde', {
            is: (val) => val != null,
            then: (schema) => schema.min(yup.ref('fechaDesde'), 'fechaHasta debe ser posterior a fechaDesde'),
            otherwise: (schema) => schema
        }),
    
    // Parámetros de paginación
    limit: yup
        .number()
        .optional()
        .integer('limit debe ser un número entero')
        .min(1, 'limit debe ser mayor a 0')
        .max(100, 'limit no puede exceder 100'),
    
    offset: yup
        .number()
        .optional()
        .integer('offset debe ser un número entero')
        .min(0, 'offset debe ser mayor o igual a 0'),
    
    orderBy: yup
        .string()
        .optional()
        .oneOf(['fecha_seguimiento', 'tipo_seguimiento', 'responsable', 'seguimiento_completado', 'creado_en'], 
               'orderBy debe ser un campo válido'),
    
    orderDirection: yup
        .string()
        .optional()
        .oneOf(['ASC', 'DESC'], 'orderDirection debe ser ASC o DESC')
});

// Schema para validar UUID en parámetros de ruta
const uuidValidationSchema = yup.object().shape({
    id: yup
        .string()
        .required('id es requerido')
        .uuid('id debe ser un UUID válido')
});

// Funciones de validación
const validateCreateSeguimiento = async (data) => {
    try {
        const validatedData = await createSeguimientoValidationSchema.validate(data, { 
            abortEarly: false,
            stripUnknown: true 
        });
        return { isValid: true, data: validatedData };
    } catch (error) {
        return { 
            isValid: false, 
            errors: error.errors || [error.message] 
        };
    }
};

const validateUpdateSeguimiento = async (data) => {
    try {
        const validatedData = await updateSeguimientoValidationSchema.validate(data, { 
            abortEarly: false,
            stripUnknown: true 
        });
        return { isValid: true, data: validatedData };
    } catch (error) {
        return { 
            isValid: false, 
            errors: error.errors || [error.message] 
        };
    }
};

const validateFilters = async (data) => {
    try {
        const validatedData = await filterValidationSchema.validate(data, { 
            abortEarly: false,
            stripUnknown: true 
        });
        return { isValid: true, data: validatedData };
    } catch (error) {
        return { 
            isValid: false, 
            errors: error.errors || [error.message] 
        };
    }
};

const validateUuid = async (data) => {
    try {
        const validatedData = await uuidValidationSchema.validate(data, { 
            abortEarly: false,
            stripUnknown: true 
        });
        return { isValid: true, data: validatedData };
    } catch (error) {
        return { 
            isValid: false, 
            errors: error.errors || [error.message] 
        };
    }
};

module.exports = {
    validateCreateSeguimiento,
    validateUpdateSeguimiento,
    validateFilters,
    validateUuid,
    TIPOS_SEGUIMIENTO,
    ESTADOS_SALUD
};

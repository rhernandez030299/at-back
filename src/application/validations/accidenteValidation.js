const yup = require('yup');

// Valid enum options based on database schema
const VALID_SEVERIDADES = ['Leve', 'Severo', 'Grave', 'Mortal'];
const VALID_TIPOS_ACCIDENTE = ['Propios del trabajo', 'Violencia', 'Tránsito', 'Deportivo', 'Recreativo o cultural'];
const VALID_TURNOS = ['Diurno', 'Nocturno'];
const VALID_ESTADOS = ['ABIERTO', 'EN_INVESTIGACION', 'CERRADO'];

// Create accidente validation schema
const createAccidenteSchema = yup.object().shape({
    empleadoId: yup
        .string()
        .required('empleadoId is required')
        .uuid('empleadoId must be a valid UUID'),
    
    fechaAccidente: yup
        .date()
        .required('fechaAccidente is required')
        .max(new Date(), 'fechaAccidente cannot be in the future'),
    
    lugarAccidente: yup
        .string()
        .required('lugarAccidente is required')
        .trim()
        .min(1, 'lugarAccidente cannot be empty')
        .max(255, 'lugarAccidente cannot exceed 255 characters'),
    
    severidad: yup
        .string()
        .required('severidad is required')
        .oneOf(VALID_SEVERIDADES, `severidad must be one of: ${VALID_SEVERIDADES.join(', ')}`),
    
    tipoAccidente: yup
        .string()
        .required('tipoAccidente is required')
        .oneOf(VALID_TIPOS_ACCIDENTE, `tipoAccidente must be one of: ${VALID_TIPOS_ACCIDENTE.join(', ')}`),

    turno: yup
        .string()
        .required('turno is required')
        .oneOf(VALID_TURNOS, `turno must be one of: ${VALID_TURNOS.join(', ')}`),
    
    servicioAPrestar: yup
        .string()
        .required('servicioAPrestar is required')
        .trim()
        .min(1, 'servicioAPrestar cannot be empty')
        .max(255, 'servicioAPrestar cannot exceed 255 characters'),
    
    factorRiesgoId: yup
        .string()
        .required('factorRiesgoId is required')
        .uuid('factorRiesgoId must be a valid UUID'),
    
    descripcionAccidente: yup
        .string()
        .required('descripcionAccidente is required')
        .trim()
        .min(10, 'descripcionAccidente must be at least 10 characters')
        .max(2000, 'descripcionAccidente cannot exceed 2000 characters'),
    
    tipoLesionId: yup
        .string()
        .required('tipoLesionId is required')
        .uuid('tipoLesionId must be a valid UUID'),
    
    agenteDelAccidente: yup
        .string()
        .required('agenteDelAccidente is required')
        .trim()
        .min(1, 'agenteDelAccidente cannot be empty')
        .max(255, 'agenteDelAccidente cannot exceed 255 characters'),
    
    mecanismoDelAccidente: yup
        .string()
        .required('mecanismoDelAccidente is required')
        .trim()
        .min(1, 'mecanismoDelAccidente cannot be empty')
        .max(255, 'mecanismoDelAccidente cannot exceed 255 characters'),
    
    parteCuerpoAfectadaId: yup
        .string()
        .required('parteCuerpoAfectadaId is required')
        .uuid('parteCuerpoAfectadaId must be a valid UUID'),
    
    situacionDelAccidente: yup
        .string()
        .required('situacionDelAccidente is required')
        .trim()
        .min(10, 'situacionDelAccidente must be at least 10 characters')
        .max(2000, 'situacionDelAccidente cannot exceed 2000 characters'),
    
    tieneIncapacidad: yup
        .boolean()
        .default(false),
    
    fechaInicioIncapacidad: yup
        .date()
        .optional()
        .nullable()
        .when('tieneIncapacidad', {
            is: true,
            then: (schema) => schema.required('fechaInicioIncapacidad is required when tieneIncapacidad is true'),
            otherwise: (schema) => schema.nullable()
        }),
    
    fechaFinIncapacidad: yup
        .date()
        .optional()
        .nullable()
        .when(['tieneIncapacidad', 'fechaInicioIncapacidad'], {
            is: (tieneIncapacidad, fechaInicioIncapacidad) => tieneIncapacidad && fechaInicioIncapacidad,
            then: (schema) => schema
                .required('fechaFinIncapacidad is required when tieneIncapacidad is true')
                .min(yup.ref('fechaInicioIncapacidad'), 'fechaFinIncapacidad must be after fechaInicioIncapacidad'),
            otherwise: (schema) => schema.nullable()
        }),
    
    diasIncapacidad: yup
        .number()
        .optional()
        .integer('diasIncapacidad must be an integer')
        .min(0, 'diasIncapacidad must be greater than or equal to 0')
        .max(365, 'diasIncapacidad cannot exceed 365 days'),
    
    estado: yup
        .string()
        .optional()
        .oneOf(VALID_ESTADOS, `estado must be one of: ${VALID_ESTADOS.join(', ')}`)
        .default('ABIERTO'),
    
    requiereSeguimiento: yup
        .boolean()
        .optional()
        .default(true)
});

// Update accidente validation schema
const updateAccidenteSchema = yup.object().shape({
    empleadoId: yup
        .string()
        .optional()
        .uuid('empleadoId must be a valid UUID'),
    
    fechaAccidente: yup
        .date()
        .optional()
        .max(new Date(), 'fechaAccidente cannot be in the future'),
    
    lugarAccidente: yup
        .string()
        .optional()
        .trim()
        .min(1, 'lugarAccidente cannot be empty')
        .max(255, 'lugarAccidente cannot exceed 255 characters'),
    
    severidad: yup
        .string()
        .optional()
        .oneOf(VALID_SEVERIDADES, `severidad must be one of: ${VALID_SEVERIDADES.join(', ')}`),
    
    tipoAccidente: yup
        .string()
        .optional()
        .oneOf(VALID_TIPOS_ACCIDENTE, `tipoAccidente must be one of: ${VALID_TIPOS_ACCIDENTE.join(', ')}`),
    
    turno: yup
        .string()
        .optional()
        .oneOf(VALID_TURNOS, `turno must be one of: ${VALID_TURNOS.join(', ')}`),
    
    servicioAPrestar: yup
        .string()
        .optional()
        .trim()
        .min(1, 'servicioAPrestar cannot be empty')
        .max(255, 'servicioAPrestar cannot exceed 255 characters'),
    
    factorRiesgoId: yup
        .string()
        .optional()
        .uuid('factorRiesgoId must be a valid UUID'),
    
    descripcionAccidente: yup
        .string()
        .optional()
        .trim()
        .min(10, 'descripcionAccidente must be at least 10 characters')
        .max(2000, 'descripcionAccidente cannot exceed 2000 characters'),
    
    tipoLesionId: yup
        .string()
        .optional()
        .uuid('tipoLesionId must be a valid UUID'),
    
    agenteDelAccidente: yup
        .string()
        .optional()
        .trim()
        .min(1, 'agenteDelAccidente cannot be empty')
        .max(255, 'agenteDelAccidente cannot exceed 255 characters'),
    
    mecanismoDelAccidente: yup
        .string()
        .optional()
        .trim()
        .min(1, 'mecanismoDelAccidente cannot be empty')
        .max(255, 'mecanismoDelAccidente cannot exceed 255 characters'),
    
    parteCuerpoAfectadaId: yup
        .string()
        .optional()
        .uuid('parteCuerpoAfectadaId must be a valid UUID'),
    
    situacionDelAccidente: yup
        .string()
        .optional()
        .trim()
        .min(10, 'situacionDelAccidente must be at least 10 characters')
        .max(2000, 'situacionDelAccidente cannot exceed 2000 characters'),
    
    tieneIncapacidad: yup
        .boolean()
        .optional(),
    
    fechaInicioIncapacidad: yup
        .date()
        .optional()
        .nullable(),
    
    fechaFinIncapacidad: yup
        .date()
        .optional()
        .nullable()
        .when('fechaInicioIncapacidad', {
            is: (fechaInicioIncapacidad) => fechaInicioIncapacidad,
            then: (schema) => schema.min(yup.ref('fechaInicioIncapacidad'), 'fechaFinIncapacidad must be after fechaInicioIncapacidad'),
            otherwise: (schema) => schema
        }),
    
    diasIncapacidad: yup
        .number()
        .optional()
        .integer('diasIncapacidad must be an integer')
        .min(0, 'diasIncapacidad must be greater than or equal to 0')
        .max(365, 'diasIncapacidad cannot exceed 365 days'),
    
    fechaInvestigacion: yup
        .date()
        .optional()
        .nullable(),
    
    descripcionInvestigacion: yup
        .string()
        .optional()
        .nullable()
        .trim()
        .max(2000, 'descripcionInvestigacion cannot exceed 2000 characters'),
    
    fechaEjecucionAcciones: yup
        .date()
        .optional()
        .nullable(),
    
    fechaVerificacionAcciones: yup
        .date()
        .optional()
        .nullable(),
    
    estado: yup
        .string()
        .optional()
        .oneOf(VALID_ESTADOS, `estado must be one of: ${VALID_ESTADOS.join(', ')}`),
    
    requiereSeguimiento: yup
        .boolean()
        .optional()
}).test('at-least-one', 'At least one field must be provided for update', function(value) {
    const keys = Object.keys(value || {});
    return keys.length > 0;
});

// ID validation schema
const idValidationSchema = yup.object().shape({
    id: yup
        .string()
        .required('Accidente ID is required')
        .uuid('Accidente ID must be a valid UUID')
});

// Filter validation schema for getAllAccidentes
const filterValidationSchema = yup.object().shape({
    empleadoId: yup
        .string()
        .optional()
        .uuid('empleadoId must be a valid UUID'),
    
    severidad: yup
        .string()
        .optional()
        .oneOf(VALID_SEVERIDADES, `severidad must be one of: ${VALID_SEVERIDADES.join(', ')}`),
    
    tipoAccidente: yup
        .string()
        .optional()
        .oneOf(VALID_TIPOS_ACCIDENTE, `tipoAccidente must be one of: ${VALID_TIPOS_ACCIDENTE.join(', ')}`),
    
    estado: yup
        .string()
        .optional()
        .oneOf(VALID_ESTADOS, `estado must be one of: ${VALID_ESTADOS.join(', ')}`),
    
    tieneIncapacidad: yup
        .boolean()
        .optional(),
    
    fechaDesde: yup
        .date()
        .optional(),
    
    fechaHasta: yup
        .date()
        .optional()
        .when('fechaDesde', {
            is: (fechaDesde) => fechaDesde,
            then: (schema) => schema.min(yup.ref('fechaDesde'), 'fechaHasta must be after fechaDesde'),
            otherwise: (schema) => schema
        }),
    
    limit: yup
        .number()
        .optional()
        .integer('limit must be an integer')
        .min(1, 'limit must be at least 1')
        .max(100, 'limit cannot exceed 100'),
    
    offset: yup
        .number()
        .optional()
        .integer('offset must be an integer')
        .min(0, 'offset must be greater than or equal to 0')
});

// Statistics validation schemas
const yearValidationSchema = yup.object().shape({
    year: yup
        .number()
        .required('year is required')
        .integer('year must be an integer')
        .min(2000, 'year must be 2000 or later')
        .max(new Date().getFullYear(), `year cannot be greater than ${new Date().getFullYear()}`)
});

module.exports = {
    createAccidenteSchema,
    updateAccidenteSchema,
    idValidationSchema,
    filterValidationSchema,
    yearValidationSchema,
    VALID_SEVERIDADES,
    VALID_TIPOS_ACCIDENTE,
    VALID_TURNOS,
    VALID_ESTADOS
};

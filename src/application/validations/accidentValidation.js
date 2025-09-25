const yup = require('yup');

// Valid enum values
const VALID_SEVERITIES = ['LEVE', 'GRAVE', 'MORTAL'];
const VALID_ACCIDENT_TYPES = ['TRABAJO', 'TRAYECTO', 'ENFERMEDAD_LABORAL'];
const VALID_BODY_PARTS = [
    'CABEZA', 'CUELLO', 'TORSO', 'ESPALDA', 'BRAZO_DERECHO', 'BRAZO_IZQUIERDO',
    'MANO_DERECHA', 'MANO_IZQUIERDA', 'PIERNA_DERECHA', 'PIERNA_IZQUIERDA',
    'PIE_DERECHO', 'PIE_IZQUIERDO', 'MULTIPLE', 'OTRO'
];
const VALID_INJURY_TYPES = [
    'CORTE', 'GOLPE', 'FRACTURA', 'QUEMADURA', 'CONTUSION', 'ESGUINCE',
    'LUXACION', 'HERIDA', 'AMPUTACION', 'INTOXICACION', 'ASFIXIA',
    'ELECTROCUCION', 'OTRO'
];
const VALID_RISK_FACTORS = [
    'MECANICO', 'FISICO', 'QUIMICO', 'BIOLOGICO', 'PSICOSOCIAL',
    'ERGONOMICO', 'AMBIENTAL', 'COMPORTAMENTAL', 'ORGANIZACIONAL'
];
const VALID_TURNOS = ['DIURNO', 'NOCTURNO'];
const VALID_ESTADOS = ['ABIERTO', 'EN_INVESTIGACION', 'CERRADO'];

// Create accident validation schema
const createAccidentSchema = yup.object().shape({
    employeeId: yup
        .string()
        .required('employeeId is required')
        .uuid('employeeId must be a valid UUID'),
    
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
        .oneOf(VALID_SEVERITIES, `severidad must be one of: ${VALID_SEVERITIES.join(', ')}`),
    
    tipoAccidente: yup
        .string()
        .required('tipoAccidente is required')
        .oneOf(VALID_ACCIDENT_TYPES, `tipoAccidente must be one of: ${VALID_ACCIDENT_TYPES.join(', ')}`),
    
    area: yup
        .string()
        .required('area is required')
        .trim()
        .min(1, 'area cannot be empty')
        .max(255, 'area cannot exceed 255 characters'),
    
    cargo: yup
        .string()
        .required('cargo is required')
        .trim()
        .min(1, 'cargo cannot be empty')
        .max(255, 'cargo cannot exceed 255 characters'),
    
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
    
    factorRiesgo: yup
        .string()
        .required('factorRiesgo is required')
        .oneOf(VALID_RISK_FACTORS, `factorRiesgo must be one of: ${VALID_RISK_FACTORS.join(', ')}`),
    
    descripcionAccidente: yup
        .string()
        .required('descripcionAccidente is required')
        .trim()
        .min(10, 'descripcionAccidente must be at least 10 characters')
        .max(5000, 'descripcionAccidente cannot exceed 5000 characters'),
    
    tipoLesion: yup
        .string()
        .required('tipoLesion is required')
        .oneOf(VALID_INJURY_TYPES, `tipoLesion must be one of: ${VALID_INJURY_TYPES.join(', ')}`),
    
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
    
    parteCuerpoAfectada: yup
        .string()
        .required('parteCuerpoAfectada is required')
        .oneOf(VALID_BODY_PARTS, `parteCuerpoAfectada must be one of: ${VALID_BODY_PARTS.join(', ')}`),
    
    situacionDelAccidente: yup
        .string()
        .required('situacionDelAccidente is required')
        .trim()
        .min(10, 'situacionDelAccidente must be at least 10 characters')
        .max(5000, 'situacionDelAccidente cannot exceed 5000 characters'),
    
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
        .when('fechaInicioIncapacidad', {
            is: (val) => val != null,
            then: (schema) => schema.min(yup.ref('fechaInicioIncapacidad'), 'fechaFinIncapacidad must be after fechaInicioIncapacidad'),
            otherwise: (schema) => schema.nullable()
        }),
    
    diasIncapacidad: yup
        .number()
        .integer('diasIncapacidad must be an integer')
        .min(0, 'diasIncapacidad must be greater than or equal to 0')
        .default(0)
        .when('tieneIncapacidad', {
            is: true,
            then: (schema) => schema.min(1, 'diasIncapacidad must be at least 1 when tieneIncapacidad is true'),
            otherwise: (schema) => schema
        }),
    
    fechaInvestigacion: yup
        .date()
        .optional()
        .nullable(),
    
    descripcionInvestigacion: yup
        .string()
        .optional()
        .nullable()
        .max(5000, 'descripcionInvestigacion cannot exceed 5000 characters'),
    
    fechaEjecucionAcciones: yup
        .date()
        .optional()
        .nullable(),
    
    fechaVerificacionAcciones: yup
        .date()
        .optional()
        .nullable()
        .when('fechaEjecucionAcciones', {
            is: (val) => val != null,
            then: (schema) => schema.min(yup.ref('fechaEjecucionAcciones'), 'fechaVerificacionAcciones must be after fechaEjecucionAcciones'),
            otherwise: (schema) => schema.nullable()
        }),
    
    estado: yup
        .string()
        .optional()
        .oneOf(VALID_ESTADOS, `estado must be one of: ${VALID_ESTADOS.join(', ')}`)
        .default('ABIERTO'),
    
    requiereSeguimiento: yup
        .boolean()
        .default(true)
});

// Update accident validation schema
const updateAccidentSchema = yup.object().shape({
    employeeId: yup
        .string()
        .optional()
        .uuid('employeeId must be a valid UUID'),
    
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
        .oneOf(VALID_SEVERITIES, `severidad must be one of: ${VALID_SEVERITIES.join(', ')}`),
    
    tipoAccidente: yup
        .string()
        .optional()
        .oneOf(VALID_ACCIDENT_TYPES, `tipoAccidente must be one of: ${VALID_ACCIDENT_TYPES.join(', ')}`),
    
    area: yup
        .string()
        .optional()
        .trim()
        .min(1, 'area cannot be empty')
        .max(255, 'area cannot exceed 255 characters'),
    
    cargo: yup
        .string()
        .optional()
        .trim()
        .min(1, 'cargo cannot be empty')
        .max(255, 'cargo cannot exceed 255 characters'),
    
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
    
    factorRiesgo: yup
        .string()
        .optional()
        .oneOf(VALID_RISK_FACTORS, `factorRiesgo must be one of: ${VALID_RISK_FACTORS.join(', ')}`),
    
    descripcionAccidente: yup
        .string()
        .optional()
        .trim()
        .min(10, 'descripcionAccidente must be at least 10 characters')
        .max(5000, 'descripcionAccidente cannot exceed 5000 characters'),
    
    tipoLesion: yup
        .string()
        .optional()
        .oneOf(VALID_INJURY_TYPES, `tipoLesion must be one of: ${VALID_INJURY_TYPES.join(', ')}`),
    
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
    
    parteCuerpoAfectada: yup
        .string()
        .optional()
        .oneOf(VALID_BODY_PARTS, `parteCuerpoAfectada must be one of: ${VALID_BODY_PARTS.join(', ')}`),
    
    situacionDelAccidente: yup
        .string()
        .optional()
        .trim()
        .min(10, 'situacionDelAccidente must be at least 10 characters')
        .max(5000, 'situacionDelAccidente cannot exceed 5000 characters'),
    
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
        .nullable(),
    
    diasIncapacidad: yup
        .number()
        .optional()
        .integer('diasIncapacidad must be an integer')
        .min(0, 'diasIncapacidad must be greater than or equal to 0'),
    
    fechaInvestigacion: yup
        .date()
        .optional()
        .nullable(),
    
    descripcionInvestigacion: yup
        .string()
        .optional()
        .nullable()
        .max(5000, 'descripcionInvestigacion cannot exceed 5000 characters'),
    
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

// Filter validation schema for getAll accidents
const accidentFilterValidationSchema = yup.object().shape({
    employeeId: yup
        .string()
        .optional()
        .uuid('employeeId must be a valid UUID'),
    
    severidad: yup
        .string()
        .optional()
        .oneOf(VALID_SEVERITIES, `severidad must be one of: ${VALID_SEVERITIES.join(', ')}`),
    
    tipoAccidente: yup
        .string()
        .optional()
        .oneOf(VALID_ACCIDENT_TYPES, `tipoAccidente must be one of: ${VALID_ACCIDENT_TYPES.join(', ')}`),
    
    factorRiesgo: yup
        .string()
        .optional()
        .oneOf(VALID_RISK_FACTORS, `factorRiesgo must be one of: ${VALID_RISK_FACTORS.join(', ')}`),
    
    tipoLesion: yup
        .string()
        .optional()
        .oneOf(VALID_INJURY_TYPES, `tipoLesion must be one of: ${VALID_INJURY_TYPES.join(', ')}`),
    
    parteCuerpoAfectada: yup
        .string()
        .optional()
        .oneOf(VALID_BODY_PARTS, `parteCuerpoAfectada must be one of: ${VALID_BODY_PARTS.join(', ')}`),
    
    turno: yup
        .string()
        .optional()
        .oneOf(VALID_TURNOS, `turno must be one of: ${VALID_TURNOS.join(', ')}`),
    
    area: yup
        .string()
        .optional()
        .trim(),
    
    cargo: yup
        .string()
        .optional()
        .trim(),
    
    tieneIncapacidad: yup
        .boolean()
        .optional(),
    
    estado: yup
        .string()
        .optional()
        .oneOf(VALID_ESTADOS, `estado must be one of: ${VALID_ESTADOS.join(', ')}`),
    
    fechaDesde: yup
        .date()
        .optional(),
    
    fechaHasta: yup
        .date()
        .optional()
        .test('greater-than-start', 'fechaHasta must be greater than fechaDesde', function(value) {
            const { fechaDesde } = this.parent;
            if (fechaDesde && value && value < fechaDesde) {
                return false;
            }
            return true;
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

// ID validation schema
const idValidationSchema = yup.object().shape({
    id: yup
        .string()
        .required('Accident ID is required')
        .uuid('Accident ID must be a valid UUID')
});

module.exports = {
    createAccidentSchema,
    updateAccidentSchema,
    accidentFilterValidationSchema,
    idValidationSchema,
    VALID_SEVERITIES,
    VALID_ACCIDENT_TYPES,
    VALID_BODY_PARTS,
    VALID_INJURY_TYPES,
    VALID_RISK_FACTORS,
    VALID_TURNOS,
    VALID_ESTADOS
};


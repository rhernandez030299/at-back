const yup = require('yup');

// Centro de trabajo validation will be done against database

// Valid gender options
const VALID_GENDERS = ['M', 'F'];

// Create employee validation schema
const createEmployeeSchema = yup.object().shape({
    nombres: yup
        .string()
        .required('nombres is required')
        .trim()
        .min(1, 'nombres cannot be empty')
        .max(255, 'nombres cannot exceed 255 characters'),
    
    apellido: yup
        .string()
        .required('apellido is required')
        .trim()
        .min(1, 'apellido cannot be empty')
        .max(255, 'apellido cannot exceed 255 characters'),
    
    documentoNo: yup
        .string()
        .required('documentoNo is required')
        .trim()
        .min(1, 'documentoNo cannot be empty')
        .max(50, 'documentoNo cannot exceed 50 characters'),
    
    fechaDeNacimiento: yup
        .date()
        .required('fechaDeNacimiento is required')
        .max(new Date(), 'fechaDeNacimiento cannot be in the future')
        .test('age', 'Employee must be at least 18 years old', function(value) {
            if (!value) return false;
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                return age - 1 >= 18;
            }
            return age >= 18;
        }),
    
    municipioId: yup
        .string()
        .required('municipioId is required')
        .uuid('municipioId must be a valid UUID'),
    
    centroTrabajoId: yup
        .string()
        .required('centroTrabajoId is required')
        .uuid('centroTrabajoId must be a valid UUID'),
    
    sexo: yup
        .string()
        .required('sexo is required')
        .oneOf(VALID_GENDERS, 'sexo must be either M or F'),
    
    salario: yup
        .number()
        .required('salario is required')
        .positive('salario must be a positive number')
        .min(0.01, 'salario must be greater than 0'),
    
    fechaDeIngreso: yup
        .date()
        .optional()
        .default(() => new Date())
});

// Update employee validation schema (all fields optional except validations)
const updateEmployeeSchema = yup.object().shape({
    nombres: yup
        .string()
        .optional()
        .trim()
        .min(1, 'nombres cannot be empty')
        .max(255, 'nombres cannot exceed 255 characters'),
    
    apellido: yup
        .string()
        .optional()
        .trim()
        .min(1, 'apellido cannot be empty')
        .max(255, 'apellido cannot exceed 255 characters'),
    
    documentoNo: yup
        .string()
        .optional()
        .trim()
        .min(1, 'documentoNo cannot be empty')
        .max(50, 'documentoNo cannot exceed 50 characters'),
    
    fechaDeNacimiento: yup
        .date()
        .optional()
        .max(new Date(), 'fechaDeNacimiento cannot be in the future')
        .test('age', 'Employee must be at least 18 years old', function(value) {
            if (!value) return true; // Optional field
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                return age - 1 >= 18;
            }
            return age >= 18;
        }),
    
    municipioId: yup
        .string()
        .optional()
        .uuid('municipioId must be a valid UUID'),
    
    centroTrabajoId: yup
        .string()
        .optional()
        .uuid('centroTrabajoId must be a valid UUID'),
    
    sexo: yup
        .string()
        .optional()
        .oneOf(VALID_GENDERS, 'sexo must be either M or F'),
    
    salario: yup
        .number()
        .optional()
        .positive('salario must be a positive number')
        .min(0.01, 'salario must be greater than 0'),
    
    fechaDeIngreso: yup
        .date()
        .optional()
}).test('at-least-one', 'At least one field must be provided for update', function(value) {
    const keys = Object.keys(value || {});
    return keys.length > 0;
});

// ID validation schema
const idValidationSchema = yup.object().shape({
    id: yup
        .string()
        .required('Employee ID is required')
        .uuid('Employee ID must be a valid UUID')
});

// Filter validation schema for getAllEmployees
const filterValidationSchema = yup.object().shape({
    centroTrabajoId: yup
        .string()
        .optional()
        .uuid('centroTrabajoId must be a valid UUID'),
    
    sexo: yup
        .string()
        .optional()
        .oneOf(VALID_GENDERS, 'sexo must be either M or F'),
    
    municipioId: yup
        .string()
        .optional()
        .uuid('municipioId must be a valid UUID'),
    
    minSalario: yup
        .number()
        .optional()
        .min(0, 'minSalario must be greater than or equal to 0'),
    
    maxSalario: yup
        .number()
        .optional()
        .min(0, 'maxSalario must be greater than or equal to 0')
        .test('greater-than-min', 'maxSalario must be greater than minSalario', function(value) {
            const { minSalario } = this.parent;
            if (minSalario && value && value < minSalario) {
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

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema,
    idValidationSchema,
    filterValidationSchema,
    VALID_GENDERS
};


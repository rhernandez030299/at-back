const Empleado = require('../../../domain/entities/Empleado');
const { crearEmpleadoSchema } = require('../../validations/empleadoValidation');

class CrearEmpleadoUseCase {
    constructor(empleadoRepository, centroTrabajoRepository, ciudadRepository) {
        this.empleadoRepository = empleadoRepository;
        this.centroTrabajoRepository = centroTrabajoRepository;
        this.ciudadRepository = ciudadRepository;
    }

    async execute(empleadoData) {
        // Validate empleado data using Yup schema
        try {
            const validatedData = await crearEmpleadoSchema.validate(empleadoData, {
                abortEarly: false,
                stripUnknown: true
            });

            // Check if empleado with same documento already exists
            const existingEmpleado = await this.empleadoRepository.findByDocumento(validatedData.documentoNo);
            if (existingEmpleado) {
                throw new Error(`Empleado with documento ${validatedData.documentoNo} already exists`);
            }

            // Check if centro de trabajo exists
            const centroTrabajo = await this.centroTrabajoRepository.findById(validatedData.centroTrabajoId);
            if (!centroTrabajo) {
                throw new Error('Centro de trabajo not found');
            }

            if (!centroTrabajo.activo) {
                throw new Error('Centro de trabajo is not active');
            }

            // Check if ciudad exists
            const ciudad = await this.ciudadRepository.findById(validatedData.ciudadId);
            if (!ciudad) {
                throw new Error('Ciudad not found');
            }

            // Create new empleado entity
            const empleado = new Empleado(validatedData);

            // Save to repository
            const createdEmpleado = await this.empleadoRepository.create(empleado);

            return createdEmpleado.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = CrearEmpleadoUseCase;

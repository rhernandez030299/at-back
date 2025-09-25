const { updateEmpleadoSchema, idValidationSchema } = require('../../validations/empleadoValidation');

class ActualizarEmpleadoUseCase {
    constructor(empleadoRepository, centroTrabajoRepository, ciudadRepository) {
        this.empleadoRepository = empleadoRepository;
        this.centroTrabajoRepository = centroTrabajoRepository;
        this.ciudadRepository = ciudadRepository;
    }

    async execute(id, updateData) {
        try {
            // Validate ID
            await idValidationSchema.validate({ id }, { abortEarly: false });

            // Check if empleado exists
            const existingEmpleado = await this.empleadoRepository.findById(id);
            if (!existingEmpleado) {
                throw new Error('Empleado not found');
            }

            // Validate update data using Yup schema
            const validatedData = await updateEmpleadoSchema.validate(updateData, {
                abortEarly: false,
                stripUnknown: true
            });

            // Check if documento is being changed and if new documento already exists
            if (validatedData.documentoNo && validatedData.documentoNo !== existingEmpleado.documentoNo) {
                const empleadoWithSameDocumento = await this.empleadoRepository.findByDocumento(validatedData.documentoNo);
                if (empleadoWithSameDocumento && empleadoWithSameDocumento.id !== id) {
                    throw new Error(`Empleado with documento ${validatedData.documentoNo} already exists`);
                }
            }

            // Check if centro de trabajo is being changed and if it exists
            if (validatedData.centroTrabajoId && validatedData.centroTrabajoId !== existingEmpleado.centroTrabajoId) {
                const centroTrabajo = await this.centroTrabajoRepository.findById(validatedData.centroTrabajoId);
                if (!centroTrabajo) {
                    throw new Error('Centro de trabajo not found');
                }

                if (!centroTrabajo.activo) {
                    throw new Error('Centro de trabajo is not active');
                }
            }

            // Check if ciudad is being changed and if it exists
            if (validatedData.ciudadId && validatedData.ciudadId !== existingEmpleado.ciudadId) {
                const ciudad = await this.ciudadRepository.findById(validatedData.ciudadId);
                if (!ciudad) {
                    throw new Error('Ciudad not found');
                }
            }

            // Update empleado
            const updatedEmpleado = await this.empleadoRepository.update(id, validatedData);

            return updatedEmpleado.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = ActualizarEmpleadoUseCase;

const { idValidationSchema } = require('../../validations/empleadoValidation');

class EliminarEmpleadoUseCase {
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    async execute(id) {
        try {
            // Validate ID using Yup schema
            await idValidationSchema.validate({ id }, { abortEarly: false });

            const deletedEmpleado = await this.empleadoRepository.delete(id);
            
            if (!deletedEmpleado) {
                throw new Error('Empleado not found');
            }

            return {
                message: 'Empleado deleted successfully',
                deletedEmpleado: deletedEmpleado.toJSON()
            };
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = EliminarEmpleadoUseCase;

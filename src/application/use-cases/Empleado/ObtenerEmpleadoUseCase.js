const { idValidationSchema } = require('../../validations/empleadoValidation');

class ObtenerEmpleadoUseCase {
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    async execute(id) {
        try {
            // Validate ID using Yup schema
            await idValidationSchema.validate({ id }, { abortEarly: false });

            const empleado = await this.empleadoRepository.findById(id);
            
            if (!empleado) {
                throw new Error('Empleado not found');
            }

            return empleado.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = ObtenerEmpleadoUseCase;

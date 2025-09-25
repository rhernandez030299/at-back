const yup = require('yup');

// ID validation schema
const idValidationSchema = yup.object().shape({
    id: yup
        .string()
        .required('Centro de Trabajo ID is required')
        .uuid('Centro de Trabajo ID must be a valid UUID')
});

class GetCentroTrabajoUseCase {
    constructor(centroTrabajoRepository) {
        this.centroTrabajoRepository = centroTrabajoRepository;
    }

    async execute(id) {
        try {
            // Validate ID using Yup schema
            await idValidationSchema.validate({ id }, { abortEarly: false });

            const centroTrabajo = await this.centroTrabajoRepository.findById(id);
            
            if (!centroTrabajo) {
                throw new Error('Centro de Trabajo not found');
            }

            return centroTrabajo.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = GetCentroTrabajoUseCase;

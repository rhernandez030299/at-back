const { idValidationSchema } = require('../../validations/accidenteValidation');

class ObtenerAccidenteUseCase {
    constructor(accidenteRepository) {
        this.accidenteRepository = accidenteRepository;
    }

    async execute(id) {
        try {
            // Validate ID using Yup schema
            await idValidationSchema.validate({ id }, { abortEarly: false });

            const accidente = await this.accidenteRepository.findById(id);
            
            if (!accidente) {
                throw new Error('Accidente not found');
            }

            return accidente.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = ObtenerAccidenteUseCase;

const { idValidationSchema } = require('../../validations/accidenteValidation');

class EliminarAccidenteUseCase {
    constructor(accidenteRepository) {
        this.accidenteRepository = accidenteRepository;
    }

    async execute(id) {
        try {
            // Validate ID using Yup schema
            await idValidationSchema.validate({ id }, { abortEarly: false });

            const deletedAccidente = await this.accidenteRepository.delete(id);
            
            if (!deletedAccidente) {
                throw new Error('Accidente not found');
            }

            return {
                message: 'Accidente deleted successfully',
                deletedAccidente: deletedAccidente.toJSON()
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

module.exports = EliminarAccidenteUseCase;

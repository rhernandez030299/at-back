const { idValidationSchema } = require('../validations/accidentValidation');

class DeleteAccidentUseCase {
    constructor(accidentRepository) {
        this.accidentRepository = accidentRepository;
    }

    async execute(id) {
        try {
            // Validate ID using Yup schema
            await idValidationSchema.validate({ id }, { abortEarly: false });

            const deletedAccident = await this.accidentRepository.delete(id);
            
            if (!deletedAccident) {
                throw new Error('Accident not found');
            }

            return {
                message: 'Accident deleted successfully',
                deletedAccident: deletedAccident.toJSON()
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

module.exports = DeleteAccidentUseCase;


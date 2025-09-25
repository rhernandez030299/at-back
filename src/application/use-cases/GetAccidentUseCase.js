const { idValidationSchema } = require('../validations/accidentValidation');

class GetAccidentUseCase {
    constructor(accidentRepository) {
        this.accidentRepository = accidentRepository;
    }

    async execute(id) {
        try {
            // Validate ID using Yup schema
            await idValidationSchema.validate({ id }, { abortEarly: false });

            const accident = await this.accidentRepository.findById(id);
            
            if (!accident) {
                throw new Error('Accident not found');
            }

            return accident.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = GetAccidentUseCase;


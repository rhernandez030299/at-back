const Accident = require('../../domain/entities/Accident');
const { createAccidentSchema } = require('../validations/accidentValidation');

class CreateAccidentUseCase {
    constructor(accidentRepository, employeeRepository) {
        this.accidentRepository = accidentRepository;
        this.employeeRepository = employeeRepository;
    }

    async execute(accidentData) {
        try {
            // Validate accident data using Yup schema
            const validatedData = await createAccidentSchema.validate(accidentData, {
                abortEarly: false,
                stripUnknown: true
            });

            // Check if employee exists
            const employee = await this.employeeRepository.findById(validatedData.employeeId);
            if (!employee) {
                throw new Error('Employee not found');
            }

            // Create new accident entity
            const accident = new Accident(validatedData);

            // Save to repository
            const createdAccident = await this.accidentRepository.create(accident);

            return createdAccident.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = CreateAccidentUseCase;


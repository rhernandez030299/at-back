const { updateAccidentSchema, idValidationSchema } = require('../validations/accidentValidation');

class UpdateAccidentUseCase {
    constructor(accidentRepository, employeeRepository) {
        this.accidentRepository = accidentRepository;
        this.employeeRepository = employeeRepository;
    }

    async execute(id, updateData) {
        try {
            // Validate ID
            await idValidationSchema.validate({ id }, { abortEarly: false });

            // Check if accident exists
            const existingAccident = await this.accidentRepository.findById(id);
            if (!existingAccident) {
                throw new Error('Accident not found');
            }

            // Validate update data using Yup schema
            const validatedData = await updateAccidentSchema.validate(updateData, {
                abortEarly: false,
                stripUnknown: true
            });

            // If employeeId is being changed, check if new employee exists
            if (validatedData.employeeId && validatedData.employeeId !== existingAccident.employeeId) {
                const employee = await this.employeeRepository.findById(validatedData.employeeId);
                if (!employee) {
                    throw new Error('Employee not found');
                }
            }

            // Update accident
            const updatedAccident = await this.accidentRepository.update(id, validatedData);

            return updatedAccident.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = UpdateAccidentUseCase;


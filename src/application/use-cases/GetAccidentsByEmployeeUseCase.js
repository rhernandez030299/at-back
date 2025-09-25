const { idValidationSchema } = require('../validations/employeeValidation');

class GetAccidentsByEmployeeUseCase {
    constructor(accidentRepository, employeeRepository) {
        this.accidentRepository = accidentRepository;
        this.employeeRepository = employeeRepository;
    }

    async execute(employeeId) {
        try {
            // Validate employee ID using Yup schema
            await idValidationSchema.validate({ id: employeeId }, { abortEarly: false });

            // Check if employee exists
            const employee = await this.employeeRepository.findById(employeeId);
            if (!employee) {
                throw new Error('Employee not found');
            }

            // Get all accidents for this employee
            const accidents = await this.accidentRepository.findByEmployeeId(employeeId);

            return {
                employee: employee.toJSON(),
                accidents: accidents.map(accident => accident.toJSON()),
                totalAccidents: accidents.length,
                accidentsWithIncapacity: accidents.filter(a => a.tieneIncapacidad).length,
                totalDaysLost: accidents.reduce((sum, a) => sum + (a.diasIncapacidad || 0), 0)
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

module.exports = GetAccidentsByEmployeeUseCase;


const { idValidationSchema } = require('../validations/employeeValidation');

class DeleteEmployeeUseCase {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    async execute(id) {
        try {
            // Validate ID using Yup schema
            await idValidationSchema.validate({ id }, { abortEarly: false });

            const deletedEmployee = await this.employeeRepository.delete(id);
            
            if (!deletedEmployee) {
                throw new Error('Employee not found');
            }

            return {
                message: 'Employee deleted successfully',
                deletedEmployee: deletedEmployee.toJSON()
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

module.exports = DeleteEmployeeUseCase;

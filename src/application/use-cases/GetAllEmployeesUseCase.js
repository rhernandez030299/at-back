const { filterValidationSchema } = require('../validations/employeeValidation');

class GetAllEmployeesUseCase {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    async execute(filters = {}) {
        try {
            // Validate and sanitize filters using Yup schema
            const validatedFilters = await filterValidationSchema.validate(filters, {
                abortEarly: false,
                stripUnknown: true
            });

            // Get employees with filters
            const employees = await this.employeeRepository.findAll(validatedFilters);
            
            // Get total count for pagination info
            const totalCount = await this.employeeRepository.count(validatedFilters);

            // Calculate pagination info
            const limit = validatedFilters.limit || employees.length;
            const offset = validatedFilters.offset || 0;
            const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;
            const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

            return {
                data: employees.map(employee => employee.toJSON()),
                pagination: {
                    totalCount,
                    totalPages,
                    currentPage,
                    limit,
                    offset,
                    hasNextPage: currentPage < totalPages,
                    hasPreviousPage: currentPage > 1
                },
                filters: validatedFilters
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

module.exports = GetAllEmployeesUseCase;

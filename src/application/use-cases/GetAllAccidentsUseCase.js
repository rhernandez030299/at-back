const { accidentFilterValidationSchema } = require('../validations/accidentValidation');

class GetAllAccidentsUseCase {
    constructor(accidentRepository) {
        this.accidentRepository = accidentRepository;
    }

    async execute(filters = {}) {
        try {
            // Validate and sanitize filters using Yup schema
            const validatedFilters = await accidentFilterValidationSchema.validate(filters, {
                abortEarly: false,
                stripUnknown: true
            });

            // Get accidents with filters
            const accidents = await this.accidentRepository.findAll(validatedFilters);
            
            // Get total count for pagination info
            const totalCount = await this.accidentRepository.count(validatedFilters);

            // Calculate pagination info
            const limit = validatedFilters.limit || accidents.length;
            const offset = validatedFilters.offset || 0;
            const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;
            const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

            return {
                data: accidents.map(accident => accident.toJSON()),
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

module.exports = GetAllAccidentsUseCase;


const { filterValidationSchema } = require('../../validations/accidenteValidation');

class ObtenerTodosAccidentesUseCase {
    constructor(accidenteRepository) {
        this.accidenteRepository = accidenteRepository;
    }

    async execute(filters = {}) {
        try {
            // Validate and sanitize filters using Yup schema
            const validatedFilters = await filterValidationSchema.validate(filters, {
                abortEarly: false,
                stripUnknown: true
            });

            // Get accidentes with filters
            const accidentes = await this.accidenteRepository.findAll(validatedFilters);
            
            // Get total count for pagination info
            const totalCount = await this.accidenteRepository.count(validatedFilters);

            // Calculate pagination info
            const limit = validatedFilters.limit || accidentes.length;
            const offset = validatedFilters.offset || 0;
            const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;
            const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

            return {
                data: accidentes.map(accidente => accidente.toJSON()),
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

module.exports = ObtenerTodosAccidentesUseCase;

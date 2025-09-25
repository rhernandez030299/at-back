const yup = require('yup');

// Filter validation schema
const centroTrabajoFilterSchema = yup.object().shape({
    activo: yup
        .boolean()
        .optional(),
    
    codigo: yup
        .string()
        .optional()
        .trim(),
    
    nombre: yup
        .string()
        .optional()
        .trim(),
    
    limit: yup
        .number()
        .optional()
        .integer('limit must be an integer')
        .min(1, 'limit must be at least 1')
        .max(100, 'limit cannot exceed 100'),
    
    offset: yup
        .number()
        .optional()
        .integer('offset must be an integer')
        .min(0, 'offset must be greater than or equal to 0')
});

class GetAllCentrosTrabajoUseCase {
    constructor(centroTrabajoRepository) {
        this.centroTrabajoRepository = centroTrabajoRepository;
    }

    async execute(filters = {}) {
        try {
            // Validate and sanitize filters using Yup schema
            const validatedFilters = await centroTrabajoFilterSchema.validate(filters, {
                abortEarly: false,
                stripUnknown: true
            });

            // Get centros de trabajo with filters
            const centrosTrabajo = await this.centroTrabajoRepository.findAll(validatedFilters);
            
            // Get total count for pagination info
            const totalCount = await this.centroTrabajoRepository.count(validatedFilters);

            // Calculate pagination info
            const limit = validatedFilters.limit || centrosTrabajo.length;
            const offset = validatedFilters.offset || 0;
            const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;
            const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

            return {
                data: centrosTrabajo.map(centro => centro.toJSON()),
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

module.exports = GetAllCentrosTrabajoUseCase;

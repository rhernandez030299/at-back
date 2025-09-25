const { filterValidationSchema } = require('../../validations/empleadoValidation');

class ObtenerTodosEmpleadosUseCase {
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    async execute(filters = {}) {
        try {
            // Validate and sanitize filters using Yup schema
            const validatedFilters = await filterValidationSchema.validate(filters, {
                abortEarly: false,
                stripUnknown: true
            });

            // Get empleados with filters
            const empleados = await this.empleadoRepository.findAll(validatedFilters);
            
            // Get total count for pagination info
            const totalCount = await this.empleadoRepository.count(validatedFilters);

            // Calculate pagination info
            const limit = validatedFilters.limit || empleados.length;
            const offset = validatedFilters.offset || 0;
            const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;
            const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

            return {
                data: empleados.map(empleado => empleado.toJSON()),
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

module.exports = ObtenerTodosEmpleadosUseCase;

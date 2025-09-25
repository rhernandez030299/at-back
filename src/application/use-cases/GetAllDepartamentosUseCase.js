class GetAllDepartamentosUseCase {
    constructor(departamentoRepository) {
        this.departamentoRepository = departamentoRepository;
    }

    async execute(filters = {}) {
        try {
            // Set default pagination if not provided
            const limit = filters.limit || 50;
            const offset = filters.offset || 0;

            // Get departamentos with filters
            const departamentos = await this.departamentoRepository.findAll({
                ...filters,
                limit,
                offset
            });

            // Get total count for pagination
            const totalCount = await this.departamentoRepository.count(filters);

            // Calculate pagination info
            const totalPages = Math.ceil(totalCount / limit);
            const currentPage = Math.floor(offset / limit) + 1;
            const hasNextPage = currentPage < totalPages;
            const hasPreviousPage = currentPage > 1;

            return {
                data: departamentos.map(departamento => departamento.toJSON()),
                pagination: {
                    totalCount,
                    totalPages,
                    currentPage,
                    limit,
                    offset,
                    hasNextPage,
                    hasPreviousPage
                },
                filters: {
                    nombre: filters.nombre || null,
                    codigo: filters.codigo || null
                }
            };
        } catch (error) {
            console.error('Error in GetAllDepartamentosUseCase:', error);
            throw new Error('Failed to get departamentos');
        }
    }
}

module.exports = GetAllDepartamentosUseCase;


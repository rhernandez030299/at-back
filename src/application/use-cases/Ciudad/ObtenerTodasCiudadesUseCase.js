class ObtenerTodasCiudadesUseCase {
    constructor(ciudadRepository) {
        this.ciudadRepository = ciudadRepository;
    }

    async execute(filters = {}) {
        try {
            // Set default pagination if not provided
            const limit = filters.limit || 50;
            const offset = filters.offset || 0;

            // Get ciudades with filters
            const ciudades = await this.ciudadRepository.findAll({
                ...filters,
                limit,
                offset
            });

            // Get total count for pagination
            const totalCount = await this.ciudadRepository.count(filters);

            // Calculate pagination info
            const totalPages = Math.ceil(totalCount / limit);
            const currentPage = Math.floor(offset / limit) + 1;
            const hasNextPage = currentPage < totalPages;
            const hasPreviousPage = currentPage > 1;

            return {
                data: ciudades.map(ciudad => ciudad.toJSON()),
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
                    codigo: filters.codigo || null,
                    departamentoId: filters.departamentoId || null
                }
            };
        } catch (error) {
            console.error('Error in ObtenerTodasCiudadesUseCase:', error);
            throw new Error('Failed to get ciudades');
        }
    }
}

module.exports = ObtenerTodasCiudadesUseCase;

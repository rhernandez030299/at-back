class ObtenerCiudadesPorDepartamentoUseCase {
    constructor(ciudadRepository, departamentoRepository) {
        this.ciudadRepository = ciudadRepository;
        this.departamentoRepository = departamentoRepository;
    }

    async execute(departamentoId, filters = {}) {
        try {
            // Validate UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(departamentoId)) {
                throw new Error('Invalid departamento ID format');
            }

            // Check if departamento exists
            const departamento = await this.departamentoRepository.findById(departamentoId);
            if (!departamento) {
                throw new Error('Departamento not found');
            }

            // Set default pagination if not provided
            const limit = filters.limit || 50;
            const offset = filters.offset || 0;

            // Get ciudades by departamento with filters
            const ciudades = await this.ciudadRepository.findByDepartamentoId(departamentoId, {
                ...filters,
                limit,
                offset
            });

            // Get total count for pagination
            const totalCount = await this.ciudadRepository.count({
                ...filters,
                departamentoId
            });

            // Calculate pagination info
            const totalPages = Math.ceil(totalCount / limit);
            const currentPage = Math.floor(offset / limit) + 1;
            const hasNextPage = currentPage < totalPages;
            const hasPreviousPage = currentPage > 1;

            return {
                data: ciudades.map(ciudad => ciudad.toJSON()),
                departamento: departamento.toJSON(),
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
                    departamentoId
                }
            };
        } catch (error) {
            console.error('Error in ObtenerCiudadesPorDepartamentoUseCase:', error);
            throw error;
        }
    }
}

module.exports = ObtenerCiudadesPorDepartamentoUseCase;

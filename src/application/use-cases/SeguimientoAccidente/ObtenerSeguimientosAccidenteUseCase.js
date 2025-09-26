class ObtenerSeguimientosAccidenteUseCase {
    constructor(seguimientoAccidenteRepository) {
        this.seguimientoAccidenteRepository = seguimientoAccidenteRepository;
    }

    async execute(filters = {}, options = {}) {
        try {
            const { seguimientos, total } = await this.seguimientoAccidenteRepository.findAll(filters, options);

            return {
                success: true,
                data: {
                    seguimientos,
                    total,
                    page: Math.floor((options.offset || 0) / (options.limit || 50)) + 1,
                    limit: options.limit || 50,
                    totalPages: Math.ceil(total / (options.limit || 50))
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = ObtenerSeguimientosAccidenteUseCase;

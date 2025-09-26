class ObtenerSeguimientoAccidenteUseCase {
    constructor(seguimientoAccidenteRepository) {
        this.seguimientoAccidenteRepository = seguimientoAccidenteRepository;
    }

    async execute(id) {
        try {
            const seguimiento = await this.seguimientoAccidenteRepository.findById(id);

            if (!seguimiento) {
                return {
                    success: false,
                    error: 'Seguimiento no encontrado'
                };
            }

            return {
                success: true,
                data: seguimiento
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = ObtenerSeguimientoAccidenteUseCase;

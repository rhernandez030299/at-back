class ObtenerSeguimientosPorAccidenteUseCase {
    constructor(seguimientoAccidenteRepository, accidenteRepository) {
        this.seguimientoAccidenteRepository = seguimientoAccidenteRepository;
        this.accidenteRepository = accidenteRepository;
    }

    async execute(accidenteId, options = {}) {
        try {
            // Validar que el accidente existe
            const accidenteExiste = await this.accidenteRepository.exists(accidenteId);
            if (!accidenteExiste) {
                return {
                    success: false,
                    error: 'El accidente especificado no existe'
                };
            }

            const { seguimientos, total } = await this.seguimientoAccidenteRepository.findByAccidenteId(accidenteId, options);

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

module.exports = ObtenerSeguimientosPorAccidenteUseCase;

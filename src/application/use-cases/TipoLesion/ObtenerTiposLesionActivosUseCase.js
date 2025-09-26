class ObtenerTiposLesionActivosUseCase {
    constructor(tipoLesionRepository) {
        this.tipoLesionRepository = tipoLesionRepository;
    }

    async execute() {
        try {
            const tiposLesion = await this.tipoLesionRepository.findActivos();
            
            return {
                data: tiposLesion.map(tipo => tipo.toJSON())
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ObtenerTiposLesionActivosUseCase;

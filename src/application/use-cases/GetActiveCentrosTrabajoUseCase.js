class GetActiveCentrosTrabajoUseCase {
    constructor(centroTrabajoRepository) {
        this.centroTrabajoRepository = centroTrabajoRepository;
    }

    async execute() {
        try {
            // Get only active centros de trabajo
            const activeCentrosTrabajo = await this.centroTrabajoRepository.findActive();
            
            return {
                data: activeCentrosTrabajo.map(centro => centro.toJSON()),
                totalCount: activeCentrosTrabajo.length
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = GetActiveCentrosTrabajoUseCase;

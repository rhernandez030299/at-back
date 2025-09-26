class ObtenerFactoresRiesgoActivosUseCase {
    constructor(factorRiesgoRepository) {
        this.factorRiesgoRepository = factorRiesgoRepository;
    }

    async execute() {
        try {
            const factoresRiesgo = await this.factorRiesgoRepository.findActivos();
            
            return {
                data: factoresRiesgo.map(factor => factor.toJSON())
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ObtenerFactoresRiesgoActivosUseCase;

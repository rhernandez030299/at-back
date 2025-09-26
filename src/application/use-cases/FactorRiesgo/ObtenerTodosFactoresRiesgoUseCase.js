class ObtenerTodosFactoresRiesgoUseCase {
    constructor(factorRiesgoRepository) {
        this.factorRiesgoRepository = factorRiesgoRepository;
    }

    async execute() {
        try {
            const factoresRiesgo = await this.factorRiesgoRepository.findAll();
            
            return {
                data: factoresRiesgo.map(factor => factor.toJSON())
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ObtenerTodosFactoresRiesgoUseCase;

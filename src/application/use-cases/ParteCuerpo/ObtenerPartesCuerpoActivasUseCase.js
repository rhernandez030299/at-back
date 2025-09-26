class ObtenerPartesCuerpoActivasUseCase {
    constructor(parteCuerpoRepository) {
        this.parteCuerpoRepository = parteCuerpoRepository;
    }

    async execute() {
        try {
            const partesCuerpo = await this.parteCuerpoRepository.findActivos();
            
            return {
                data: partesCuerpo.map(parte => parte.toJSON())
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ObtenerPartesCuerpoActivasUseCase;

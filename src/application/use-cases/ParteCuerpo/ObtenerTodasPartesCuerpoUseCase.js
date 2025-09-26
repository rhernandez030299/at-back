class ObtenerTodasPartesCuerpoUseCase {
    constructor(parteCuerpoRepository) {
        this.parteCuerpoRepository = parteCuerpoRepository;
    }

    async execute() {
        try {
            const partesCuerpo = await this.parteCuerpoRepository.findAll();
            
            return {
                data: partesCuerpo.map(parte => parte.toJSON())
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ObtenerTodasPartesCuerpoUseCase;

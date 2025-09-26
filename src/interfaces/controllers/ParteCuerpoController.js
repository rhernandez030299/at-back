class ParteCuerpoController {
    constructor({
        obtenerTodasPartesCuerpoUseCase,
        obtenerPartesCuerpoActivasUseCase
    }) {
        this.obtenerTodasPartesCuerpoUseCase = obtenerTodasPartesCuerpoUseCase;
        this.obtenerPartesCuerpoActivasUseCase = obtenerPartesCuerpoActivasUseCase;
    }

    async getAllPartesCuerpo(request, reply) {
        try {
            const result = await this.obtenerTodasPartesCuerpoUseCase.execute();
            
            reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            reply.code(400).send({
                success: false,
                error: error.message
            });
        }
    }

    async getActivePartesCuerpo(request, reply) {
        try {
            const result = await this.obtenerPartesCuerpoActivasUseCase.execute();
            
            reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            reply.code(400).send({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = ParteCuerpoController;

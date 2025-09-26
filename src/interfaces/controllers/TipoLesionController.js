class TipoLesionController {
    constructor({
        obtenerTodosTiposLesionUseCase,
        obtenerTiposLesionActivosUseCase
    }) {
        this.obtenerTodosTiposLesionUseCase = obtenerTodosTiposLesionUseCase;
        this.obtenerTiposLesionActivosUseCase = obtenerTiposLesionActivosUseCase;
    }

    async getAllTiposLesion(request, reply) {
        try {
            const result = await this.obtenerTodosTiposLesionUseCase.execute();
            
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

    async getActiveTiposLesion(request, reply) {
        try {
            const result = await this.obtenerTiposLesionActivosUseCase.execute();
            
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

module.exports = TipoLesionController;

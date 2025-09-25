class CentroTrabajoController {
    constructor({
        obtenerTodosCentrosTrabajoUseCase,
        obtenerCentroTrabajoUseCase,
        obtenerCentrosTrabajoActivosUseCase
    }) {
        this.obtenerTodosCentrosTrabajoUseCase = obtenerTodosCentrosTrabajoUseCase;
        this.obtenerCentroTrabajoUseCase = obtenerCentroTrabajoUseCase;
        this.obtenerCentrosTrabajoActivosUseCase = obtenerCentrosTrabajoActivosUseCase;
    }

    async getAllCentrosTrabajo(request, reply) {
        try {
            const filters = request.query;
            const result = await this.obtenerTodosCentrosTrabajoUseCase.execute(filters);
            
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

    async getCentroTrabajo(request, reply) {
        try {
            const { id } = request.params;
            const result = await this.obtenerCentroTrabajoUseCase.execute(id);
            
            reply.code(200).send({
                success: true,
                data: result
            });
        } catch (error) {
            const statusCode = error.message === 'Centro de Trabajo not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async getActiveCentrosTrabajo(request, reply) {
        try {
            const result = await this.obtenerCentrosTrabajoActivosUseCase.execute();
            
            reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            reply.code(500).send({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = CentroTrabajoController;

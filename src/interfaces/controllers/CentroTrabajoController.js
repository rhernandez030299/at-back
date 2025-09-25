class CentroTrabajoController {
    constructor({
        getAllCentrosTrabajoUseCase,
        getCentroTrabajoUseCase,
        getActiveCentrosTrabajoUseCase
    }) {
        this.getAllCentrosTrabajoUseCase = getAllCentrosTrabajoUseCase;
        this.getCentroTrabajoUseCase = getCentroTrabajoUseCase;
        this.getActiveCentrosTrabajoUseCase = getActiveCentrosTrabajoUseCase;
    }

    async getAllCentrosTrabajo(request, reply) {
        try {
            const filters = request.query;
            const result = await this.getAllCentrosTrabajoUseCase.execute(filters);
            
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
            const result = await this.getCentroTrabajoUseCase.execute(id);
            
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
            const result = await this.getActiveCentrosTrabajoUseCase.execute();
            
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

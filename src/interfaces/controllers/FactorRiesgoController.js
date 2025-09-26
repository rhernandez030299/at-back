class FactorRiesgoController {
    constructor({
        obtenerTodosFactoresRiesgoUseCase,
        obtenerFactoresRiesgoActivosUseCase
    }) {
        this.obtenerTodosFactoresRiesgoUseCase = obtenerTodosFactoresRiesgoUseCase;
        this.obtenerFactoresRiesgoActivosUseCase = obtenerFactoresRiesgoActivosUseCase;
    }

    async getAllFactoresRiesgo(request, reply) {
        try {
            const result = await this.obtenerTodosFactoresRiesgoUseCase.execute();
            
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

    async getActiveFactoresRiesgo(request, reply) {
        try {
            const result = await this.obtenerFactoresRiesgoActivosUseCase.execute();
            
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

module.exports = FactorRiesgoController;

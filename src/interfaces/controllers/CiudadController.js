class CiudadController {
    constructor(getAllCiudadesUseCase, getCiudadesByDepartamentoUseCase) {
        this.getAllCiudadesUseCase = getAllCiudadesUseCase;
        this.getCiudadesByDepartamentoUseCase = getCiudadesByDepartamentoUseCase;
    }

    async getAllCiudades(request, reply) {
        try {
            const filters = {
                nombre: request.query.nombre,
                codigo: request.query.codigo,
                departamentoId: request.query.departamentoId,
                limit: request.query.limit ? parseInt(request.query.limit) : undefined,
                offset: request.query.offset ? parseInt(request.query.offset) : undefined
            };

            const result = await this.getAllCiudadesUseCase.execute(filters);

            return reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Error in getAllCiudades:', error);
            return reply.code(500).send({
                success: false,
                error: error.message
            });
        }
    }

    async getCiudadesByDepartamento(request, reply) {
        try {
            const { departamentoId } = request.params;
            const filters = {
                nombre: request.query.nombre,
                codigo: request.query.codigo,
                limit: request.query.limit ? parseInt(request.query.limit) : undefined,
                offset: request.query.offset ? parseInt(request.query.offset) : undefined
            };

            const result = await this.getCiudadesByDepartamentoUseCase.execute(departamentoId, filters);

            return reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Error in getCiudadesByDepartamento:', error);
            
            if (error.message === 'Departamento not found' || error.message === 'Invalid departamento ID format') {
                return reply.code(404).send({
                    success: false,
                    error: error.message
                });
            }

            return reply.code(500).send({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = CiudadController;


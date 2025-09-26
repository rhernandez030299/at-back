const { 
    validateCreateSeguimiento, 
    validateUpdateSeguimiento, 
    validateFilters, 
    validateUuid 
} = require('../../application/validations/seguimientoAccidenteValidation');

class SeguimientoAccidenteController {
    constructor({ 
        crearSeguimientoAccidenteUseCase,
        obtenerSeguimientoAccidenteUseCase,
        obtenerSeguimientosAccidenteUseCase,
        obtenerSeguimientosPorAccidenteUseCase,
        actualizarSeguimientoAccidenteUseCase,
        eliminarSeguimientoAccidenteUseCase,
        obtenerSeguimientosVencidosUseCase
    }) {
        this.crearSeguimientoAccidenteUseCase = crearSeguimientoAccidenteUseCase;
        this.obtenerSeguimientoAccidenteUseCase = obtenerSeguimientoAccidenteUseCase;
        this.obtenerSeguimientosAccidenteUseCase = obtenerSeguimientosAccidenteUseCase;
        this.obtenerSeguimientosPorAccidenteUseCase = obtenerSeguimientosPorAccidenteUseCase;
        this.actualizarSeguimientoAccidenteUseCase = actualizarSeguimientoAccidenteUseCase;
        this.eliminarSeguimientoAccidenteUseCase = eliminarSeguimientoAccidenteUseCase;
        this.obtenerSeguimientosVencidosUseCase = obtenerSeguimientosVencidosUseCase;
    }

    /**
     * Crear un nuevo seguimiento de accidente
     */
    async crearSeguimiento(request, reply) {
        try {
            // Validar datos de entrada
            const validation = await validateCreateSeguimiento(request.body);
            if (!validation.isValid) {
                return reply.status(400).send({
                    success: false,
                    errors: validation.errors
                });
            }

            // Ejecutar caso de uso
            const result = await this.crearSeguimientoAccidenteUseCase.execute(validation.data);

            if (!result.success) {
                return reply.status(400).send(result);
            }

            return reply.status(201).send(result);
        } catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener un seguimiento por ID
     */
    async obtenerSeguimiento(request, reply) {
        try {
            // Validar UUID
            const validation = await validateUuid(request.params);
            if (!validation.isValid) {
                return reply.status(400).send({
                    success: false,
                    errors: validation.errors
                });
            }

            // Ejecutar caso de uso
            const result = await this.obtenerSeguimientoAccidenteUseCase.execute(validation.data.id);

            if (!result.success) {
                return reply.status(404).send(result);
            }

            return reply.status(200).send(result);
        } catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener todos los seguimientos con filtros
     */
    async obtenerSeguimientos(request, reply) {
        try {
            // Validar filtros y parámetros de consulta
            const validation = await validateFilters({
                ...request.query,
                limit: request.query.limit ? parseInt(request.query.limit) : undefined,
                offset: request.query.offset ? parseInt(request.query.offset) : undefined
            });

            if (!validation.isValid) {
                return reply.status(400).send({
                    success: false,
                    errors: validation.errors
                });
            }

            // Separar filtros de opciones de paginación
            const { limit, offset, orderBy, orderDirection, ...filters } = validation.data;
            const options = {
                limit: limit || 50,
                offset: offset || 0,
                orderBy: orderBy || 'fecha_seguimiento',
                orderDirection: orderDirection || 'DESC'
            };

            // Ejecutar caso de uso
            const result = await this.obtenerSeguimientosAccidenteUseCase.execute(filters, options);

            if (!result.success) {
                return reply.status(400).send(result);
            }

            return reply.status(200).send(result);
        } catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener seguimientos por accidente ID
     */
    async obtenerSeguimientosPorAccidente(request, reply) {
        try {
            // Validar UUID del accidente
            const uuidValidation = await validateUuid({ id: request.params.accidenteId });
            if (!uuidValidation.isValid) {
                return reply.status(400).send({
                    success: false,
                    errors: uuidValidation.errors
                });
            }

            // Validar parámetros de consulta
            const queryValidation = await validateFilters({
                limit: request.query.limit ? parseInt(request.query.limit) : undefined,
                offset: request.query.offset ? parseInt(request.query.offset) : undefined,
                orderBy: request.query.orderBy,
                orderDirection: request.query.orderDirection
            });

            if (!queryValidation.isValid) {
                return reply.status(400).send({
                    success: false,
                    errors: queryValidation.errors
                });
            }

            const options = {
                limit: queryValidation.data.limit || 50,
                offset: queryValidation.data.offset || 0,
                orderBy: queryValidation.data.orderBy || 'fecha_seguimiento',
                orderDirection: queryValidation.data.orderDirection || 'DESC'
            };

            // Ejecutar caso de uso
            const result = await this.obtenerSeguimientosPorAccidenteUseCase.execute(
                uuidValidation.data.id, 
                options
            );

            if (!result.success) {
                return reply.status(404).send(result);
            }

            return reply.status(200).send(result);
        } catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtener seguimientos vencidos
     */
    async obtenerSeguimientosVencidos(request, reply) {
        try {
            // Validar parámetros de consulta
            const validation = await validateFilters({
                limit: request.query.limit ? parseInt(request.query.limit) : undefined,
                offset: request.query.offset ? parseInt(request.query.offset) : undefined
            });

            if (!validation.isValid) {
                return reply.status(400).send({
                    success: false,
                    errors: validation.errors
                });
            }

            const options = {
                limit: validation.data.limit || 50,
                offset: validation.data.offset || 0
            };

            // Ejecutar caso de uso
            const result = await this.obtenerSeguimientosVencidosUseCase.execute(options);

            if (!result.success) {
                return reply.status(400).send(result);
            }

            return reply.status(200).send(result);
        } catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * Actualizar un seguimiento
     */
    async actualizarSeguimiento(request, reply) {
        try {
            // Validar UUID
            const uuidValidation = await validateUuid(request.params);
            if (!uuidValidation.isValid) {
                return reply.status(400).send({
                    success: false,
                    errors: uuidValidation.errors
                });
            }

            // Validar datos de actualización
            const dataValidation = await validateUpdateSeguimiento(request.body);
            if (!dataValidation.isValid) {
                return reply.status(400).send({
                    success: false,
                    errors: dataValidation.errors
                });
            }

            // Ejecutar caso de uso
            const result = await this.actualizarSeguimientoAccidenteUseCase.execute(
                uuidValidation.data.id, 
                dataValidation.data
            );

            if (!result.success) {
                return reply.status(404).send(result);
            }

            return reply.status(200).send(result);
        } catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * Eliminar un seguimiento
     */
    async eliminarSeguimiento(request, reply) {
        try {
            // Validar UUID
            const validation = await validateUuid(request.params);
            if (!validation.isValid) {
                return reply.status(400).send({
                    success: false,
                    errors: validation.errors
                });
            }

            // Ejecutar caso de uso
            const result = await this.eliminarSeguimientoAccidenteUseCase.execute(validation.data.id);

            if (!result.success) {
                return reply.status(404).send(result);
            }

            return reply.status(200).send(result);
        } catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }
}

module.exports = SeguimientoAccidenteController;

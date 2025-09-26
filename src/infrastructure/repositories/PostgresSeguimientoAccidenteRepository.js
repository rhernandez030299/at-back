const SeguimientoAccidenteRepository = require('../../domain/repositories/SeguimientoAccidenteRepository');
const SeguimientoAccidente = require('../../domain/entities/SeguimientoAccidente');

class PostgresSeguimientoAccidenteRepository extends SeguimientoAccidenteRepository {
    constructor(database) {
        super();
        this.db = database;
    }

    async create(seguimiento) {
        const query = `
            INSERT INTO seguimientos_accidente (
                id, accidente_id, fecha_seguimiento, tipo_seguimiento, descripcion, responsable,
                estado_salud, porcentaje_recuperacion, restricciones_laborales, fecha_probable_reintegro,
                documentos_pendientes, gestiones_realizadas, proxima_accion, fecha_proxima_accion,
                seguimiento_completado, observaciones
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
        `;

        const values = [
            seguimiento.id,
            seguimiento.accidenteId,
            seguimiento.fechaSeguimiento,
            seguimiento.tipoSeguimiento,
            seguimiento.descripcion,
            seguimiento.responsable,
            seguimiento.estadoSalud,
            seguimiento.porcentajeRecuperacion,
            seguimiento.restriccionesLaborales,
            seguimiento.fechaProbableReintegro,
            seguimiento.documentosPendientes,
            seguimiento.gestionesRealizadas,
            seguimiento.proximaAccion,
            seguimiento.fechaProximaAccion,
            seguimiento.seguimientoCompletado,
            seguimiento.observaciones
        ];

        try {
            const result = await this.db.query(query, values);
            return this.mapRowToEntity(result.rows[0]);
        } catch (error) {
            throw new Error(`Error creating seguimiento: ${error.message}`);
        }
    }

    async findById(id) {
        const query = `
            SELECT sa.*, 
                   a.fecha_accidente, a.descripcion_accidente,
                   e.nombres, e.apellidos, e.numero_documento
            FROM seguimientos_accidente sa
            INNER JOIN accidentes a ON sa.accidente_id = a.id
            INNER JOIN empleados e ON a.empleado_id = e.id
            WHERE sa.id = $1
        `;

        try {
            const result = await this.db.query(query, [id]);
            return result.rows.length > 0 ? this.mapRowToEntityWithRelations(result.rows[0]) : null;
        } catch (error) {
            throw new Error(`Error finding seguimiento by id: ${error.message}`);
        }
    }

    async findByAccidenteId(accidenteId, options = {}) {
        const { limit = 50, offset = 0, orderBy = 'fecha_seguimiento', orderDirection = 'DESC' } = options;

        const countQuery = `
            SELECT COUNT(*) as total
            FROM seguimientos_accidente
            WHERE accidente_id = $1
        `;

        const query = `
            SELECT sa.*, 
                   a.fecha_accidente, a.descripcion_accidente,
                   e.nombres, e.apellidos, e.numero_documento
            FROM seguimientos_accidente sa
            INNER JOIN accidentes a ON sa.accidente_id = a.id
            INNER JOIN empleados e ON a.empleado_id = e.id
            WHERE sa.accidente_id = $1
            ORDER BY sa.${orderBy} ${orderDirection}
            LIMIT $2 OFFSET $3
        `;

        try {
            const [countResult, dataResult] = await Promise.all([
                this.db.query(countQuery, [accidenteId]),
                this.db.query(query, [accidenteId, limit, offset])
            ]);

            const total = parseInt(countResult.rows[0].total);
            const seguimientos = dataResult.rows.map(row => this.mapRowToEntityWithRelations(row));

            return { seguimientos, total };
        } catch (error) {
            throw new Error(`Error finding seguimientos by accidente id: ${error.message}`);
        }
    }

    async findAll(filters = {}, options = {}) {
        const { limit = 50, offset = 0, orderBy = 'fecha_seguimiento', orderDirection = 'DESC' } = options;
        
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 1;

        // Construir filtros dinámicos
        if (filters.tipoSeguimiento) {
            whereClause += ` AND sa.tipo_seguimiento = $${paramCount}`;
            params.push(filters.tipoSeguimiento);
            paramCount++;
        }

        if (filters.responsable) {
            whereClause += ` AND sa.responsable ILIKE $${paramCount}`;
            params.push(`%${filters.responsable}%`);
            paramCount++;
        }

        if (filters.seguimientoCompletado !== undefined) {
            whereClause += ` AND sa.seguimiento_completado = $${paramCount}`;
            params.push(filters.seguimientoCompletado);
            paramCount++;
        }

        if (filters.estadoSalud) {
            whereClause += ` AND sa.estado_salud = $${paramCount}`;
            params.push(filters.estadoSalud);
            paramCount++;
        }

        if (filters.fechaDesde) {
            whereClause += ` AND sa.fecha_seguimiento >= $${paramCount}`;
            params.push(filters.fechaDesde);
            paramCount++;
        }

        if (filters.fechaHasta) {
            whereClause += ` AND sa.fecha_seguimiento <= $${paramCount}`;
            params.push(filters.fechaHasta);
            paramCount++;
        }

        const countQuery = `
            SELECT COUNT(*) as total
            FROM seguimientos_accidente sa
            INNER JOIN accidentes a ON sa.accidente_id = a.id
            INNER JOIN empleados e ON a.empleado_id = e.id
            ${whereClause}
        `;

        const query = `
            SELECT sa.*, 
                   a.fecha_accidente, a.descripcion_accidente,
                   e.nombres, e.apellidos, e.numero_documento
            FROM seguimientos_accidente sa
            INNER JOIN accidentes a ON sa.accidente_id = a.id
            INNER JOIN empleados e ON a.empleado_id = e.id
            ${whereClause}
            ORDER BY sa.${orderBy} ${orderDirection}
            LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `;

        params.push(limit, offset);

        try {
            const [countResult, dataResult] = await Promise.all([
                this.db.query(countQuery, params.slice(0, -2)),
                this.db.query(query, params)
            ]);

            const total = parseInt(countResult.rows[0].total);
            const seguimientos = dataResult.rows.map(row => this.mapRowToEntityWithRelations(row));

            return { seguimientos, total };
        } catch (error) {
            throw new Error(`Error finding seguimientos: ${error.message}`);
        }
    }

    async findByTipo(tipoSeguimiento, options = {}) {
        return this.findAll({ tipoSeguimiento }, options);
    }

    async findPendientes(options = {}) {
        return this.findAll({ seguimientoCompletado: false }, options);
    }

    async findVencidos(options = {}) {
        const { limit = 50, offset = 0 } = options;
        
        const countQuery = `
            SELECT COUNT(*) as total
            FROM seguimientos_accidente sa
            WHERE sa.fecha_proxima_accion < CURRENT_DATE 
            AND sa.seguimiento_completado = false
            AND sa.fecha_proxima_accion IS NOT NULL
        `;

        const query = `
            SELECT sa.*, 
                   a.fecha_accidente, a.descripcion_accidente,
                   e.nombres, e.apellidos, e.numero_documento
            FROM seguimientos_accidente sa
            INNER JOIN accidentes a ON sa.accidente_id = a.id
            INNER JOIN empleados e ON a.empleado_id = e.id
            WHERE sa.fecha_proxima_accion < CURRENT_DATE 
            AND sa.seguimiento_completado = false
            AND sa.fecha_proxima_accion IS NOT NULL
            ORDER BY sa.fecha_proxima_accion ASC
            LIMIT $1 OFFSET $2
        `;

        try {
            const [countResult, dataResult] = await Promise.all([
                this.db.query(countQuery),
                this.db.query(query, [limit, offset])
            ]);

            const total = parseInt(countResult.rows[0].total);
            const seguimientos = dataResult.rows.map(row => this.mapRowToEntityWithRelations(row));

            return { seguimientos, total };
        } catch (error) {
            throw new Error(`Error finding seguimientos vencidos: ${error.message}`);
        }
    }

    async findByResponsable(responsable, options = {}) {
        return this.findAll({ responsable }, options);
    }

    async update(id, seguimiento) {
        const query = `
            UPDATE seguimientos_accidente SET
                fecha_seguimiento = $2,
                tipo_seguimiento = $3,
                descripcion = $4,
                responsable = $5,
                estado_salud = $6,
                porcentaje_recuperacion = $7,
                restricciones_laborales = $8,
                fecha_probable_reintegro = $9,
                documentos_pendientes = $10,
                gestiones_realizadas = $11,
                proxima_accion = $12,
                fecha_proxima_accion = $13,
                seguimiento_completado = $14,
                observaciones = $15,
                actualizado_en = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const values = [
            id,
            seguimiento.fechaSeguimiento,
            seguimiento.tipoSeguimiento,
            seguimiento.descripcion,
            seguimiento.responsable,
            seguimiento.estadoSalud,
            seguimiento.porcentajeRecuperacion,
            seguimiento.restriccionesLaborales,
            seguimiento.fechaProbableReintegro,
            seguimiento.documentosPendientes,
            seguimiento.gestionesRealizadas,
            seguimiento.proximaAccion,
            seguimiento.fechaProximaAccion,
            seguimiento.seguimientoCompletado,
            seguimiento.observaciones
        ];

        try {
            const result = await this.db.query(query, values);
            if (result.rows.length === 0) {
                throw new Error('Seguimiento not found');
            }
            return await this.findById(id);
        } catch (error) {
            throw new Error(`Error updating seguimiento: ${error.message}`);
        }
    }

    async delete(id) {
        const query = 'DELETE FROM seguimientos_accidente WHERE id = $1';

        try {
            const result = await this.db.query(query, [id]);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting seguimiento: ${error.message}`);
        }
    }

    async countByAccidenteId(accidenteId) {
        const query = 'SELECT COUNT(*) as total FROM seguimientos_accidente WHERE accidente_id = $1';

        try {
            const result = await this.db.query(query, [accidenteId]);
            return parseInt(result.rows[0].total);
        } catch (error) {
            throw new Error(`Error counting seguimientos by accidente: ${error.message}`);
        }
    }

    async countByTipo(tipoSeguimiento) {
        const query = 'SELECT COUNT(*) as total FROM seguimientos_accidente WHERE tipo_seguimiento = $1';

        try {
            const result = await this.db.query(query, [tipoSeguimiento]);
            return parseInt(result.rows[0].total);
        } catch (error) {
            throw new Error(`Error counting seguimientos by tipo: ${error.message}`);
        }
    }

    async exists(id) {
        const query = 'SELECT 1 FROM seguimientos_accidente WHERE id = $1 LIMIT 1';

        try {
            const result = await this.db.query(query, [id]);
            return result.rows.length > 0;
        } catch (error) {
            throw new Error(`Error checking seguimiento existence: ${error.message}`);
        }
    }

    // Métodos de mapeo
    mapRowToEntity(row) {
        return new SeguimientoAccidente({
            id: row.id,
            accidenteId: row.accidente_id,
            fechaSeguimiento: row.fecha_seguimiento,
            tipoSeguimiento: row.tipo_seguimiento,
            descripcion: row.descripcion,
            responsable: row.responsable,
            estadoSalud: row.estado_salud,
            porcentajeRecuperacion: row.porcentaje_recuperacion,
            restriccionesLaborales: row.restricciones_laborales,
            fechaProbableReintegro: row.fecha_probable_reintegro,
            documentosPendientes: row.documentos_pendientes,
            gestionesRealizadas: row.gestiones_realizadas,
            proximaAccion: row.proxima_accion,
            fechaProximaAccion: row.fecha_proxima_accion,
            seguimientoCompletado: row.seguimiento_completado,
            observaciones: row.observaciones,
            creadoEn: row.creado_en,
            actualizadoEn: row.actualizado_en
        });
    }

    mapRowToEntityWithRelations(row) {
        const seguimiento = this.mapRowToEntity(row);
        
        // Agregar información del accidente y empleado
        const seguimientoJson = seguimiento.toJSON();
        seguimientoJson.accidente = {
            fechaAccidente: row.fecha_accidente,
            descripcionAccidente: row.descripcion_accidente
        };
        seguimientoJson.empleado = {
            nombres: row.nombres,
            apellidos: row.apellidos,
            numeroDocumento: row.numero_documento,
            nombreCompleto: `${row.nombres} ${row.apellidos}`
        };

        return seguimientoJson;
    }
}

module.exports = PostgresSeguimientoAccidenteRepository;

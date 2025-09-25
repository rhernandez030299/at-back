const AccidenteRepository = require('../../domain/repositories/AccidenteRepository');
const Accidente = require('../../domain/entities/Accidente');

class PostgresAccidenteRepository extends AccidenteRepository {
    constructor(database) {
        super();
        this.db = database;
    }

    async create(accidente) {
        const query = `
            INSERT INTO accidentes (
                id, empleado_id, fecha_accidente, lugar_accidente, severidad, tipo_accidente,
                area_id, cargo_id, turno, servicio_a_prestar, factor_riesgo_id, descripcion_accidente,
                tipo_lesion_id, agente_del_accidente, mecanismo_del_accidente, parte_cuerpo_afectada_id,
                situacion_del_accidente, tiene_incapacidad, fecha_inicio_incapacidad, fecha_fin_incapacidad,
                dias_incapacidad, estado, requiere_seguimiento
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
            RETURNING *
        `;

        const values = [
            accidente.id,
            accidente.empleadoId,
            accidente.fechaAccidente,
            accidente.lugarAccidente,
            accidente.severidad,
            accidente.tipoAccidente,
            accidente.areaId,
            accidente.cargoId,
            accidente.turno,
            accidente.servicioAPrestar,
            accidente.factorRiesgoId,
            accidente.descripcionAccidente,
            accidente.tipoLesionId,
            accidente.agenteDelAccidente,
            accidente.mecanismoDelAccidente,
            accidente.parteCuerpoAfectadaId,
            accidente.situacionDelAccidente,
            accidente.tieneIncapacidad,
            accidente.fechaInicioIncapacidad,
            accidente.fechaFinIncapacidad,
            accidente.diasIncapacidad,
            accidente.estado,
            accidente.requiereSeguimiento
        ];

        try {
            const result = await this.db.query(query, values);
            return this._mapRowToAccidente(result.rows[0]);
        } catch (error) {
            console.error('Error creating accidente:', error);
            throw error;
        }
    }

    async findById(id) {
        const query = `
            SELECT 
                a.*,
                e.nombres as empleado_nombres,
                e.apellidos as empleado_apellidos,
                e.numero_documento as empleado_numero_documento,
                ar.nombre as area_nombre,
                ar.descripcion as area_descripcion,
                c.nombre as cargo_nombre,
                c.descripcion as cargo_descripcion,
                fr.nombre as factor_riesgo_nombre,
                fr.descripcion as factor_riesgo_descripcion,
                tl.nombre as tipo_lesion_nombre,
                tl.descripcion as tipo_lesion_descripcion,
                pc.nombre as parte_cuerpo_nombre,
                pc.descripcion as parte_cuerpo_descripcion
            FROM accidentes a
            LEFT JOIN empleados e ON a.empleado_id = e.id
            LEFT JOIN areas ar ON a.area_id = ar.id
            LEFT JOIN cargos c ON a.cargo_id = c.id
            LEFT JOIN factores_riesgo fr ON a.factor_riesgo_id = fr.id
            LEFT JOIN tipos_lesion tl ON a.tipo_lesion_id = tl.id
            LEFT JOIN partes_cuerpo pc ON a.parte_cuerpo_afectada_id = pc.id
            WHERE a.id = $1
        `;
        
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToAccidente(result.rows[0]);
    }

    async findByEmpleadoId(empleadoId) {
        const query = `
            SELECT 
                a.*,
                e.nombres as empleado_nombres,
                e.apellidos as empleado_apellidos,
                e.numero_documento as empleado_numero_documento,
                ar.nombre as area_nombre,
                c.nombre as cargo_nombre,
                fr.nombre as factor_riesgo_nombre,
                tl.nombre as tipo_lesion_nombre,
                pc.nombre as parte_cuerpo_nombre
            FROM accidentes a
            LEFT JOIN empleados e ON a.empleado_id = e.id
            LEFT JOIN areas ar ON a.area_id = ar.id
            LEFT JOIN cargos c ON a.cargo_id = c.id
            LEFT JOIN factores_riesgo fr ON a.factor_riesgo_id = fr.id
            LEFT JOIN tipos_lesion tl ON a.tipo_lesion_id = tl.id
            LEFT JOIN partes_cuerpo pc ON a.parte_cuerpo_afectada_id = pc.id
            WHERE a.empleado_id = $1
            ORDER BY a.fecha_accidente DESC
        `;
        
        const result = await this.db.query(query, [empleadoId]);
        return result.rows.map(row => this._mapRowToAccidente(row));
    }

    async findAll(filters = {}) {
        let query = `
            SELECT 
                a.*,
                e.nombres as empleado_nombres,
                e.apellidos as empleado_apellidos,
                e.numero_documento as empleado_numero_documento,
                ar.nombre as area_nombre,
                c.nombre as cargo_nombre,
                fr.nombre as factor_riesgo_nombre,
                tl.nombre as tipo_lesion_nombre,
                pc.nombre as parte_cuerpo_nombre
            FROM accidentes a
            LEFT JOIN empleados e ON a.empleado_id = e.id
            LEFT JOIN areas ar ON a.area_id = ar.id
            LEFT JOIN cargos c ON a.cargo_id = c.id
            LEFT JOIN factores_riesgo fr ON a.factor_riesgo_id = fr.id
            LEFT JOIN tipos_lesion tl ON a.tipo_lesion_id = tl.id
            LEFT JOIN partes_cuerpo pc ON a.parte_cuerpo_afectada_id = pc.id
            WHERE 1=1
        `;
        
        const values = [];
        let paramCount = 1;

        // Apply filters
        if (filters.empleadoId) {
            query += ` AND a.empleado_id = $${paramCount}`;
            values.push(filters.empleadoId);
            paramCount++;
        }

        if (filters.severidad) {
            query += ` AND a.severidad = $${paramCount}`;
            values.push(filters.severidad);
            paramCount++;
        }

        if (filters.tipoAccidente) {
            query += ` AND a.tipo_accidente = $${paramCount}`;
            values.push(filters.tipoAccidente);
            paramCount++;
        }

        if (filters.areaId) {
            query += ` AND a.area_id = $${paramCount}`;
            values.push(filters.areaId);
            paramCount++;
        }

        if (filters.estado) {
            query += ` AND a.estado = $${paramCount}`;
            values.push(filters.estado);
            paramCount++;
        }

        if (filters.tieneIncapacidad !== undefined) {
            query += ` AND a.tiene_incapacidad = $${paramCount}`;
            values.push(filters.tieneIncapacidad);
            paramCount++;
        }

        if (filters.fechaDesde) {
            query += ` AND a.fecha_accidente >= $${paramCount}`;
            values.push(filters.fechaDesde);
            paramCount++;
        }

        if (filters.fechaHasta) {
            query += ` AND a.fecha_accidente <= $${paramCount}`;
            values.push(filters.fechaHasta);
            paramCount++;
        }

        // Add ordering
        query += ' ORDER BY a.fecha_accidente DESC';

        // Add pagination
        if (filters.limit) {
            query += ` LIMIT $${paramCount}`;
            values.push(filters.limit);
            paramCount++;
        }

        if (filters.offset) {
            query += ` OFFSET $${paramCount}`;
            values.push(filters.offset);
            paramCount++;
        }

        const result = await this.db.query(query, values);
        return result.rows.map(row => this._mapRowToAccidente(row));
    }

    async update(id, accidenteData) {
        const existingAccidente = await this.findById(id);
        if (!existingAccidente) {
            return null;
        }

        // Update the accidente entity
        existingAccidente.update(accidenteData);

        const query = `
            UPDATE accidentes SET
                fecha_accidente = $2,
                lugar_accidente = $3,
                severidad = $4,
                tipo_accidente = $5,
                area_id = $6,
                cargo_id = $7,
                turno = $8,
                servicio_a_prestar = $9,
                factor_riesgo_id = $10,
                descripcion_accidente = $11,
                tipo_lesion_id = $12,
                agente_del_accidente = $13,
                mecanismo_del_accidente = $14,
                parte_cuerpo_afectada_id = $15,
                situacion_del_accidente = $16,
                tiene_incapacidad = $17,
                fecha_inicio_incapacidad = $18,
                fecha_fin_incapacidad = $19,
                dias_incapacidad = $20,
                fecha_investigacion = $21,
                descripcion_investigacion = $22,
                fecha_ejecucion_acciones = $23,
                fecha_verificacion_acciones = $24,
                estado = $25,
                requiere_seguimiento = $26,
                actualizado_en = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const values = [
            id,
            existingAccidente.fechaAccidente,
            existingAccidente.lugarAccidente,
            existingAccidente.severidad,
            existingAccidente.tipoAccidente,
            existingAccidente.areaId,
            existingAccidente.cargoId,
            existingAccidente.turno,
            existingAccidente.servicioAPrestar,
            existingAccidente.factorRiesgoId,
            existingAccidente.descripcionAccidente,
            existingAccidente.tipoLesionId,
            existingAccidente.agenteDelAccidente,
            existingAccidente.mecanismoDelAccidente,
            existingAccidente.parteCuerpoAfectadaId,
            existingAccidente.situacionDelAccidente,
            existingAccidente.tieneIncapacidad,
            existingAccidente.fechaInicioIncapacidad,
            existingAccidente.fechaFinIncapacidad,
            existingAccidente.diasIncapacidad,
            existingAccidente.fechaInvestigacion,
            existingAccidente.descripcionInvestigacion,
            existingAccidente.fechaEjecucionAcciones,
            existingAccidente.fechaVerificacionAcciones,
            existingAccidente.estado,
            existingAccidente.requiereSeguimiento
        ];

        try {
            const result = await this.db.query(query, values);
            return this._mapRowToAccidente(result.rows[0]);
        } catch (error) {
            console.error('Error updating accidente:', error);
            throw error;
        }
    }

    async delete(id) {
        const query = 'DELETE FROM accidentes WHERE id = $1 RETURNING *';
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToAccidente(result.rows[0]);
    }

    async exists(id) {
        const query = 'SELECT 1 FROM accidentes WHERE id = $1';
        const result = await this.db.query(query, [id]);
        return result.rows.length > 0;
    }

    async count(filters = {}) {
        let query = `
            SELECT COUNT(*) as count 
            FROM accidentes a
            WHERE 1=1
        `;
        
        const values = [];
        let paramCount = 1;

        // Apply same filters as findAll
        if (filters.empleadoId) {
            query += ` AND a.empleado_id = $${paramCount}`;
            values.push(filters.empleadoId);
            paramCount++;
        }

        if (filters.severidad) {
            query += ` AND a.severidad = $${paramCount}`;
            values.push(filters.severidad);
            paramCount++;
        }

        if (filters.tipoAccidente) {
            query += ` AND a.tipo_accidente = $${paramCount}`;
            values.push(filters.tipoAccidente);
            paramCount++;
        }

        if (filters.areaId) {
            query += ` AND a.area_id = $${paramCount}`;
            values.push(filters.areaId);
            paramCount++;
        }

        if (filters.estado) {
            query += ` AND a.estado = $${paramCount}`;
            values.push(filters.estado);
            paramCount++;
        }

        if (filters.tieneIncapacidad !== undefined) {
            query += ` AND a.tiene_incapacidad = $${paramCount}`;
            values.push(filters.tieneIncapacidad);
            paramCount++;
        }

        if (filters.fechaDesde) {
            query += ` AND a.fecha_accidente >= $${paramCount}`;
            values.push(filters.fechaDesde);
            paramCount++;
        }

        if (filters.fechaHasta) {
            query += ` AND a.fecha_accidente <= $${paramCount}`;
            values.push(filters.fechaHasta);
            paramCount++;
        }

        const result = await this.db.query(query, values);
        return parseInt(result.rows[0].count);
    }

    // Statistics methods
    async getAccidentsByMonth(year) {
        const query = `
            SELECT 
                EXTRACT(MONTH FROM fecha_accidente) as mes,
                COUNT(*) as total,
                COUNT(CASE WHEN tiene_incapacidad = true THEN 1 END) as con_incapacidad,
                AVG(CASE WHEN tiene_incapacidad = true THEN dias_incapacidad ELSE 0 END) as promedio_dias_incapacidad
            FROM accidentes 
            WHERE EXTRACT(YEAR FROM fecha_accidente) = $1
            GROUP BY EXTRACT(MONTH FROM fecha_accidente)
            ORDER BY mes
        `;
        
        const result = await this.db.query(query, [year]);
        return result.rows;
    }

    async getAccidentsBySeverity() {
        const query = `
            SELECT 
                severidad,
                COUNT(*) as total,
                ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as porcentaje
            FROM accidentes 
            GROUP BY severidad
            ORDER BY 
                CASE severidad 
                    WHEN 'Leve' THEN 1
                    WHEN 'Severo' THEN 2
                    WHEN 'Grave' THEN 3
                    WHEN 'Mortal' THEN 4
                END
        `;
        
        const result = await this.db.query(query);
        return result.rows;
    }

    async getAccidentsByArea() {
        const query = `
            SELECT 
                ar.nombre as area,
                COUNT(*) as total,
                ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as porcentaje
            FROM accidentes a
            LEFT JOIN areas ar ON a.area_id = ar.id
            GROUP BY ar.nombre
            ORDER BY total DESC
        `;
        
        const result = await this.db.query(query);
        return result.rows;
    }

    async getAccidentsByTipoLesion() {
        const query = `
            SELECT 
                tl.nombre as tipo_lesion,
                tl.gravedad,
                COUNT(*) as total,
                ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as porcentaje
            FROM accidentes a
            LEFT JOIN tipos_lesion tl ON a.tipo_lesion_id = tl.id
            GROUP BY tl.nombre, tl.gravedad
            ORDER BY total DESC
        `;
        
        const result = await this.db.query(query);
        return result.rows;
    }

    _mapRowToAccidente(row) {
        const accidente = new Accidente({
            id: row.id,
            empleadoId: row.empleado_id,
            fechaAccidente: row.fecha_accidente,
            lugarAccidente: row.lugar_accidente,
            severidad: row.severidad,
            tipoAccidente: row.tipo_accidente,
            areaId: row.area_id,
            cargoId: row.cargo_id,
            turno: row.turno,
            servicioAPrestar: row.servicio_a_prestar,
            factorRiesgoId: row.factor_riesgo_id,
            descripcionAccidente: row.descripcion_accidente,
            tipoLesionId: row.tipo_lesion_id,
            agenteDelAccidente: row.agente_del_accidente,
            mecanismoDelAccidente: row.mecanismo_del_accidente,
            parteCuerpoAfectadaId: row.parte_cuerpo_afectada_id,
            situacionDelAccidente: row.situacion_del_accidente,
            tieneIncapacidad: row.tiene_incapacidad,
            fechaInicioIncapacidad: row.fecha_inicio_incapacidad,
            fechaFinIncapacidad: row.fecha_fin_incapacidad,
            diasIncapacidad: row.dias_incapacidad,
            fechaInvestigacion: row.fecha_investigacion,
            descripcionInvestigacion: row.descripcion_investigacion,
            fechaEjecucionAcciones: row.fecha_ejecucion_acciones,
            fechaVerificacionAcciones: row.fecha_verificacion_acciones,
            estado: row.estado,
            requiereSeguimiento: row.requiere_seguimiento,
            creadoEn: row.creado_en,
            actualizadoEn: row.actualizado_en
        });

        // Add empleado information if available
        if (row.empleado_nombres) {
            accidente.empleado = {
                nombres: row.empleado_nombres,
                apellidos: row.empleado_apellidos,
                numeroDocumento: row.empleado_numero_documento,
                nombreCompleto: `${row.empleado_nombres} ${row.empleado_apellidos}`.trim()
            };
        }

        // Add related entities if available
        if (row.area_nombre) {
            accidente.area = {
                nombre: row.area_nombre,
                descripcion: row.area_descripcion
            };
        }

        if (row.cargo_nombre) {
            accidente.cargo = {
                nombre: row.cargo_nombre,
                descripcion: row.cargo_descripcion
            };
        }

        if (row.factor_riesgo_nombre) {
            accidente.factorRiesgo = {
                nombre: row.factor_riesgo_nombre,
                descripcion: row.factor_riesgo_descripcion
            };
        }

        if (row.tipo_lesion_nombre) {
            accidente.tipoLesion = {
                nombre: row.tipo_lesion_nombre,
                descripcion: row.tipo_lesion_descripcion
            };
        }

        if (row.parte_cuerpo_nombre) {
            accidente.parteCuerpoAfectada = {
                nombre: row.parte_cuerpo_nombre,
                descripcion: row.parte_cuerpo_descripcion
            };
        }

        return accidente;
    }
}

module.exports = PostgresAccidenteRepository;

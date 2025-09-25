const AccidentRepository = require('../../domain/repositories/AccidentRepository');
const Accident = require('../../domain/entities/Accident');

class PostgresAccidentRepository extends AccidentRepository {
    constructor(database) {
        super();
        this.db = database;
    }

    async create(accident) {
        const query = `
            INSERT INTO accidents (
                id, employee_id, fecha_accidente, lugar_accidente, severidad,
                tipo_accidente, area, cargo, turno, servicio_a_prestar,
                factor_riesgo, descripcion_accidente, tipo_lesion, agente_del_accidente,
                mecanismo_del_accidente, parte_cuerpo_afectada, situacion_del_accidente,
                tiene_incapacidad, fecha_inicio_incapacidad, fecha_fin_incapacidad,
                dias_incapacidad, fecha_investigacion, descripcion_investigacion,
                fecha_ejecucion_acciones, fecha_verificacion_acciones, estado, requiere_seguimiento
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
            RETURNING *
        `;

        const values = [
            accident.id,
            accident.employeeId,
            accident.fechaAccidente,
            accident.lugarAccidente,
            accident.severidad,
            accident.tipoAccidente,
            accident.area,
            accident.cargo,
            accident.turno,
            accident.servicioAPrestar,
            accident.factorRiesgo,
            accident.descripcionAccidente,
            accident.tipoLesion,
            accident.agenteDelAccidente,
            accident.mecanismoDelAccidente,
            accident.parteCuerpoAfectada,
            accident.situacionDelAccidente,
            accident.tieneIncapacidad,
            accident.fechaInicioIncapacidad,
            accident.fechaFinIncapacidad,
            accident.diasIncapacidad,
            accident.fechaInvestigacion,
            accident.descripcionInvestigacion,
            accident.fechaEjecucionAcciones,
            accident.fechaVerificacionAcciones,
            accident.estado,
            accident.requiereSeguimiento
        ];

        try {
            const result = await this.db.query(query, values);
            return this._mapRowToAccident(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        const query = 'SELECT * FROM accidents WHERE id = $1';
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToAccident(result.rows[0]);
    }

    async findByEmployeeId(employeeId) {
        const query = 'SELECT * FROM accidents WHERE employee_id = $1 ORDER BY fecha_accidente DESC';
        const result = await this.db.query(query, [employeeId]);
        
        return result.rows.map(row => this._mapRowToAccident(row));
    }

    async findAll(filters = {}) {
        let query = 'SELECT * FROM accidents WHERE 1=1';
        const values = [];
        let paramCount = 1;

        // Apply filters
        if (filters.employeeId) {
            query += ` AND employee_id = $${paramCount}`;
            values.push(filters.employeeId);
            paramCount++;
        }

        if (filters.severidad) {
            query += ` AND severidad = $${paramCount}`;
            values.push(filters.severidad);
            paramCount++;
        }

        if (filters.tipoAccidente) {
            query += ` AND tipo_accidente = $${paramCount}`;
            values.push(filters.tipoAccidente);
            paramCount++;
        }

        if (filters.factorRiesgo) {
            query += ` AND factor_riesgo = $${paramCount}`;
            values.push(filters.factorRiesgo);
            paramCount++;
        }

        if (filters.tipoLesion) {
            query += ` AND tipo_lesion = $${paramCount}`;
            values.push(filters.tipoLesion);
            paramCount++;
        }

        if (filters.parteCuerpoAfectada) {
            query += ` AND parte_cuerpo_afectada = $${paramCount}`;
            values.push(filters.parteCuerpoAfectada);
            paramCount++;
        }

        if (filters.turno) {
            query += ` AND turno = $${paramCount}`;
            values.push(filters.turno);
            paramCount++;
        }

        if (filters.area) {
            query += ` AND area ILIKE $${paramCount}`;
            values.push(`%${filters.area}%`);
            paramCount++;
        }

        if (filters.cargo) {
            query += ` AND cargo ILIKE $${paramCount}`;
            values.push(`%${filters.cargo}%`);
            paramCount++;
        }

        if (filters.tieneIncapacidad !== undefined) {
            query += ` AND tiene_incapacidad = $${paramCount}`;
            values.push(filters.tieneIncapacidad);
            paramCount++;
        }

        if (filters.estado) {
            query += ` AND estado = $${paramCount}`;
            values.push(filters.estado);
            paramCount++;
        }

        if (filters.fechaDesde) {
            query += ` AND fecha_accidente >= $${paramCount}`;
            values.push(filters.fechaDesde);
            paramCount++;
        }

        if (filters.fechaHasta) {
            query += ` AND fecha_accidente <= $${paramCount}`;
            values.push(filters.fechaHasta);
            paramCount++;
        }

        // Add ordering
        query += ' ORDER BY fecha_accidente DESC';

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
        return result.rows.map(row => this._mapRowToAccident(row));
    }

    async update(id, accidentData) {
        const existingAccident = await this.findById(id);
        if (!existingAccident) {
            return null;
        }

        // Update the accident entity
        existingAccident.update(accidentData);

        const query = `
            UPDATE accidents SET
                employee_id = $2,
                fecha_accidente = $3,
                lugar_accidente = $4,
                severidad = $5,
                tipo_accidente = $6,
                area = $7,
                cargo = $8,
                turno = $9,
                servicio_a_prestar = $10,
                factor_riesgo = $11,
                descripcion_accidente = $12,
                tipo_lesion = $13,
                agente_del_accidente = $14,
                mecanismo_del_accidente = $15,
                parte_cuerpo_afectada = $16,
                situacion_del_accidente = $17,
                tiene_incapacidad = $18,
                fecha_inicio_incapacidad = $19,
                fecha_fin_incapacidad = $20,
                dias_incapacidad = $21,
                fecha_investigacion = $22,
                descripcion_investigacion = $23,
                fecha_ejecucion_acciones = $24,
                fecha_verificacion_acciones = $25,
                estado = $26,
                requiere_seguimiento = $27,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const values = [
            id,
            existingAccident.employeeId,
            existingAccident.fechaAccidente,
            existingAccident.lugarAccidente,
            existingAccident.severidad,
            existingAccident.tipoAccidente,
            existingAccident.area,
            existingAccident.cargo,
            existingAccident.turno,
            existingAccident.servicioAPrestar,
            existingAccident.factorRiesgo,
            existingAccident.descripcionAccidente,
            existingAccident.tipoLesion,
            existingAccident.agenteDelAccidente,
            existingAccident.mecanismoDelAccidente,
            existingAccident.parteCuerpoAfectada,
            existingAccident.situacionDelAccidente,
            existingAccident.tieneIncapacidad,
            existingAccident.fechaInicioIncapacidad,
            existingAccident.fechaFinIncapacidad,
            existingAccident.diasIncapacidad,
            existingAccident.fechaInvestigacion,
            existingAccident.descripcionInvestigacion,
            existingAccident.fechaEjecucionAcciones,
            existingAccident.fechaVerificacionAcciones,
            existingAccident.estado,
            existingAccident.requiereSeguimiento
        ];

        try {
            const result = await this.db.query(query, values);
            return this._mapRowToAccident(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        const query = 'DELETE FROM accidents WHERE id = $1 RETURNING *';
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToAccident(result.rows[0]);
    }

    async exists(id) {
        const query = 'SELECT 1 FROM accidents WHERE id = $1';
        const result = await this.db.query(query, [id]);
        return result.rows.length > 0;
    }

    async count(filters = {}) {
        let query = 'SELECT COUNT(*) as count FROM accidents WHERE 1=1';
        const values = [];
        let paramCount = 1;

        // Apply same filters as findAll
        if (filters.employeeId) {
            query += ` AND employee_id = $${paramCount}`;
            values.push(filters.employeeId);
            paramCount++;
        }

        if (filters.severidad) {
            query += ` AND severidad = $${paramCount}`;
            values.push(filters.severidad);
            paramCount++;
        }

        if (filters.tipoAccidente) {
            query += ` AND tipo_accidente = $${paramCount}`;
            values.push(filters.tipoAccidente);
            paramCount++;
        }

        if (filters.factorRiesgo) {
            query += ` AND factor_riesgo = $${paramCount}`;
            values.push(filters.factorRiesgo);
            paramCount++;
        }

        if (filters.tieneIncapacidad !== undefined) {
            query += ` AND tiene_incapacidad = $${paramCount}`;
            values.push(filters.tieneIncapacidad);
            paramCount++;
        }

        if (filters.fechaDesde) {
            query += ` AND fecha_accidente >= $${paramCount}`;
            values.push(filters.fechaDesde);
            paramCount++;
        }

        if (filters.fechaHasta) {
            query += ` AND fecha_accidente <= $${paramCount}`;
            values.push(filters.fechaHasta);
            paramCount++;
        }

        const result = await this.db.query(query, values);
        return parseInt(result.rows[0].count);
    }

    async getAccidentsByDateRange(startDate, endDate) {
        const query = `
            SELECT * FROM accidents 
            WHERE fecha_accidente::date BETWEEN $1 AND $2 
            ORDER BY fecha_accidente DESC
        `;
        const result = await this.db.query(query, [startDate, endDate]);
        return result.rows.map(row => this._mapRowToAccident(row));
    }

    async getAccidentStatistics(filters = {}) {
        const query = `
            SELECT 
                COUNT(*) as total_accidents,
                COUNT(CASE WHEN tiene_incapacidad = true THEN 1 END) as with_incapacity,
                COUNT(CASE WHEN severidad = 'LEVE' THEN 1 END) as leve,
                COUNT(CASE WHEN severidad = 'GRAVE' THEN 1 END) as grave,
                COUNT(CASE WHEN severidad = 'MORTAL' THEN 1 END) as mortal,
                SUM(dias_incapacidad) as total_days_lost,
                AVG(dias_incapacidad) as avg_days_lost
            FROM accidents 
            WHERE 1=1
        `;
        
        const result = await this.db.query(query);
        return result.rows[0];
    }

    _mapRowToAccident(row) {
        return new Accident({
            id: row.id,
            employeeId: row.employee_id,
            fechaAccidente: row.fecha_accidente,
            lugarAccidente: row.lugar_accidente,
            severidad: row.severidad,
            tipoAccidente: row.tipo_accidente,
            area: row.area,
            cargo: row.cargo,
            turno: row.turno,
            servicioAPrestar: row.servicio_a_prestar,
            factorRiesgo: row.factor_riesgo,
            descripcionAccidente: row.descripcion_accidente,
            tipoLesion: row.tipo_lesion,
            agenteDelAccidente: row.agente_del_accidente,
            mecanismoDelAccidente: row.mecanismo_del_accidente,
            parteCuerpoAfectada: row.parte_cuerpo_afectada,
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
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}

module.exports = PostgresAccidentRepository;


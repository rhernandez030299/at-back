const CentroTrabajoRepository = require('../../domain/repositories/CentroTrabajoRepository');
const CentroTrabajo = require('../../domain/entities/CentroTrabajo');

class PostgresCentroTrabajoRepository extends CentroTrabajoRepository {
    constructor(database) {
        super();
        this.db = database;
    }

    async findAll(filters = {}) {
        let query = 'SELECT * FROM centros_trabajo WHERE 1=1';
        const values = [];
        let paramCount = 1;

        // Apply filters
        if (filters.activo !== undefined) {
            query += ` AND activo = $${paramCount}`;
            values.push(filters.activo);
            paramCount++;
        }

        if (filters.codigo) {
            query += ` AND codigo ILIKE $${paramCount}`;
            values.push(`%${filters.codigo}%`);
            paramCount++;
        }

        if (filters.nombre) {
            query += ` AND (nombre ILIKE $${paramCount} OR descripcion ILIKE $${paramCount})`;
            values.push(`%${filters.nombre}%`);
            paramCount++;
        }

        // Add ordering
        query += ' ORDER BY nombre ASC';

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
        return result.rows.map(row => this._mapRowToCentroTrabajo(row));
    }

    async findById(id) {
        const query = 'SELECT * FROM centros_trabajo WHERE id = $1';
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToCentroTrabajo(result.rows[0]);
    }

    async findByCodigo(codigo) {
        const query = 'SELECT * FROM centros_trabajo WHERE codigo = $1';
        const result = await this.db.query(query, [codigo]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToCentroTrabajo(result.rows[0]);
    }

    async findActive() {
        const query = 'SELECT * FROM centros_trabajo WHERE activo = TRUE ORDER BY nombre ASC';
        const result = await this.db.query(query);
        
        return result.rows.map(row => this._mapRowToCentroTrabajo(row));
    }

    async count(filters = {}) {
        let query = 'SELECT COUNT(*) as count FROM centros_trabajo WHERE 1=1';
        const values = [];
        let paramCount = 1;

        // Apply same filters as findAll
        if (filters.activo !== undefined) {
            query += ` AND activo = $${paramCount}`;
            values.push(filters.activo);
            paramCount++;
        }

        if (filters.codigo) {
            query += ` AND codigo ILIKE $${paramCount}`;
            values.push(`%${filters.codigo}%`);
            paramCount++;
        }

        if (filters.nombre) {
            query += ` AND (nombre ILIKE $${paramCount} OR descripcion ILIKE $${paramCount})`;
            values.push(`%${filters.nombre}%`);
            paramCount++;
        }

        const result = await this.db.query(query, values);
        return parseInt(result.rows[0].count);
    }

    async exists(id) {
        const query = 'SELECT 1 FROM centros_trabajo WHERE id = $1';
        const result = await this.db.query(query, [id]);
        return result.rows.length > 0;
    }

    _mapRowToCentroTrabajo(row) {
        return new CentroTrabajo({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            descripcion: row.descripcion,
            direccion: row.direccion,
            telefono: row.telefono,
            email: row.email,
            responsable: row.responsable,
            activo: row.activo,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}

module.exports = PostgresCentroTrabajoRepository;

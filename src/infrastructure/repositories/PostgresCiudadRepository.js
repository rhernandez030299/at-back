const CiudadRepository = require('../../domain/repositories/CiudadRepository');
const Ciudad = require('../../domain/entities/Ciudad');

class PostgresCiudadRepository extends CiudadRepository {
    constructor(database) {
        super();
        this.db = database;
    }

    async findAll(filters = {}) {
        let query = `
            SELECT 
                c.*,
                d.codigo as departamento_codigo,
                d.nombre as departamento_nombre
            FROM ciudades c
            LEFT JOIN departamentos d ON c.departamento_id = d.id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 1;

        // Apply filters
        if (filters.nombre) {
            query += ` AND c.nombre ILIKE $${paramCount}`;
            values.push(`%${filters.nombre}%`);
            paramCount++;
        }

        if (filters.codigo) {
            query += ` AND c.codigo = $${paramCount}`;
            values.push(filters.codigo);
            paramCount++;
        }

        if (filters.departamentoId) {
            query += ` AND c.departamento_id = $${paramCount}`;
            values.push(filters.departamentoId);
            paramCount++;
        }

        // Add ordering
        query += ' ORDER BY c.nombre ASC';

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

        try {
            const result = await this.db.query(query, values);
            return result.rows.map(row => this._mapRowToCiudad(row));
        } catch (error) {
            console.error('Error finding ciudades:', error);
            throw new Error('Failed to find ciudades');
        }
    }

    async findById(id) {
        const query = `
            SELECT 
                c.*,
                d.codigo as departamento_codigo,
                d.nombre as departamento_nombre
            FROM ciudades c
            LEFT JOIN departamentos d ON c.departamento_id = d.id
            WHERE c.id = $1
        `;
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToCiudad(result.rows[0]);
    }

    async findByCodigo(codigo) {
        const query = `
            SELECT 
                c.*,
                d.codigo as departamento_codigo,
                d.nombre as departamento_nombre
            FROM ciudades c
            LEFT JOIN departamentos d ON c.departamento_id = d.id
            WHERE c.codigo = $1
        `;
        const result = await this.db.query(query, [codigo]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToCiudad(result.rows[0]);
    }

    async findByDepartamentoId(departamentoId, filters = {}) {
        let query = `
            SELECT 
                c.*,
                d.codigo as departamento_codigo,
                d.nombre as departamento_nombre
            FROM ciudades c
            LEFT JOIN departamentos d ON c.departamento_id = d.id
            WHERE c.departamento_id = $1
        `;
        const values = [departamentoId];
        let paramCount = 2;

        // Apply additional filters
        if (filters.nombre) {
            query += ` AND c.nombre ILIKE $${paramCount}`;
            values.push(`%${filters.nombre}%`);
            paramCount++;
        }

        if (filters.codigo) {
            query += ` AND c.codigo = $${paramCount}`;
            values.push(filters.codigo);
            paramCount++;
        }

        // Add ordering
        query += ' ORDER BY c.nombre ASC';

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

        try {
            const result = await this.db.query(query, values);
            return result.rows.map(row => this._mapRowToCiudad(row));
        } catch (error) {
            console.error('Error finding ciudades by departamento:', error);
            throw new Error('Failed to find ciudades by departamento');
        }
    }

    async count(filters = {}) {
        let query = `
            SELECT COUNT(*) as count 
            FROM ciudades c
            LEFT JOIN departamentos d ON c.departamento_id = d.id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 1;

        // Apply same filters as findAll
        if (filters.nombre) {
            query += ` AND c.nombre ILIKE $${paramCount}`;
            values.push(`%${filters.nombre}%`);
            paramCount++;
        }

        if (filters.codigo) {
            query += ` AND c.codigo = $${paramCount}`;
            values.push(filters.codigo);
            paramCount++;
        }

        if (filters.departamentoId) {
            query += ` AND c.departamento_id = $${paramCount}`;
            values.push(filters.departamentoId);
            paramCount++;
        }

        const result = await this.db.query(query, values);
        return parseInt(result.rows[0].count);
    }

    _mapRowToCiudad(row) {
        const ciudad = new Ciudad({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            departamentoId: row.departamento_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });

        // Add departamento information if available
        if (row.departamento_codigo) {
            ciudad.departamento = {
                codigo: row.departamento_codigo,
                nombre: row.departamento_nombre
            };
        }

        return ciudad;
    }
}

module.exports = PostgresCiudadRepository;


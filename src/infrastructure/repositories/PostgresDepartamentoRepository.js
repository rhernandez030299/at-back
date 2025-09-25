const DepartamentoRepository = require('../../domain/repositories/DepartamentoRepository');
const Departamento = require('../../domain/entities/Departamento');

class PostgresDepartamentoRepository extends DepartamentoRepository {
    constructor(database) {
        super();
        this.db = database;
    }

    async findAll(filters = {}) {
        let query = 'SELECT * FROM departamentos WHERE 1=1';
        const values = [];
        let paramCount = 1;

        // Apply filters
        if (filters.nombre) {
            query += ` AND nombre ILIKE $${paramCount}`;
            values.push(`%${filters.nombre}%`);
            paramCount++;
        }

        if (filters.codigo) {
            query += ` AND codigo = $${paramCount}`;
            values.push(filters.codigo);
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

        try {
            const result = await this.db.query(query, values);
            return result.rows.map(row => this._mapRowToDepartamento(row));
        } catch (error) {
            console.error('Error finding departamentos:', error);
            throw new Error('Failed to find departamentos');
        }
    }

    async findById(id) {
        const query = 'SELECT * FROM departamentos WHERE id = $1';
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToDepartamento(result.rows[0]);
    }

    async findByCodigo(codigo) {
        const query = 'SELECT * FROM departamentos WHERE codigo = $1';
        const result = await this.db.query(query, [codigo]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToDepartamento(result.rows[0]);
    }

    async count(filters = {}) {
        let query = 'SELECT COUNT(*) as count FROM departamentos WHERE 1=1';
        const values = [];
        let paramCount = 1;

        // Apply same filters as findAll
        if (filters.nombre) {
            query += ` AND nombre ILIKE $${paramCount}`;
            values.push(`%${filters.nombre}%`);
            paramCount++;
        }

        if (filters.codigo) {
            query += ` AND codigo = $${paramCount}`;
            values.push(filters.codigo);
            paramCount++;
        }

        const result = await this.db.query(query, values);
        return parseInt(result.rows[0].count);
    }

    _mapRowToDepartamento(row) {
        return new Departamento({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}

module.exports = PostgresDepartamentoRepository;


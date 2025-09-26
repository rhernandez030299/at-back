const ParteCuerpoRepository = require('../../domain/repositories/ParteCuerpoRepository');
const ParteCuerpo = require('../../domain/entities/ParteCuerpo');

class PostgresParteCuerpoRepository extends ParteCuerpoRepository {
    constructor(database) {
        super();
        this.db = database;
    }

    async findAll() {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                region_anatomica,
                lateralidad,
                criticidad,
                tiempo_recuperacion_promedio,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM partes_cuerpo
            ORDER BY region_anatomica ASC, nombre ASC
        `;
        
        const result = await this.db.query(query);
        return result.rows.map(row => this._mapRowToParteCuerpo(row));
    }

    async findById(id) {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                region_anatomica,
                lateralidad,
                criticidad,
                tiempo_recuperacion_promedio,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM partes_cuerpo
            WHERE id = $1
        `;
        
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToParteCuerpo(result.rows[0]);
    }

    async findActivos() {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                region_anatomica,
                lateralidad,
                criticidad,
                tiempo_recuperacion_promedio,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM partes_cuerpo
            WHERE activo = true
            ORDER BY region_anatomica ASC, nombre ASC
        `;
        
        const result = await this.db.query(query);
        return result.rows.map(row => this._mapRowToParteCuerpo(row));
    }

    async findByRegionAnatomica(region) {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                region_anatomica,
                lateralidad,
                criticidad,
                tiempo_recuperacion_promedio,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM partes_cuerpo
            WHERE region_anatomica = $1 AND activo = true
            ORDER BY nombre ASC
        `;
        
        const result = await this.db.query(query, [region]);
        return result.rows.map(row => this._mapRowToParteCuerpo(row));
    }

    _mapRowToParteCuerpo(row) {
        return new ParteCuerpo({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            regionAnatomica: row.region_anatomica,
            lateralidad: row.lateralidad,
            criticidad: row.criticidad,
            tiempoRecuperacionPromedio: row.tiempo_recuperacion_promedio,
            activo: row.activo,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}

module.exports = PostgresParteCuerpoRepository;

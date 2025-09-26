const FactorRiesgoRepository = require('../../domain/repositories/FactorRiesgoRepository');
const FactorRiesgo = require('../../domain/entities/FactorRiesgo');

class PostgresFactorRiesgoRepository extends FactorRiesgoRepository {
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
                nivel_peligrosidad,
                requiere_epp,
                requiere_capacitacion,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM factores_riesgo
            ORDER BY nivel_peligrosidad DESC, nombre ASC
        `;
        
        const result = await this.db.query(query);
        return result.rows.map(row => this._mapRowToFactorRiesgo(row));
    }

    async findById(id) {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                nivel_peligrosidad,
                requiere_epp,
                requiere_capacitacion,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM factores_riesgo
            WHERE id = $1
        `;
        
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToFactorRiesgo(result.rows[0]);
    }

    async findActivos() {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                nivel_peligrosidad,
                requiere_epp,
                requiere_capacitacion,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM factores_riesgo
            WHERE activo = true
            ORDER BY nivel_peligrosidad DESC, nombre ASC
        `;
        
        const result = await this.db.query(query);
        return result.rows.map(row => this._mapRowToFactorRiesgo(row));
    }

    async findByNivelPeligrosidad(nivel) {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                nivel_peligrosidad,
                requiere_epp,
                requiere_capacitacion,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM factores_riesgo
            WHERE nivel_peligrosidad = $1 AND activo = true
            ORDER BY nombre ASC
        `;
        
        const result = await this.db.query(query, [nivel]);
        return result.rows.map(row => this._mapRowToFactorRiesgo(row));
    }

    _mapRowToFactorRiesgo(row) {
        return new FactorRiesgo({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            nivelPeligrosidad: row.nivel_peligrosidad,
            requiereEpp: row.requiere_epp,
            requiereCapacitacion: row.requiere_capacitacion,
            activo: row.activo,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}

module.exports = PostgresFactorRiesgoRepository;

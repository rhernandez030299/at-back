const TipoLesionRepository = require('../../domain/repositories/TipoLesionRepository');
const TipoLesion = require('../../domain/entities/TipoLesion');

class PostgresTipoLesionRepository extends TipoLesionRepository {
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
                gravedad,
                requiere_atencion_inmediata,
                requiere_hospitalizacion,
                tiempo_recuperacion_estimado,
                requiere_cirugia,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM tipos_lesion
            ORDER BY gravedad DESC, nombre ASC
        `;
        
        const result = await this.db.query(query);
        return result.rows.map(row => this._mapRowToTipoLesion(row));
    }

    async findById(id) {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                gravedad,
                requiere_atencion_inmediata,
                requiere_hospitalizacion,
                tiempo_recuperacion_estimado,
                requiere_cirugia,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM tipos_lesion
            WHERE id = $1
        `;
        
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToTipoLesion(result.rows[0]);
    }

    async findActivos() {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                gravedad,
                requiere_atencion_inmediata,
                requiere_hospitalizacion,
                tiempo_recuperacion_estimado,
                requiere_cirugia,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM tipos_lesion
            WHERE activo = true
            ORDER BY gravedad DESC, nombre ASC
        `;
        
        const result = await this.db.query(query);
        return result.rows.map(row => this._mapRowToTipoLesion(row));
    }

    async findByGravedad(gravedad) {
        const query = `
            SELECT 
                id,
                nombre,
                descripcion,
                gravedad,
                requiere_atencion_inmediata,
                requiere_hospitalizacion,
                tiempo_recuperacion_estimado,
                requiere_cirugia,
                activo,
                creado_en as created_at,
                actualizado_en as updated_at
            FROM tipos_lesion
            WHERE gravedad = $1 AND activo = true
            ORDER BY nombre ASC
        `;
        
        const result = await this.db.query(query, [gravedad]);
        return result.rows.map(row => this._mapRowToTipoLesion(row));
    }

    _mapRowToTipoLesion(row) {
        return new TipoLesion({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            gravedad: row.gravedad,
            requiereAtencionInmediata: row.requiere_atencion_inmediata,
            requiereHospitalizacion: row.requiere_hospitalizacion,
            tiempoRecuperacionEstimado: row.tiempo_recuperacion_estimado,
            requiereCirugia: row.requiere_cirugia,
            activo: row.activo,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}

module.exports = PostgresTipoLesionRepository;

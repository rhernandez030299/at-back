/**
 * ParteCuerpo Domain Entity
 * Represents a body part that can be affected in an accident
 */
class ParteCuerpo {
    constructor({
        id,
        nombre,
        descripcion,
        regionAnatomica,
        lateralidad = 'NO_APLICA',
        criticidad = 'MEDIA',
        tiempoRecuperacionPromedio,
        activo = true,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.regionAnatomica = regionAnatomica;
        this.lateralidad = lateralidad;
        this.criticidad = criticidad;
        this.tiempoRecuperacionPromedio = tiempoRecuperacionPromedio;
        this.activo = activo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion,
            regionAnatomica: this.regionAnatomica,
            lateralidad: this.lateralidad,
            criticidad: this.criticidad,
            tiempoRecuperacionPromedio: this.tiempoRecuperacionPromedio,
            activo: this.activo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = ParteCuerpo;

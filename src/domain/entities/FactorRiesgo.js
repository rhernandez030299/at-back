/**
 * FactorRiesgo Domain Entity
 * Represents a risk factor in the workplace
 */
class FactorRiesgo {
    constructor({
        id,
        nombre,
        descripcion,
        nivelPeligrosidad = 'MEDIO',
        requiereEpp = false,
        requiereCapacitacion = false,
        activo = true,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.nivelPeligrosidad = nivelPeligrosidad;
        this.requiereEpp = requiereEpp;
        this.requiereCapacitacion = requiereCapacitacion;
        this.activo = activo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion,
            nivelPeligrosidad: this.nivelPeligrosidad,
            requiereEpp: this.requiereEpp,
            requiereCapacitacion: this.requiereCapacitacion,
            activo: this.activo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = FactorRiesgo;

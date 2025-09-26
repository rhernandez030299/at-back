/**
 * TipoLesion Domain Entity
 * Represents a type of injury
 */
class TipoLesion {
    constructor({
        id,
        nombre,
        descripcion,
        gravedad = 'MODERADA',
        requiereAtencionInmediata = false,
        requiereHospitalizacion = false,
        tiempoRecuperacionEstimado,
        requiereCirugia = false,
        activo = true,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.gravedad = gravedad;
        this.requiereAtencionInmediata = requiereAtencionInmediata;
        this.requiereHospitalizacion = requiereHospitalizacion;
        this.tiempoRecuperacionEstimado = tiempoRecuperacionEstimado;
        this.requiereCirugia = requiereCirugia;
        this.activo = activo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion,
            gravedad: this.gravedad,
            requiereAtencionInmediata: this.requiereAtencionInmediata,
            requiereHospitalizacion: this.requiereHospitalizacion,
            tiempoRecuperacionEstimado: this.tiempoRecuperacionEstimado,
            requiereCirugia: this.requiereCirugia,
            activo: this.activo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = TipoLesion;

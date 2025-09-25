const { v4: uuidv4 } = require('uuid');

class CentroTrabajo {
    constructor({
        id,
        codigo,
        nombre,
        descripcion,
        direccion,
        telefono,
        email,
        responsable,
        activo,
        createdAt,
        updatedAt
    }) {
        this.id = id || uuidv4();
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
        this.responsable = responsable;
        this.activo = activo !== undefined ? activo : true;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    // Check if center is active
    get isActive() {
        return this.activo;
    }

    // Get full display name
    get nombreCompleto() {
        return this.descripcion || this.nombre;
    }

    // Convert to JSON representation
    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            nombre: this.nombre,
            descripcion: this.descripcion,
            direccion: this.direccion,
            telefono: this.telefono,
            email: this.email,
            responsable: this.responsable,
            activo: this.activo,
            isActive: this.isActive,
            nombreCompleto: this.nombreCompleto,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = CentroTrabajo;

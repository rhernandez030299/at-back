const { v4: uuidv4 } = require('uuid');

class Departamento {
    constructor({
        id,
        codigo,
        nombre,
        createdAt,
        updatedAt
    }) {
        this.id = id || uuidv4();
        this.codigo = codigo;
        this.nombre = nombre;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    // Convert to JSON representation
    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            nombre: this.nombre,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Update departamento data
    update(data) {
        if (data.codigo !== undefined) this.codigo = data.codigo;
        if (data.nombre !== undefined) this.nombre = data.nombre;
        
        this.updatedAt = new Date();
    }

    // Validation methods
    static validateCodigo(codigo) {
        return codigo && codigo.length >= 2 && codigo.length <= 10;
    }

    static validateNombre(nombre) {
        return nombre && nombre.trim().length >= 1 && nombre.length <= 100;
    }
}

module.exports = Departamento;


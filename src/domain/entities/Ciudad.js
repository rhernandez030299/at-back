const { v4: uuidv4 } = require('uuid');

class Ciudad {
    constructor({
        id,
        codigo,
        nombre,
        departamentoId,
        createdAt,
        updatedAt
    }) {
        this.id = id || uuidv4();
        this.codigo = codigo;
        this.nombre = nombre;
        this.departamentoId = departamentoId;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    // Convert to JSON representation
    toJSON() {
        const json = {
            id: this.id,
            codigo: this.codigo,
            nombre: this.nombre,
            departamentoId: this.departamentoId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };

        // Include departamento information if available
        if (this.departamento) {
            json.departamento = this.departamento;
        }

        return json;
    }

    // Update ciudad data
    update(data) {
        if (data.codigo !== undefined) this.codigo = data.codigo;
        if (data.nombre !== undefined) this.nombre = data.nombre;
        if (data.departamentoId !== undefined) this.departamentoId = data.departamentoId;
        
        this.updatedAt = new Date();
    }

    // Validation methods
    static validateCodigo(codigo) {
        return codigo && codigo.length >= 5 && codigo.length <= 10;
    }

    static validateNombre(nombre) {
        return nombre && nombre.trim().length >= 1 && nombre.length <= 100;
    }

    static validateDepartamentoId(departamentoId) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return departamentoId && uuidRegex.test(departamentoId);
    }
}

module.exports = Ciudad;


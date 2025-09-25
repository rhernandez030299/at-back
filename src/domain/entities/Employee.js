const { v4: uuidv4 } = require('uuid');

class Employee {
    constructor({
        id,
        nombres,
        apellido,
        documentoNo,
        fechaDeNacimiento,
        municipioId,
        centroTrabajoId,
        sexo,
        salario,
        fechaDeIngreso,
        createdAt,
        updatedAt
    }) {
        this.id = id || uuidv4();
        this.nombres = nombres;
        this.apellido = apellido;
        this.documentoNo = documentoNo;
        this.fechaDeNacimiento = fechaDeNacimiento;
        this.municipioId = municipioId;
        this.centroTrabajoId = centroTrabajoId;
        this.sexo = sexo;
        this.salario = salario;
        this.fechaDeIngreso = fechaDeIngreso || new Date();
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    // Calculate age based on birth date
    get edad() {
        const today = new Date();
        const birthDate = new Date(this.fechaDeNacimiento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    // Get month from fechaDeIngreso
    get mes() {
        const months = [
            'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
            'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
        ];
        const date = new Date(this.fechaDeIngreso);
        return months[date.getMonth()];
    }

    // Validation methods
    static validateCentroTrabajoId(centroTrabajoId) {
        // Basic UUID format validation
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return centroTrabajoId && uuidRegex.test(centroTrabajoId);
    }

    static validateMunicipioId(municipioId) {
        // Basic UUID format validation
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return municipioId && uuidRegex.test(municipioId);
    }

    static validateGender(sexo) {
        return ['M', 'F'].includes(sexo);
    }

    static validateDocumento(documentoNo) {
        return documentoNo && documentoNo.trim().length > 0;
    }

    static validateNombres(nombres) {
        return nombres && nombres.trim().length > 0;
    }

    static validateApellido(apellido) {
        return apellido && apellido.trim().length > 0;
    }

    static validateSalario(salario) {
        return typeof salario === 'number' && salario > 0;
    }

    static validateFecha(fecha) {
        const date = new Date(fecha);
        return date instanceof Date && !isNaN(date);
    }

    // Get full name
    get nombreCompleto() {
        return `${this.nombres} ${this.apellido}`.trim();
    }

    // Convert to JSON representation
    toJSON() {
        const json = {
            id: this.id,
            nombres: this.nombres,
            apellido: this.apellido,
            nombreCompleto: this.nombreCompleto,
            documentoNo: this.documentoNo,
            fechaDeNacimiento: this.fechaDeNacimiento,
            municipioId: this.municipioId,
            municipio: this.municipio ? this.municipio.nombre : null,
            departamentoId: this.municipio && this.municipio.departamento ? this.municipio.departamento.id : null,
            centroTrabajoId: this.centroTrabajoId,
            cpt: this.centroTrabajo ? this.centroTrabajo.nombre : null,
            sexo: this.sexo,
            salario: this.salario,
            fechaDeIngreso: this.fechaDeIngreso,
            edad: this.edad,
            mes: this.mes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };

        // Include full centro de trabajo information if available
        if (this.centroTrabajo) {
            json.centroTrabajo = this.centroTrabajo;
        }

        // Include full municipio information if available
        if (this.municipio) {
            json.municipioInfo = this.municipio;
        }

        return json;
    }

    // Update employee data
    update(data) {
        if (data.nombres !== undefined) this.nombres = data.nombres;
        if (data.apellido !== undefined) this.apellido = data.apellido;
        if (data.documentoNo !== undefined) this.documentoNo = data.documentoNo;
        if (data.fechaDeNacimiento !== undefined) this.fechaDeNacimiento = data.fechaDeNacimiento;
        if (data.municipioId !== undefined) this.municipioId = data.municipioId;
        if (data.centroTrabajoId !== undefined) this.centroTrabajoId = data.centroTrabajoId;
        if (data.sexo !== undefined) this.sexo = data.sexo;
        if (data.salario !== undefined) this.salario = data.salario;
        if (data.fechaDeIngreso !== undefined) this.fechaDeIngreso = data.fechaDeIngreso;
        
        this.updatedAt = new Date();
    }
}

module.exports = Employee;


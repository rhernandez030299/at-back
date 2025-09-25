const { v4: uuidv4 } = require('uuid');

class Accident {
    constructor({
        id,
        employeeId,
        fechaAccidente,
        lugarAccidente,
        severidad,
        tipoAccidente,
        area,
        cargo,
        turno,
        servicioAPrestar,
        factorRiesgo,
        descripcionAccidente,
        tipoLesion,
        agenteDelAccidente,
        mecanismoDelAccidente,
        parteCuerpoAfectada,
        situacionDelAccidente,
        tieneIncapacidad,
        fechaInicioIncapacidad,
        fechaFinIncapacidad,
        diasIncapacidad,
        fechaInvestigacion,
        descripcionInvestigacion,
        fechaEjecucionAcciones,
        fechaVerificacionAcciones,
        estado,
        requiereSeguimiento,
        createdAt,
        updatedAt
    }) {
        this.id = id || uuidv4();
        this.employeeId = employeeId;
        this.fechaAccidente = fechaAccidente;
        this.lugarAccidente = lugarAccidente;
        this.severidad = severidad;
        this.tipoAccidente = tipoAccidente;
        this.area = area;
        this.cargo = cargo;
        this.turno = turno;
        this.servicioAPrestar = servicioAPrestar;
        this.factorRiesgo = factorRiesgo;
        this.descripcionAccidente = descripcionAccidente;
        this.tipoLesion = tipoLesion;
        this.agenteDelAccidente = agenteDelAccidente;
        this.mecanismoDelAccidente = mecanismoDelAccidente;
        this.parteCuerpoAfectada = parteCuerpoAfectada;
        this.situacionDelAccidente = situacionDelAccidente;
        this.tieneIncapacidad = tieneIncapacidad || false;
        this.fechaInicioIncapacidad = fechaInicioIncapacidad;
        this.fechaFinIncapacidad = fechaFinIncapacidad;
        this.diasIncapacidad = diasIncapacidad || 0;
        this.fechaInvestigacion = fechaInvestigacion;
        this.descripcionInvestigacion = descripcionInvestigacion;
        this.fechaEjecucionAcciones = fechaEjecucionAcciones;
        this.fechaVerificacionAcciones = fechaVerificacionAcciones;
        this.estado = estado || 'ABIERTO';
        this.requiereSeguimiento = requiereSeguimiento !== undefined ? requiereSeguimiento : true;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    // Validation methods
    static validateSeverity(severidad) {
        const validSeverities = ['LEVE', 'GRAVE', 'MORTAL'];
        return validSeverities.includes(severidad);
    }

    static validateAccidentType(tipoAccidente) {
        const validTypes = ['TRABAJO', 'TRAYECTO', 'ENFERMEDAD_LABORAL'];
        return validTypes.includes(tipoAccidente);
    }

    static validateBodyPart(parteCuerpoAfectada) {
        const validBodyParts = [
            'CABEZA', 'CUELLO', 'TORSO', 'ESPALDA', 'BRAZO_DERECHO', 'BRAZO_IZQUIERDO',
            'MANO_DERECHA', 'MANO_IZQUIERDA', 'PIERNA_DERECHA', 'PIERNA_IZQUIERDA',
            'PIE_DERECHO', 'PIE_IZQUIERDO', 'MULTIPLE', 'OTRO'
        ];
        return validBodyParts.includes(parteCuerpoAfectada);
    }

    static validateInjuryType(tipoLesion) {
        const validInjuryTypes = [
            'CORTE', 'GOLPE', 'FRACTURA', 'QUEMADURA', 'CONTUSION', 'ESGUINCE',
            'LUXACION', 'HERIDA', 'AMPUTACION', 'INTOXICACION', 'ASFIXIA',
            'ELECTROCUCION', 'OTRO'
        ];
        return validInjuryTypes.includes(tipoLesion);
    }

    static validateRiskFactor(factorRiesgo) {
        const validRiskFactors = [
            'MECANICO', 'FISICO', 'QUIMICO', 'BIOLOGICO', 'PSICOSOCIAL',
            'ERGONOMICO', 'AMBIENTAL', 'COMPORTAMENTAL', 'ORGANIZACIONAL'
        ];
        return validRiskFactors.includes(factorRiesgo);
    }

    static validateTurno(turno) {
        const validTurnos = ['DIURNO', 'NOCTURNO'];
        return validTurnos.includes(turno);
    }

    static validateEstado(estado) {
        const validEstados = ['ABIERTO', 'EN_INVESTIGACION', 'CERRADO'];
        return validEstados.includes(estado);
    }

    static validateDate(fecha) {
        const date = new Date(fecha);
        return date instanceof Date && !isNaN(date);
    }

    // Calculate duration of incapacity if both dates are provided
    get duracionIncapacidadCalculada() {
        if (this.fechaInicioIncapacidad && this.fechaFinIncapacidad) {
            const inicio = new Date(this.fechaInicioIncapacidad);
            const fin = new Date(this.fechaFinIncapacidad);
            const diffTime = Math.abs(fin - inicio);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return this.diasIncapacidad || 0;
    }

    // Get month from accident date
    get mesAccidente() {
        const months = [
            'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
            'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
        ];
        const date = new Date(this.fechaAccidente);
        return months[date.getMonth()];
    }

    // Check if accident is recent (within last 30 days)
    get esReciente() {
        const now = new Date();
        const accidentDate = new Date(this.fechaAccidente);
        const diffTime = Math.abs(now - accidentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
    }

    // Convert to JSON representation
    toJSON() {
        return {
            id: this.id,
            employeeId: this.employeeId,
            fechaAccidente: this.fechaAccidente,
            lugarAccidente: this.lugarAccidente,
            severidad: this.severidad,
            tipoAccidente: this.tipoAccidente,
            area: this.area,
            cargo: this.cargo,
            turno: this.turno,
            servicioAPrestar: this.servicioAPrestar,
            factorRiesgo: this.factorRiesgo,
            descripcionAccidente: this.descripcionAccidente,
            tipoLesion: this.tipoLesion,
            agenteDelAccidente: this.agenteDelAccidente,
            mecanismoDelAccidente: this.mecanismoDelAccidente,
            parteCuerpoAfectada: this.parteCuerpoAfectada,
            situacionDelAccidente: this.situacionDelAccidente,
            tieneIncapacidad: this.tieneIncapacidad,
            fechaInicioIncapacidad: this.fechaInicioIncapacidad,
            fechaFinIncapacidad: this.fechaFinIncapacidad,
            diasIncapacidad: this.diasIncapacidad,
            duracionIncapacidadCalculada: this.duracionIncapacidadCalculada,
            fechaInvestigacion: this.fechaInvestigacion,
            descripcionInvestigacion: this.descripcionInvestigacion,
            fechaEjecucionAcciones: this.fechaEjecucionAcciones,
            fechaVerificacionAcciones: this.fechaVerificacionAcciones,
            estado: this.estado,
            requiereSeguimiento: this.requiereSeguimiento,
            mesAccidente: this.mesAccidente,
            esReciente: this.esReciente,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Update accident data
    update(data) {
        if (data.fechaAccidente !== undefined) this.fechaAccidente = data.fechaAccidente;
        if (data.lugarAccidente !== undefined) this.lugarAccidente = data.lugarAccidente;
        if (data.severidad !== undefined) this.severidad = data.severidad;
        if (data.tipoAccidente !== undefined) this.tipoAccidente = data.tipoAccidente;
        if (data.area !== undefined) this.area = data.area;
        if (data.cargo !== undefined) this.cargo = data.cargo;
        if (data.turno !== undefined) this.turno = data.turno;
        if (data.servicioAPrestar !== undefined) this.servicioAPrestar = data.servicioAPrestar;
        if (data.factorRiesgo !== undefined) this.factorRiesgo = data.factorRiesgo;
        if (data.descripcionAccidente !== undefined) this.descripcionAccidente = data.descripcionAccidente;
        if (data.tipoLesion !== undefined) this.tipoLesion = data.tipoLesion;
        if (data.agenteDelAccidente !== undefined) this.agenteDelAccidente = data.agenteDelAccidente;
        if (data.mecanismoDelAccidente !== undefined) this.mecanismoDelAccidente = data.mecanismoDelAccidente;
        if (data.parteCuerpoAfectada !== undefined) this.parteCuerpoAfectada = data.parteCuerpoAfectada;
        if (data.situacionDelAccidente !== undefined) this.situacionDelAccidente = data.situacionDelAccidente;
        if (data.tieneIncapacidad !== undefined) this.tieneIncapacidad = data.tieneIncapacidad;
        if (data.fechaInicioIncapacidad !== undefined) this.fechaInicioIncapacidad = data.fechaInicioIncapacidad;
        if (data.fechaFinIncapacidad !== undefined) this.fechaFinIncapacidad = data.fechaFinIncapacidad;
        if (data.diasIncapacidad !== undefined) this.diasIncapacidad = data.diasIncapacidad;
        if (data.fechaInvestigacion !== undefined) this.fechaInvestigacion = data.fechaInvestigacion;
        if (data.descripcionInvestigacion !== undefined) this.descripcionInvestigacion = data.descripcionInvestigacion;
        if (data.fechaEjecucionAcciones !== undefined) this.fechaEjecucionAcciones = data.fechaEjecucionAcciones;
        if (data.fechaVerificacionAcciones !== undefined) this.fechaVerificacionAcciones = data.fechaVerificacionAcciones;
        if (data.estado !== undefined) this.estado = data.estado;
        if (data.requiereSeguimiento !== undefined) this.requiereSeguimiento = data.requiereSeguimiento;
        
        this.updatedAt = new Date();
    }
}

module.exports = Accident;


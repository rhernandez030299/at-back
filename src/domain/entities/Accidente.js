const { v4: uuidv4 } = require('uuid');

class Accidente {
    constructor({
        id,
        empleadoId,
        fechaAccidente,
        lugarAccidente,
        severidad,
        tipoAccidente,
        areaId,
        cargoId,
        turno,
        servicioAPrestar,
        factorRiesgoId,
        descripcionAccidente,
        tipoLesionId,
        agenteDelAccidente,
        mecanismoDelAccidente,
        parteCuerpoAfectadaId,
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
        creadoEn,
        actualizadoEn
    }) {
        this.id = id || uuidv4();
        this.empleadoId = empleadoId;
        this.fechaAccidente = fechaAccidente;
        this.lugarAccidente = lugarAccidente;
        this.severidad = severidad;
        this.tipoAccidente = tipoAccidente;
        this.areaId = areaId;
        this.cargoId = cargoId;
        this.turno = turno;
        this.servicioAPrestar = servicioAPrestar;
        this.factorRiesgoId = factorRiesgoId;
        this.descripcionAccidente = descripcionAccidente;
        this.tipoLesionId = tipoLesionId;
        this.agenteDelAccidente = agenteDelAccidente;
        this.mecanismoDelAccidente = mecanismoDelAccidente;
        this.parteCuerpoAfectadaId = parteCuerpoAfectadaId;
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
        this.requiereSeguimiento = requiereSeguimiento !== false;
        this.creadoEn = creadoEn || new Date();
        this.actualizadoEn = actualizadoEn || new Date();
    }

    // Validation methods
    static validateSeveridad(severidad) {
        const validSeveridades = ['Leve', 'Severo', 'Grave', 'Mortal'];
        return validSeveridades.includes(severidad);
    }

    static validateTipoAccidente(tipoAccidente) {
        const validTipos = ['Propios del trabajo', 'Violencia', 'Tránsito', 'Deportivo', 'Recreativo o cultural'];
        return validTipos.includes(tipoAccidente);
    }

    static validateTurno(turno) {
        const validTurnos = ['Diurno', 'Nocturno'];
        return validTurnos.includes(turno);
    }

    static validateEstado(estado) {
        const validEstados = ['ABIERTO', 'EN_INVESTIGACION', 'CERRADO'];
        return validEstados.includes(estado);
    }

    // Calculate days between dates
    calcularDiasIncapacidad() {
        if (!this.fechaInicioIncapacidad || !this.fechaFinIncapacidad) {
            return 0;
        }
        
        const inicio = new Date(this.fechaInicioIncapacidad);
        const fin = new Date(this.fechaFinIncapacidad);
        const diferencia = fin.getTime() - inicio.getTime();
        return Math.ceil(diferencia / (1000 * 3600 * 24));
    }

    // Get accident severity level
    get nivelSeveridad() {
        const niveles = {
            'Leve': 1,
            'Severo': 2,
            'Grave': 3,
            'Mortal': 4
        };
        return niveles[this.severidad] || 0;
    }

    // Check if accident is recent (within last 30 days)
    get esReciente() {
        const ahora = new Date();
        const fechaAccidente = new Date(this.fechaAccidente);
        const diferenciaDias = (ahora - fechaAccidente) / (1000 * 3600 * 24);
        return diferenciaDias <= 30;
    }

    // Check if investigation is overdue (more than 15 days without investigation)
    get investigacionVencida() {
        if (this.fechaInvestigacion) return false;
        
        const ahora = new Date();
        const fechaAccidente = new Date(this.fechaAccidente);
        const diferenciaDias = (ahora - fechaAccidente) / (1000 * 3600 * 24);
        return diferenciaDias > 15;
    }

    // Convert to JSON representation
    toJSON() {
        const json = {
            id: this.id,
            empleadoId: this.empleadoId,
            empleado: this.empleado ? {
                id: this.empleado.id,
                nombres: this.empleado.nombres,
                apellidos: this.empleado.apellidos,
                numeroDocumento: this.empleado.numeroDocumento,
                nombreCompleto: this.empleado.nombreCompleto
            } : null,
            fechaAccidente: this.fechaAccidente,
            lugarAccidente: this.lugarAccidente,
            severidad: this.severidad,
            nivelSeveridad: this.nivelSeveridad,
            tipoAccidente: this.tipoAccidente,
            areaId: this.areaId,
            area: this.area ? this.area.nombre : null,
            cargoId: this.cargoId,
            cargo: this.cargo ? this.cargo.nombre : null,
            turno: this.turno,
            servicioAPrestar: this.servicioAPrestar,
            factorRiesgoId: this.factorRiesgoId,
            factorRiesgo: this.factorRiesgo ? this.factorRiesgo.nombre : null,
            descripcionAccidente: this.descripcionAccidente,
            tipoLesionId: this.tipoLesionId,
            tipoLesion: this.tipoLesion ? this.tipoLesion.nombre : null,
            agenteDelAccidente: this.agenteDelAccidente,
            mecanismoDelAccidente: this.mecanismoDelAccidente,
            parteCuerpoAfectadaId: this.parteCuerpoAfectadaId,
            parteCuerpoAfectada: this.parteCuerpoAfectada ? this.parteCuerpoAfectada.nombre : null,
            situacionDelAccidente: this.situacionDelAccidente,
            tieneIncapacidad: this.tieneIncapacidad,
            fechaInicioIncapacidad: this.fechaInicioIncapacidad,
            fechaFinIncapacidad: this.fechaFinIncapacidad,
            diasIncapacidad: this.diasIncapacidad,
            diasIncapacidadCalculados: this.calcularDiasIncapacidad(),
            fechaInvestigacion: this.fechaInvestigacion,
            descripcionInvestigacion: this.descripcionInvestigacion,
            fechaEjecucionAcciones: this.fechaEjecucionAcciones,
            fechaVerificacionAcciones: this.fechaVerificacionAcciones,
            estado: this.estado,
            requiereSeguimiento: this.requiereSeguimiento,
            esReciente: this.esReciente,
            investigacionVencida: this.investigacionVencida,
            creadoEn: this.creadoEn,
            actualizadoEn: this.actualizadoEn
        };

        // Include full related entities if available
        if (this.area) json.areaCompleta = this.area;
        if (this.cargo) json.cargoCompleto = this.cargo;
        if (this.factorRiesgo) json.factorRiesgoCompleto = this.factorRiesgo;
        if (this.tipoLesion) json.tipoLesionCompleta = this.tipoLesion;
        if (this.parteCuerpoAfectada) json.parteCuerpoAfectadaCompleta = this.parteCuerpoAfectada;

        return json;
    }

    // Update accident data
    update(data) {
        if (data.fechaAccidente !== undefined) this.fechaAccidente = data.fechaAccidente;
        if (data.lugarAccidente !== undefined) this.lugarAccidente = data.lugarAccidente;
        if (data.severidad !== undefined) this.severidad = data.severidad;
        if (data.tipoAccidente !== undefined) this.tipoAccidente = data.tipoAccidente;
        if (data.areaId !== undefined) this.areaId = data.areaId;
        if (data.cargoId !== undefined) this.cargoId = data.cargoId;
        if (data.turno !== undefined) this.turno = data.turno;
        if (data.servicioAPrestar !== undefined) this.servicioAPrestar = data.servicioAPrestar;
        if (data.factorRiesgoId !== undefined) this.factorRiesgoId = data.factorRiesgoId;
        if (data.descripcionAccidente !== undefined) this.descripcionAccidente = data.descripcionAccidente;
        if (data.tipoLesionId !== undefined) this.tipoLesionId = data.tipoLesionId;
        if (data.agenteDelAccidente !== undefined) this.agenteDelAccidente = data.agenteDelAccidente;
        if (data.mecanismoDelAccidente !== undefined) this.mecanismoDelAccidente = data.mecanismoDelAccidente;
        if (data.parteCuerpoAfectadaId !== undefined) this.parteCuerpoAfectadaId = data.parteCuerpoAfectadaId;
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
        
        this.actualizadoEn = new Date();
    }
}

module.exports = Accidente;

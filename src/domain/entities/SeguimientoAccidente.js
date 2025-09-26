const { v4: uuidv4 } = require('uuid');

class SeguimientoAccidente {
    constructor({
        id = null,
        accidenteId,
        fechaSeguimiento,
        tipoSeguimiento,
        descripcion,
        responsable,
        estadoSalud = null,
        porcentajeRecuperacion = null,
        restriccionesLaborales = null,
        fechaProbableReintegro = null,
        documentosPendientes = null,
        gestionesRealizadas = null,
        proximaAccion = null,
        fechaProximaAccion = null,
        seguimientoCompletado = false,
        observaciones = null,
        creadoEn = null,
        actualizadoEn = null
    }) {
        this.id = id || uuidv4();
        this.accidenteId = accidenteId;
        this.fechaSeguimiento = fechaSeguimiento;
        this.tipoSeguimiento = tipoSeguimiento;
        this.descripcion = descripcion;
        this.responsable = responsable;
        this.estadoSalud = estadoSalud;
        this.porcentajeRecuperacion = porcentajeRecuperacion;
        this.restriccionesLaborales = restriccionesLaborales;
        this.fechaProbableReintegro = fechaProbableReintegro;
        this.documentosPendientes = documentosPendientes;
        this.gestionesRealizadas = gestionesRealizadas;
        this.proximaAccion = proximaAccion;
        this.fechaProximaAccion = fechaProximaAccion;
        this.seguimientoCompletado = seguimientoCompletado;
        this.observaciones = observaciones;
        this.creadoEn = creadoEn;
        this.actualizadoEn = actualizadoEn;

        this.validate();
    }

    validate() {
        if (!this.accidenteId) {
            throw new Error('accidenteId es requerido');
        }

        if (!this.fechaSeguimiento) {
            throw new Error('fechaSeguimiento es requerido');
        }

        if (!this.tipoSeguimiento) {
            throw new Error('tipoSeguimiento es requerido');
        }

        const tiposValidos = ['MEDICO', 'ADMINISTRATIVO', 'LEGAL', 'PREVENTIVO'];
        if (!tiposValidos.includes(this.tipoSeguimiento)) {
            throw new Error(`tipoSeguimiento debe ser uno de: ${tiposValidos.join(', ')}`);
        }

        if (!this.descripcion || this.descripcion.trim().length === 0) {
            throw new Error('descripcion es requerida');
        }

        if (!this.responsable || this.responsable.trim().length === 0) {
            throw new Error('responsable es requerido');
        }

        // Validaciones específicas para seguimiento médico
        if (this.tipoSeguimiento === 'MEDICO') {
            if (this.estadoSalud) {
                const estadosValidos = ['MEJORANDO', 'ESTABLE', 'EMPEORANDO', 'RECUPERADO'];
                if (!estadosValidos.includes(this.estadoSalud)) {
                    throw new Error(`estadoSalud debe ser uno de: ${estadosValidos.join(', ')}`);
                }
            }

            if (this.porcentajeRecuperacion !== null && this.porcentajeRecuperacion !== undefined) {
                if (this.porcentajeRecuperacion < 0 || this.porcentajeRecuperacion > 100) {
                    throw new Error('porcentajeRecuperacion debe estar entre 0 y 100');
                }
            }
        }

        // Validar fechas
        if (this.fechaSeguimiento) {
            const fechaSeguimiento = new Date(this.fechaSeguimiento);
            if (isNaN(fechaSeguimiento.getTime())) {
                throw new Error('fechaSeguimiento debe ser una fecha válida');
            }
        }

        if (this.fechaProbableReintegro) {
            const fechaReintegro = new Date(this.fechaProbableReintegro);
            if (isNaN(fechaReintegro.getTime())) {
                throw new Error('fechaProbableReintegro debe ser una fecha válida');
            }
        }

        if (this.fechaProximaAccion) {
            const fechaProximaAccion = new Date(this.fechaProximaAccion);
            if (isNaN(fechaProximaAccion.getTime())) {
                throw new Error('fechaProximaAccion debe ser una fecha válida');
            }
        }
    }

    update(data) {
        if (data.fechaSeguimiento !== undefined) this.fechaSeguimiento = data.fechaSeguimiento;
        if (data.tipoSeguimiento !== undefined) this.tipoSeguimiento = data.tipoSeguimiento;
        if (data.descripcion !== undefined) this.descripcion = data.descripcion;
        if (data.responsable !== undefined) this.responsable = data.responsable;
        if (data.estadoSalud !== undefined) this.estadoSalud = data.estadoSalud;
        if (data.porcentajeRecuperacion !== undefined) this.porcentajeRecuperacion = data.porcentajeRecuperacion;
        if (data.restriccionesLaborales !== undefined) this.restriccionesLaborales = data.restriccionesLaborales;
        if (data.fechaProbableReintegro !== undefined) this.fechaProbableReintegro = data.fechaProbableReintegro;
        if (data.documentosPendientes !== undefined) this.documentosPendientes = data.documentosPendientes;
        if (data.gestionesRealizadas !== undefined) this.gestionesRealizadas = data.gestionesRealizadas;
        if (data.proximaAccion !== undefined) this.proximaAccion = data.proximaAccion;
        if (data.fechaProximaAccion !== undefined) this.fechaProximaAccion = data.fechaProximaAccion;
        if (data.seguimientoCompletado !== undefined) this.seguimientoCompletado = data.seguimientoCompletado;
        if (data.observaciones !== undefined) this.observaciones = data.observaciones;

        this.validate();
    }

    toJSON() {
        return {
            id: this.id,
            accidenteId: this.accidenteId,
            fechaSeguimiento: this.fechaSeguimiento,
            tipoSeguimiento: this.tipoSeguimiento,
            descripcion: this.descripcion,
            responsable: this.responsable,
            estadoSalud: this.estadoSalud,
            porcentajeRecuperacion: this.porcentajeRecuperacion,
            restriccionesLaborales: this.restriccionesLaborales,
            fechaProbableReintegro: this.fechaProbableReintegro,
            documentosPendientes: this.documentosPendientes,
            gestionesRealizadas: this.gestionesRealizadas,
            proximaAccion: this.proximaAccion,
            fechaProximaAccion: this.fechaProximaAccion,
            seguimientoCompletado: this.seguimientoCompletado,
            observaciones: this.observaciones,
            creadoEn: this.creadoEn,
            actualizadoEn: this.actualizadoEn
        };
    }

    // Métodos de utilidad
    esMedico() {
        return this.tipoSeguimiento === 'MEDICO';
    }

    esAdministrativo() {
        return this.tipoSeguimiento === 'ADMINISTRATIVO';
    }

    esLegal() {
        return this.tipoSeguimiento === 'LEGAL';
    }

    esPreventivo() {
        return this.tipoSeguimiento === 'PREVENTIVO';
    }

    estaCompletado() {
        return this.seguimientoCompletado;
    }

    tieneProximaAccion() {
        return this.proximaAccion && this.fechaProximaAccion;
    }

    estaVencido() {
        if (!this.fechaProximaAccion) return false;
        const hoy = new Date();
        const fechaProxima = new Date(this.fechaProximaAccion);
        return fechaProxima < hoy && !this.seguimientoCompletado;
    }
}

module.exports = SeguimientoAccidente;

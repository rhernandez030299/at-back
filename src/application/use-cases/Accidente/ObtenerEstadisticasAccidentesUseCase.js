const { yearValidationSchema } = require('../../validations/accidenteValidation');

class ObtenerEstadisticasAccidentesUseCase {
    constructor(accidenteRepository) {
        this.accidenteRepository = accidenteRepository;
    }

    async execute(year = new Date().getFullYear()) {
        try {
            // Validate year if provided
            if (year) {
                await yearValidationSchema.validate({ year }, { abortEarly: false });
            }

            // Get statistics in parallel
            const [
                accidentesPorMes,
                accidentesPorSeveridad,
                accidentesPorTipoLesion
            ] = await Promise.all([
                this.accidenteRepository.getAccidentsByMonth(year),
                this.accidenteRepository.getAccidentsBySeverity(),
                this.accidenteRepository.getAccidentsByTipoLesion()
            ]);

            // Get total count for the year
            const totalAccidentesAnio = accidentesPorMes.reduce((sum, mes) => sum + parseInt(mes.total), 0);

            // Calculate monthly averages
            const promedioAccidentesPorMes = totalAccidentesAnio / 12;

            // Find peak month
            const mesPico = accidentesPorMes.reduce((prev, current) => 
                (parseInt(current.total) > parseInt(prev.total)) ? current : prev, 
                accidentesPorMes[0] || { mes: 0, total: 0 }
            );

            return {
                year,
                resumen: {
                    totalAccidentes: totalAccidentesAnio,
                    promedioMensual: Math.round(promedioAccidentesPorMes * 100) / 100,
                    mesPico: {
                        mes: parseInt(mesPico.mes),
                        nombreMes: this._getNombreMes(parseInt(mesPico.mes)),
                        accidentes: parseInt(mesPico.total)
                    }
                },
                accidentesPorMes: accidentesPorMes.map(mes => ({
                    mes: parseInt(mes.mes),
                    nombreMes: this._getNombreMes(parseInt(mes.mes)),
                    total: parseInt(mes.total),
                    conIncapacidad: parseInt(mes.con_incapacidad),
                    promedioDiasIncapacidad: parseFloat(mes.promedio_dias_incapacidad) || 0
                })),
                accidentesPorSeveridad: accidentesPorSeveridad.map(sev => ({
                    severidad: sev.severidad,
                    total: parseInt(sev.total),
                    porcentaje: parseFloat(sev.porcentaje)
                })),
                accidentesPorTipoLesion: accidentesPorTipoLesion.slice(0, 10).map(tipo => ({
                    tipoLesion: tipo.tipo_lesion,
                    gravedad: tipo.gravedad,
                    total: parseInt(tipo.total),
                    porcentaje: parseFloat(tipo.porcentaje)
                }))
            };
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }

    _getNombreMes(numeroMes) {
        const meses = [
            '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[numeroMes] || 'Desconocido';
    }
}

module.exports = ObtenerEstadisticasAccidentesUseCase;

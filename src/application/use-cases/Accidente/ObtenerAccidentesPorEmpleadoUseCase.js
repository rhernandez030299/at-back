const { idValidationSchema } = require('../../validations/empleadoValidation');

class ObtenerAccidentesPorEmpleadoUseCase {
    constructor(accidenteRepository, empleadoRepository) {
        this.accidenteRepository = accidenteRepository;
        this.empleadoRepository = empleadoRepository;
    }

    async execute(empleadoId) {
        try {
            // Validate empleado ID using Yup schema
            await idValidationSchema.validate({ id: empleadoId }, { abortEarly: false });

            // Check if empleado exists
            const empleado = await this.empleadoRepository.findById(empleadoId);
            if (!empleado) {
                throw new Error('Empleado not found');
            }

            // Get all accidentes for this empleado
            const accidentes = await this.accidenteRepository.findByEmpleadoId(empleadoId);

            // Calculate statistics
            const totalAccidentes = accidentes.length;
            const accidentesConIncapacidad = accidentes.filter(a => a.tieneIncapacidad).length;
            const totalDiasIncapacidad = accidentes.reduce((sum, a) => sum + (a.diasIncapacidad || 0), 0);
            
            // Group by severity
            const accidentesPorSeveridad = accidentes.reduce((acc, accidente) => {
                const severidad = accidente.severidad;
                acc[severidad] = (acc[severidad] || 0) + 1;
                return acc;
            }, {});

            // Group by year
            const accidentesPorAnio = accidentes.reduce((acc, accidente) => {
                const year = new Date(accidente.fechaAccidente).getFullYear();
                acc[year] = (acc[year] || 0) + 1;
                return acc;
            }, {});

            // Recent accidents (last 30 days)
            const accidentesRecientes = accidentes.filter(a => a.esReciente);

            return {
                empleado: empleado.toJSON(),
                accidentes: accidentes.map(accidente => accidente.toJSON()),
                estadisticas: {
                    totalAccidentes,
                    accidentesConIncapacidad,
                    totalDiasIncapacidad,
                    promedioIncapacidadPorAccidente: totalAccidentes > 0 ? 
                        Math.round(totalDiasIncapacidad / totalAccidentes * 100) / 100 : 0,
                    accidentesPorSeveridad,
                    accidentesPorAnio,
                    accidentesRecientes: accidentesRecientes.length,
                    investigacionesPendientes: accidentes.filter(a => a.investigacionVencida).length
                }
            };
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = ObtenerAccidentesPorEmpleadoUseCase;

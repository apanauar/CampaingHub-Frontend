import { useSelector } from "react-redux"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js"
import { Bar } from "react-chartjs-2"
import { ESTADOS } from "../validators/campania.validators"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const COLORES = {
    borrador: "#9ca3af",
    activa: "#059669",
    pausada: "#d97706",
    finalizada: "#1f2937"
};

const Grafica = () => {

    const campanias = useSelector(state => state.campanias.lista)

    const cantidades = ESTADOS.map(estado => campanias.filter(c => c.estado === estado).length);

    const data = {
        labels: ESTADOS,
        datasets: [{
            label: "Campañas",
            data: cantidades,
            backgroundColor: ESTADOS.map(estado => COLORES[estado]),
            borderRadius: 6
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    };

    return (
        <div className="card">
            <h2><i className="fas fa-chart-column"></i> Campañas por estado</h2>
            {campanias.length === 0 ?
                <p className="vacio">Todavía no hay campañas para graficar.</p> :
                <div className="chart-container">
                    <Bar data={data} options={options} />
                </div>
            }
        </div>
    )
}

export default Grafica
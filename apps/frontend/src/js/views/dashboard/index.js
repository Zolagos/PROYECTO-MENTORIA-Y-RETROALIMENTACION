import "./dashboard.css"; 
import { getUser } from "../../../utils/storage.js";
import dashboardMock from "../../mocks/dashboard.mock.js";
import { registerDashboardEvents } from "./dashboard.events.js";

export function renderDashboard() {
    const app = document.getElementById("app");
    const user = getUser();

    // Criterio de aceptación 3: Validación estricta de Rol (Team Leader único)
    if (!user || user.role !== 'Team Leader') {
        app.innerHTML = `
            <div class="dashboard-denied">
                <div class="denied-card">
                    <span class="lock-icon">🔒</span>
                    <h2>Acceso Denegado</h2>
                    <p>Métricas operativas sensibles. Módulo exclusivo para usuarios con el rol de <strong>Team Leader</strong>.</p>
                </div>
            </div>
        `;
        return;
    }

    const { globalMetrics, sessionsVolumeReport, tutorPerformanceReport } = dashboardMock;

    // Generamos las filas de la tabla con los números de tus tutores
    let tableRows = "";
    tutorPerformanceReport.forEach((tutor) => {
        const statusClass = tutor.averageRating >= 4.5 ? "excellent" : "review";
        const statusText = tutor.averageRating >= 4.5 ? "Sobresaliente" : "Bajo Observación";
        
        tableRows += `
            <tr>
                <td><strong style="text-transform: capitalize;">${tutor.name}</strong></td>
                <td><strong>${tutor.sessionsCount}</strong> sesiones</td>
                <td><strong>${tutor.totalHours}</strong> horas</td>
                <td><span class="rating-badge">⭐ ${tutor.averageRating.toFixed(1)}</span></td>
                <td><span class="status-pill ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });

    app.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-top-bar">
                <div>
                    <h1>Panel Ejecutivo de Mentorías</h1>
                    <p class="subtitle">Sesión activa del Líder: <strong>${user.email}</strong></p>
                </div>
                <button id="logout-btn" class="logout-btn-dash">Cerrar sesión</button>
            </header>

            <!-- KPIs de Tasas Porcentuales -->
            <section class="kpi-section">
                <div class="kpi-metric-card">
                    <h4>Nuevos Solicitantes</h4>
                    <p class="kpi-num">${globalMetrics.codersRequestingLastWeek}</p>
                    <span class="kpi-desc">Coders activos esta última semana</span>
                </div>
                <div class="kpi-metric-card">
                    <h4>Tasa de Finalización</h4>
                    <p class="kpi-num text-success">${globalMetrics.completionRate}%</p>
                    <span class="kpi-desc">Sesiones cerradas con éxito</span>
                </div>
                <div class="kpi-metric-card">
                    <h4>Tasa de Pendientes</h4>
                    <p class="kpi-num text-warning">${globalMetrics.pendingRate}%</p>
                    <span class="kpi-desc">Sesiones agendadas o en curso</span>
                </div>
                <div class="kpi-metric-card">
                    <h4>Tasa de Cancelación</h4>
                    <p class="kpi-num text-danger">${globalMetrics.cancellationRate}%</p>
                    <span class="kpi-desc">Sesiones canceladas/no asistidas</span>
                </div>
            </section>

            <!-- Tableros con Números Absolutos de Volumen -->
            <section class="dashboard-layout-grid">
                
                <div class="panel-card text-center-panel">
                    <h3>📊 Resumen de Flujo Absoluto</h3>
                    <div class="volume-big-badge">
                        <span class="volume-total-label">Total Procesado</span>
                        <p class="volume-total-num">${sessionsVolumeReport.totalSessionsCount}</p>
                        <span class="volume-total-sub">Sesiones registradas en el sistema</span>
                    </div>
                </div>

                <div class="panel-card">
                    <h3>📌 Distribución Física por Estados</h3>
                    <div class="numbers-list-panel">
                        <div class="number-item-row">
                            <span class="indicator-dot dot-success"></span>
                            <span class="item-name-label">Mentorías Completadas</span>
                            <span class="item-value-badge badge-success">${sessionsVolumeReport.completedCount}</span>
                        </div>
                        <div class="number-item-row">
                            <span class="indicator-dot dot-warning"></span>
                            <span class="item-name-label">Mentorías Agendadas / En Curso</span>
                            <span class="item-value-badge badge-warning">${sessionsVolumeReport.pendingCount}</span>
                        </div>
                        <div class="number-item-row">
                            <span class="indicator-dot dot-danger"></span>
                            <span class="item-name-label">Mentorías Canceladas</span>
                            <span class="item-value-badge badge-danger">${sessionsVolumeReport.cancelledCount}</span>
                        </div>
                    </div>
                </div>

                <!-- Tabla de Rendimiento General (Métricas 3, 4 y 6) -->
                <div class="panel-card full-width-panel">
                    <h3>🏆 Rendimiento Operativo y Satisfacción Acumulada</h3>
                    <table class="metrics-table">
                        <thead>
                            <tr>
                                <th>Nombre del Tutor</th>
                                <th>Tutorías Hechas</th>
                                <th>Tiempo Total Dedicado</th>
                                <th>Satisfacción Promedio</th>
                                <th>Estatus Pedagógico</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>

            </section>
        </div>
    `;

    // Inicializamos las interacciones básicas del DOM
    registerDashboardEvents();
}
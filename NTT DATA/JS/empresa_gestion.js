// --- 1. CONFIGURACIÓN DE RUTAS ---
const API_URL = '../../PHP/obtener_trabajadores.php'; 
const TAREAS_URL = '../../PHP/tareas_logic.php';
const PERMISOS_URL = '../../PHP/permisos_logic.php';

// Estado global
const urlParams = new URLSearchParams(window.location.search);
const trabajadorId = urlParams.get('id') || localStorage.getItem('trabajador_detalle_id'); 

let permisoActual = 1;

// --- 2. GESTIÓN DE LA LISTA (Vista General) ---
async function cargarListaTrabajadores() {
    const container = document.getElementById('listaContactos');
    if (!container) return;

    try {
        const res = await fetch(API_URL);
        const workers = await res.json();

        if (!workers || workers.length === 0) {
            container.innerHTML = '<p class="empty-msg">No hay trabajadores registrados.</p>';
            return;
        }

        container.innerHTML = workers.map(w => `
            <div class="worker-card">
                <div class="worker-info">
                    <div class="status-badge">Activo</div>
                    <small style="color: #666;">${w.nombre}</small>
                    <h4 style="margin: 5px 0;">${w.nombre_completo || 'Sin nombre'}</h4>
                    <p style="color: #007bff; font-size: 0.85rem; font-weight: 600; margin-bottom: 5px;">
                        🏢 ${w.empresa || 'General'}
                    </p>
                    <small style="opacity: 0.6;">ID: ${w.id}</small>
                </div>
                <div class="worker-actions" style="margin-top: 10px;">
                    <button class="btn-consultar" onclick="seleccionarTrabajador(${w.id})" style="width: 100%;">
                        📊 Gestionar
                    </button>
                </div>
            </div>`).join('');
    } catch (e) { 
        console.error("Error cargando lista:", e); 
        container.innerHTML = '<p>Error al conectar con el servidor.</p>';
    }
}

// Función para seleccionar y navegar
window.seleccionarTrabajador = function(id) {
    localStorage.setItem('trabajador_detalle_id', id);
    window.location.href = `detalle.html?id=${id}`; 
};

// --- 3. LÓGICA DE PERMISOS ---
async function cargarEstadoPermiso() {
    if (!trabajadorId) return;
    try {
        const res = await fetch(`${PERMISOS_URL}?id=${trabajadorId}`);
        const user = await res.json();
        
        // Mostrar la vista de tareas si hay un ID
        document.getElementById('sec-trabajadores').style.display = 'none';
        document.getElementById('vistaTareas').style.display = 'block';

        const titleElem = document.getElementById('userNameTitle');
        if (titleElem) titleElem.innerText = `Gestión: ${user.nombre_completo || user.nombre}`;
        
        permisoActual = user.permiso_crear;
        actualizarInterfazPermiso();
    } catch (e) { console.error("Error permisos:", e); }
}

async function toggleUserPermission() {
    if(!trabajadorId) return;
    const nuevoEstado = permisoActual == 1 ? 0 : 1;
    if(!confirm("¿Cambiar permisos para este usuario?")) return;

    try {
        const res = await fetch(PERMISOS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: trabajadorId, permiso: nuevoEstado })
        });
        const data = await res.json();
        if (data.success) {
            permisoActual = nuevoEstado;
            actualizarInterfazPermiso();
        }
    } catch (e) { console.error("Error al cambiar permiso:", e); }
}

function actualizarInterfazPermiso() {
    const btn = document.getElementById('btnLock');
    if (!btn) return;
    btn.innerHTML = permisoActual == 1 ? `🔒 Bloquear Creación` : `🔓 Habilitar Creación`;
    btn.className = permisoActual == 1 ? "btn-danger" : "btn-success"; // Clases de tu CSS
    btn.style.background = permisoActual == 1 ? "#e74c3c" : "#2ecc71";
}

// --- 4. LÓGICA DE TAREAS ---
async function cargarTareas() {
    const container = document.getElementById('activeTasksContainer');
    if (!container || !trabajadorId) return;

    try {
        const res = await fetch(`${TAREAS_URL}?usuario_id=${trabajadorId}`);
        const tareas = await res.json();
        
        if (!Array.isArray(tareas) || tareas.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:gray; padding:20px;">Sin tareas asignadas.</p>`;
            return;
        }

        container.innerHTML = tareas.map(t => `
            <div class="task-card" style="border-left: 5px solid #007bff; margin-bottom:10px; padding:15px; background:#fff; border-radius:8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin:0;">${t.name}</h4>
                    <span class="badge" style="font-size: 0.7rem; background: #eee; padding: 2px 6px; border-radius: 4px;">${t.status}</span>
                </div>
                <button onclick="eliminarTarea(${t.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size: 1.2rem;">
                    🗑️
                </button>
            </div>`).join('');
    } catch (e) { console.error("Error cargando tareas:", e); }
}

async function eliminarTarea(id) {
    if(!confirm("¿Eliminar esta tarea?")) return;
    try {
        const res = await fetch(TAREAS_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const data = await res.json();
        if (data.success) cargarTareas();
    } catch (e) { console.error("Error al eliminar:", e); }
}

// --- 5. INTERFAZ Y TEMA ---
function toggleMenu(event) {
    if (event) event.stopPropagation();
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    actualizarInterfazTema(isDark);
}

function actualizarInterfazTema(isDark) {
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    if (icon) icon.innerText = isDark ? '☀️' : '🌙';
    if (text) text.innerText = isDark ? 'Modo Claro' : 'Modo Oscuro';
}

// --- 6. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        actualizarInterfazTema(true);
    }

    // Si hay ID en la URL, mostramos la vista de gestión individual
    if (trabajadorId && urlParams.has('id')) {
        cargarEstadoPermiso();
        cargarTareas();
    } else {
        // Si no, cargamos la lista de personal
        cargarListaTrabajadores();
    }

    window.toggleMenu = toggleMenu;
    window.toggleTheme = toggleTheme;
    window.seleccionarTrabajador = seleccionarTrabajador;
    window.toggleUserPermission = toggleUserPermission;
    window.eliminarTarea = eliminarTarea;
});
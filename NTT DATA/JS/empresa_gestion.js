// --- 1. CONFIGURACIÓN DE RUTAS ---
const API_URL = '../../PHP/obtener_trabajadores.php'; 
const TAREAS_URL = '../../PHP/tareas_logic.php';
const PERMISOS_URL = '../../PHP/permisos_logic.php';

// Estado global
const urlParams = new URLSearchParams(window.location.search);
// Prioridad: 1. URL (?id=), 2. LocalStorage
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
            container.innerHTML = '<p class="empty-msg">No hay trabajadores asignados.</p>';
            return;
        }

        container.innerHTML = workers.map(w => `
            <div class="worker-card">
                <div class="worker-info">
                    <div class="status-badge">Disponible</div>
                    <h4>${w.nombre}</h4>
                    <small>ID: ${w.id}</small>
                </div>
                <div class="worker-actions">
                    <button class="btn-consultar" onclick="seleccionarTrabajador(${w.id})">📊 Ver Gestión</button>
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
    // Forzamos que la URL tenga el ID para evitar conflictos de caché
    window.location.href = `detalle_trabajador.html?id=${id}`; 
};

// --- 3. LÓGICA DE PERMISOS (Bloqueo) ---
async function cargarEstadoPermiso() {
    if (!trabajadorId) return;
    try {
        const res = await fetch(`${PERMISOS_URL}?id=${trabajadorId}`);
        const user = await res.json();
        
        const titleElem = document.getElementById('userNameTitle');
        if (titleElem && user.nombre) titleElem.innerText = `Gestión: ${user.nombre}`;
        
        permisoActual = user.permiso_crear;
        actualizarInterfazPermiso();
    } catch (e) { console.error("Error permisos:", e); }
}

async function toggleUserPermission() {
    if(!trabajadorId) return;
    const nuevoEstado = permisoActual == 1 ? 0 : 1;
    if(!confirm("¿Cambiar permisos de creación para este usuario?")) return;

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
    btn.innerHTML = permisoActual == 1 ? `<span>🔒</span> Bloquear` : `<span>🔓</span> Habilitar`;
    btn.style.background = permisoActual == 1 ? "#e74c3c" : "#2ecc71";
}

// --- 4. LÓGICA DE TAREAS (Kanban) ---
async function cargarTareas() {
    const container = document.getElementById('activeTasksContainer');
    if (!container || !trabajadorId) return;

    try {
        const res = await fetch(`${TAREAS_URL}?usuario_id=${trabajadorId}`);
        const tareas = await res.json();
        
        if (!Array.isArray(tareas) || tareas.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:gray; padding:20px;">Sin tareas pendientes.</p>`;
            return;
        }

        container.innerHTML = tareas.map(t => {
            const enCurso = t.status === 'En curso';
            return `
            <div class="task-card" style="border-left: 5px solid ${enCurso ? '#2ecc71' : '#f1c40f'}; margin-bottom:10px; padding:10px; background:var(--bg-card, #fff); border-radius:8px;">
                <h4 style="margin:0;">${t.name}</h4>
                <p style="font-size:0.9rem; color:gray;">${t.descripcion || ''}</p>
                <button onclick="eliminarTarea(${t.id})" class="btn-delete" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
                    🗑️ Borrar
                </button>
            </div>`;
        }).join('');
    } catch (e) { console.error("Error cargando tareas:", e); }
}

async function eliminarTarea(id) {
    if(!confirm("¿Eliminar esta tarea permanentemente?")) return;
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
    // Aplicar tema guardado
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        actualizarInterfazTema(true);
    }

    // Lógica de carga según la página
    // Si estamos en la página de detalle (id en URL o local)
    if (trabajadorId && (window.location.pathname.includes('detalle') || urlParams.has('id'))) {
        cargarEstadoPermiso();
        cargarTareas();
    } 
    
    // Si el contenedor de lista existe, cargamos siempre los trabajadores
    if (document.getElementById('listaContactos')) {
        cargarListaTrabajadores();
    }

    // Exportar funciones a window para que funcionen los onclick del HTML
    window.toggleMenu = toggleMenu;
    window.toggleTheme = toggleTheme;
    window.seleccionarTrabajador = seleccionarTrabajador;
    window.toggleUserPermission = toggleUserPermission;
    window.eliminarTarea = eliminarTarea;
});
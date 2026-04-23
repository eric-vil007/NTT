// --- 1. CONFIGURACIÓN DE RUTAS ---
const API_URL = '../../PHP/obtener_trabajadores.php'; 
const TAREAS_URL = '../../PHP/tareas_logic.php';
const PERMISOS_URL = '../../PHP/permisos_logic.php';

const urlParams = new URLSearchParams(window.location.search);
const trabajadorId = urlParams.get('id') || localStorage.getItem('trabajador_detalle_id'); 

let permisoActual = 1;

// --- 2. GESTIÓN DE LA LISTA ---
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
    }
}

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
    btn.style.background = permisoActual == 1 ? "#e74c3c" : "#2ecc71";
}

// --- 4. LÓGICA DE TAREAS Y MODAL ---

window.openModal = function() {
    document.getElementById('taskModal').style.display = 'flex';
};

window.closeModal = function() {
    document.getElementById('taskModal').style.display = 'none';
    document.getElementById('taskInput').value = '';
    document.getElementById('taskDescInput').value = '';
};

window.createTask = async function() {
    const nombre = document.getElementById('taskInput').value.trim();
    const descripcion = document.getElementById('taskDescInput').value.trim();

    if (!nombre || !descripcion) {
        alert("Rellena todos los campos");
        return;
    }

    try {
        const res = await fetch(TAREAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nombre, descripcion: descripcion, usuario_id: trabajadorId })
        });
        const data = await res.json();
        if (data.success) {
            closeModal();
            cargarTareas();
        }
    } catch (e) { console.error("Error:", e); }
};

// Cargar Tareas (Solo pendientes)
async function cargarTareas() {
    const container = document.getElementById('activeTasksContainer');
    if (!container || !trabajadorId) return;

    try {
        // QUITAMOS "&rol=tutor" para que el PHP solo devuelva las pendientes (is_completed = 0)
        const res = await fetch(`${TAREAS_URL}?usuario_id=${trabajadorId}`);
        const tareas = await res.json();
        
        if (!Array.isArray(tareas) || tareas.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:gray; padding:20px;">Sin tareas asignadas.</p>`;
            return;
        }

        container.innerHTML = tareas.map(t => `
            <div class="task-card" style="
                border-left: 5px solid #007bff; 
                margin-bottom: 12px; 
                padding: 15px; 
                background: var(--bg-card, #fff); 
                border-radius: 12px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
                gap: 15px;
                overflow: hidden; /* Evita que el contenido rompa la tarjeta */
            ">
                <div style="flex: 1; min-width: 0;"> <h4 style="
                        margin: 0; 
                        color: var(--text-color, #333); 
                        word-wrap: break-word; 
                        overflow-wrap: break-word;
                    ">${t.name}</h4>
                    <p style="
                        margin: 5px 0; 
                        font-size: 0.9rem; 
                        color: #666; 
                        word-wrap: break-word; 
                        overflow-wrap: break-word;
                    ">${t.descripcion || ''}</p>
                    <span class="badge" style="font-size: 0.7rem; background: #eee; padding: 2px 8px; border-radius: 20px; color: #555;">
                        ${t.status}
                    </span>
                </div>
                <button onclick="eliminarTarea(${t.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size: 1.2rem; flex-shrink: 0;">
                    🗑️
                </button>
            </div>`).join('');
    } catch (e) { console.error("Error cargando tareas:", e); }
}

window.eliminarTarea = async function(id) {
    if(!confirm("¿Eliminar esta tarea?")) return;
    try {
        const res = await fetch(TAREAS_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const data = await res.json();
        if (data.success) cargarTareas();
    } catch (e) { console.error("Error:", e); }
};

// --- 5. TEMA Y MENÚ ---
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

    if (trabajadorId && urlParams.has('id')) {
        cargarEstadoPermiso();
        cargarTareas();
    } else {
        cargarListaTrabajadores();
    }

    window.toggleMenu = toggleMenu;
    window.toggleTheme = toggleTheme;
});
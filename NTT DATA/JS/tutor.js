// --- 1. CONFIGURACIÓN DE RUTAS ---
const API_URL = '../../PHP/inicio_trab.php';
const CHAT_URL = '../../PHP/chat_logic_tutor.php';

// --- 2. FUNCIONES DE APOYO ---
function obtenerMiId() {
    return Number(localStorage.getItem('usuario_id')) || 5;
}

function formatearHora(fechaEnvio) {
    if (!fechaEnvio) return '--:--';
    try {
        return fechaEnvio.split(' ')[1].substring(0, 5);
    } catch (e) { return '--:--'; }
}

// --- 3. GESTIÓN DE TRABAJADORES ---
async function cargarListaContactos() {
    const container = document.getElementById('listaContactos');
    if (!container) return;

    try {
        const res = await fetch(`${API_URL}?action=get_workers`);
        const workers = await res.json();

        if (!workers || workers.length === 0) {
            container.innerHTML = '<p class="empty-msg">No hay trabajadores asignados.</p>';
            return;
        }

        const esPaginaInicio = window.location.pathname.includes('inicio.html');

        container.innerHTML = workers.map(w => {
            const nombreEscapado = w.nombre.replace(/'/g, "\\'");
            
            // Si es inicio.html -> Redirige a Detalle
            // Si es chat_usuarios.html -> Redirige al Chat
            const botonHtml = esPaginaInicio
                ? `<button class="btn-consultar" onclick="irADetalleTrabajador(${w.id})">📊 Ver Detalle</button>`
                : `<button class="btn-primary" onclick="irAlChat(event, ${w.id}, '${nombreEscapado}')">💬 Chatear</button>`;

            return `
                <div class="worker-card">
                    <div class="worker-info">
                        <div class="status-badge">Disponible</div>
                        <h4>${w.nombre}</h4>
                        <small>ID: ${w.id}</small>
                    </div>
                    <div class="worker-actions">${botonHtml}</div>
                </div>`;
        }).join('');
    } catch (e) { console.error("Error cargando contactos:", e); }
}

// --- 4. REDIRECCIÓN A DETALLE ---
function irADetalleTrabajador(id) {
    // Es vital que el nombre de la llave coincida: 'trabajador_detalle_id'
    localStorage.setItem('trabajador_detalle_id', id);
    window.location.assign('detalle_trabajador.html');
}

// --- 5. LÓGICA DEL CHAT ---
window.irAlChat = function(event, id, nombre) {
    if (event) event.preventDefault();
    localStorage.setItem('receptor_id', id);
    localStorage.setItem('receptor_nombre', nombre);
    window.location.assign('chat.html');
};

async function cargarMensajes() {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;
    const trabajadorId = localStorage.getItem('receptor_id');
    if (!trabajadorId) return;

    try {
        const res = await fetch(`${CHAT_URL}?trabajador_id=${trabajadorId}&t=${Date.now()}`);
        const mensajes = await res.json();
        const miId = obtenerMiId();
        
        chatBox.innerHTML = mensajes.map(m => {
            const esMio = Number(m.emisor_id) === miId;
            return `
                <div class="message-container ${esMio ? 'tutor-msg' : 'worker-msg'}" 
                     style="display: flex; justify-content: ${esMio ? 'flex-end' : 'flex-start'}; margin-bottom: 12px; padding: 0 10px;">
                    
                    <div class="msg-bubble" style="
                        max-width: 75%; 
                        padding: 10px 15px; 
                        border-radius: 15px;
                        background: ${esMio ? '#007bff' : '#e9e9eb'};
                        color: ${esMio ? '#fff' : '#000'};
                        
                        /* ALINEACIÓN: Siempre a la izquierda dentro del globo */
                        text-align: left; 
                        
                        /* AJUSTE DE TEXTO LARGO */
                        word-break: break-word; 
                        overflow-wrap: anywhere; 
                        white-space: normal;
                        min-width: 60px;
                    ">
                        <p style="margin: 0; line-height: 1.4; display: block;">${m.mensaje}</p>
                        <span class="msg-time" style="
                            display: block; 
                            font-size: 0.7rem; 
                            margin-top: 5px; 
                            opacity: 0.7; 
                            text-align: right; /* La hora sí queda bien a la derecha */
                        ">${formatearHora(m.fecha_envio)}</span>
                    </div>
                </div>`;
        }).join('');
        
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (e) { console.error("Error chat:", e); }
}

async function enviarMensaje(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('messageInput');
    if (!input || !input.value.trim()) return;

    try {
        const response = await fetch(CHAT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emisor_id: obtenerMiId(),
                receptor_id: Number(localStorage.getItem('receptor_id')),
                mensaje: input.value.trim()
            })
        });
        const result = await response.json();
        if (result.success) {
            input.value = '';
            cargarMensajes();
        }
    } catch (e) { console.error("Error envio:", e); }
}

// --- 6. INTERFAZ Y TEMA ---
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

// --- 7. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar tema
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        actualizarInterfazTema(true);
    }

    // Cerrar menú al clicar fuera
    document.addEventListener('click', (event) => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Cargar lista si existe el contenedor
    if (document.getElementById('listaContactos')) cargarListaContactos();

    // Inicializar chat si existe el formulario
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        const receptorNombre = localStorage.getItem('receptor_nombre');
        const header = document.querySelector('.top-bar h2') || document.getElementById('chatHeader');
        if (header && receptorNombre) header.innerText = `Chat con ${receptorNombre}`;
        
        chatForm.addEventListener('submit', enviarMensaje);
        cargarMensajes();
        setInterval(cargarMensajes, 3000); // Polling cada 3 segundos
    }

    // Exportar funciones globales
    window.toggleMenu = toggleMenu;
    window.toggleTheme = toggleTheme;
    window.irADetalleTrabajador = irADetalleTrabajador;
});
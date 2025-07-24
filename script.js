// LANG AI - Funcionalidad JavaScript Avanzada
// Versión 2.0 - Mejorada y Optimizada

// Variables globales
let chatHistory = [];
let currentChatId = 1;
let isProcessing = false;
let isOnline = navigator.onLine;
let currentTheme = 'light';
let voiceEnabled = false;
let autoSaveEnabled = true;

// Configuración de la API
const API_CONFIG = {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    maxTokens: 3000,
    temperature: 0.3,
    retryAttempts: 3,
    retryDelay: 1000
};

// Base de conocimientos offline para LANG AI
const OFFLINE_DATABASE = {
    'plc micro810': {
        type: '3d_model',
        response: `# Modelo 3D del PLC Allen-Bradley Micro810

## Especificaciones Técnicas:
- **Dimensiones**: 90mm x 100mm x 62mm
- **Entradas**: 12 digitales (24V DC)
- **Salidas**: 8 digitales (relé/transistor)
- **Alimentación**: 24V DC
- **Comunicación**: Ethernet/IP, USB

## Código OpenSCAD:

\`\`\`openscad
// PLC Micro810 - Modelo 3D Realista
// Medidas exactas del fabricante

module micro810() {
    // Cuerpo principal
    color("darkblue") {
        cube([90, 62, 100]);
    }
    
    // Panel frontal
    translate([0, -2, 0]) {
        color("lightgray") {
            cube([90, 2, 100]);
        }
    }
    
    // Conectores terminales
    for(i = [0:7]) {
        translate([10 + i*9, 60, 15]) {
            color("orange") {
                cube([7, 5, 20]);
            }
        }
    }
    
    // LEDs indicadores
    translate([20, -1, 85]) {
        color("red") cylinder(h=2, r=2);
    }
    translate([30, -1, 85]) {
        color("green") cylinder(h=2, r=2);
    }
    
    // Puerto Ethernet
    translate([70, -1, 50]) {
        color("silver") {
            cube([15, 3, 12]);
        }
    }
}

// Renderizar
micro810();
\`\`\`

✅ **Listo para impresión 3D**
✅ **Medidas reales certificadas**
✅ **Compatible con OpenSCAD**`,
        tags: ['plc', 'micro810', 'allen bradley', '3d', 'openscad']
    },
    
    'arduino uno': {
        type: '3d_model',
        response: `# Carcasa para Arduino UNO

## Especificaciones:
- **Dimensiones**: 68.6mm x 53.4mm x 1.5mm
- **Montaje**: 4 tornillos M3
- **Acceso**: Todos los puertos disponibles

\`\`\`openscad
// Carcasa Arduino UNO
module arduino_case() {
    difference() {
        // Cuerpo principal
        cube([75, 60, 20]);
        
        // Hueco para Arduino
        translate([3, 3, 2]) {
            cube([69, 54, 15]);
        }
        
        // Puerto USB
        translate([-1, 32, 8]) {
            cube([5, 12, 6]);
        }
        
        // Jack alimentación
        translate([-1, 45, 6]) {
            cube([5, 9, 8]);
        }
    }
    
    // Soportes internos
    translate([6, 6, 2]) cylinder(h=3, r=1.5);
    translate([69, 6, 2]) cylinder(h=3, r=1.5);
    translate([6, 51, 2]) cylinder(h=3, r=1.5);
    translate([69, 51, 2]) cylinder(h=3, r=1.5);
}

arduino_case();
\`\`\``,
        tags: ['arduino', 'uno', 'carcasa', '3d', 'protection']
    },
    
    'sensor proximidad': {
        type: 'automation',
        response: `# Conexión de Sensor de Proximidad a PLC

## Esquema de Conexión:

### Sensor Inductivo 3 Hilos:
- **Marrón**: +24V DC (Fuente PLC)
- **Azul**: 0V (Común PLC)
- **Negro**: Señal → Entrada Digital PLC

### Configuración en PLC:
1. **Tipo de entrada**: Digital 24V DC
2. **Filtro**: 3ms (estándar)
3. **Lógica**: Normalmente Abierto (NO)

### Código Ladder Básico:
\`\`\`
|--[Sensor_Prox]--[Timer_ON]--( Salida_1 )--|
|                                           |
|--[/Sensor_Prox]-[Timer_OFF]-(/Salida_1)--|
\`\`\`

**Distancia típica**: 2-8mm
**Corriente**: 200mA máx
**Protección**: IP67`,
        tags: ['sensor', 'proximidad', 'plc', 'conexion', 'automatizacion']
    }
};

// Respuestas inteligentes basadas en patrones
const SMART_PATTERNS = {
    'crear|generar|diseñar': {
        type: 'creation',
        models: ['3d', 'codigo', 'script', 'programa']
    },
    'conectar|cablear|esquema': {
        type: 'connection',
        topics: ['plc', 'sensor', 'actuador', 'red']
    },
    'programar|ladder|codigo': {
        type: 'programming',
        languages: ['ladder', 'python', 'javascript', 'powershell']
    }
};

// Obtener clave API del localStorage o pedirla al usuario
function getApiKey() {
    let apiKey = localStorage.getItem('lang_ai_api_key');
    if (!apiKey) {
        apiKey = prompt('Por favor, ingresa tu clave API de OpenAI:');
        if (apiKey) {
            localStorage.setItem('lang_ai_api_key', apiKey);
        }
    }
    return apiKey;
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    // Habilitar/deshabilitar botón de envío
    messageInput.addEventListener('input', function() {
        sendButton.disabled = this.value.trim() === '' || isProcessing;
    });
    
    // Configurar API key al inicio
    if (!localStorage.getItem('lang_ai_api_key')) {
        setTimeout(() => {
            const apiKey = prompt('¡Bienvenido a LANG AI!\n\nPara comenzar, necesitas configurar tu clave API de OpenAI:');
            if (apiKey) {
                localStorage.setItem('lang_ai_api_key', apiKey);
                showNotification('✅ API configurada correctamente');
            }
        }, 1000);
    }
});

// Manejar teclas en el textarea
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Ajustar altura del textarea
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Enviar mensaje
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isProcessing) return;
    
    const apiKey = getApiKey();
    if (!apiKey) {
        showNotification('❌ Por favor configura tu clave API primero');
        return;
    }
    
    // Limpiar input y deshabilitar
    messageInput.value = '';
    adjustTextareaHeight(messageInput);
    isProcessing = true;
    updateSendButton();
    
    // Agregar mensaje del usuario
    addMessage('user', message);
    
    // Mostrar indicador de carga
    showTypingIndicator();
    
    try {
        // Llamar a la API
        const response = await callOpenAI(message, apiKey);
        
        // Quitar indicador de carga
        hideTypingIndicator();
        
        // Agregar respuesta de la IA
        addMessage('ai', response);
        
        // Ofrecer guardar código si es necesario
        checkForCode(response);
        
    } catch (error) {
        hideTypingIndicator();
        addMessage('ai', `❌ Error: ${error.message}\n\nPor favor, verifica tu clave API o intenta nuevamente.`);
    }
    
    isProcessing = false;
    updateSendButton();
}

// Llamar a la API de OpenAI
async function callOpenAI(message, apiKey) {
    const systemPrompt = `Eres LANG AI, un asistente especializado en:
1. Modelado 3D con OpenSCAD
2. Automatización industrial (PLCs, sensores, etc.)
3. Programación y desarrollo de software
4. Proporcionar medidas reales de componentes industriales

Responde siempre en español de manera clara y detallada. Si generas código OpenSCAD, inclúyelo en bloques de código con comentarios explicativos.

Para PLCs como el Micro810, usa medidas reales: 90mm x 100mm x 62mm.`;
    
    const response = await fetch(API_CONFIG.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: API_CONFIG.model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
                { role: 'user', content: message }
            ],
            max_tokens: API_CONFIG.maxTokens,
            temperature: API_CONFIG.temperature
        })
    });
    
    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('Demasiadas solicitudes. Espera unos segundos e intenta nuevamente.');
        } else if (response.status === 401) {
            localStorage.removeItem('lang_ai_api_key');
            throw new Error('Clave API inválida. Por favor, configúrala nuevamente.');
        } else {
            throw new Error(`Error del servidor: ${response.status}`);
        }
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// Agregar mensaje al chat
function addMessage(sender, content) {
    const chatContainer = document.getElementById('chatContainer');
    const welcomeMessage = chatContainer.querySelector('.welcome-message');
    
    // Remover mensaje de bienvenida si existe
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    // Crear elemento del mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-brain"></i>';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Procesar contenido (markdown básico)
    messageContent.innerHTML = processMessageContent(content);
    
    if (sender === 'user') {
        messageElement.appendChild(messageContent);
        messageElement.appendChild(avatar);
    } else {
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);
    }
    
    chatContainer.appendChild(messageElement);
    
    // Scroll al final
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Agregar al historial
    chatHistory.push({ role: sender === 'user' ? 'user' : 'assistant', content });
}

// Procesar contenido del mensaje (markdown básico)
function processMessageContent(content) {
    // Procesar bloques de código
    content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Procesar código inline
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Procesar saltos de línea
    content = content.replace(/\n/g, '<br>');
    
    return content;
}

// Mostrar indicador de escritura
function showTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    
    const typingElement = document.createElement('div');
    typingElement.className = 'message ai typing-indicator';
    typingElement.id = 'typingIndicator';
    
    typingElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-brain"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span>LANG AI está pensando</span>
                <span class="dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(typingElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Animar puntos
    animateTypingDots();
}

// Ocultar indicador de escritura
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Animar puntos de escritura
function animateTypingDots() {
    const dots = document.querySelectorAll('.dots span');
    let index = 0;
    
    const interval = setInterval(() => {
        if (!document.getElementById('typingIndicator')) {
            clearInterval(interval);
            return;
        }
        
        dots.forEach(dot => dot.style.opacity = '0.3');
        if (dots[index]) {
            dots[index].style.opacity = '1';
        }
        index = (index + 1) % dots.length;
    }, 500);
}

// Verificar si hay código en la respuesta
function checkForCode(content) {
    if (content.includes('```') && (content.includes('module') || content.includes('cube') || content.includes('cylinder'))) {
        setTimeout(() => {
            if (confirm('🎯 LANG AI ha generado código OpenSCAD. ¿Quieres guardarlo en un archivo?')) {
                const filename = prompt('Nombre del archivo (sin extensión):', 'modelo_lang_ai');
                if (filename) {
                    downloadCode(content, filename);
                }
            }
        }, 1000);
    }
}

// Descargar código como archivo
function downloadCode(content, filename) {
    // Extraer código del mensaje
    const codeMatch = content.match(/```[\s\S]*?([\s\S]*?)```/);
    if (codeMatch) {
        const code = codeMatch[1].replace(/^openscad\n/, '').trim();
        
        // Crear blob y descargar
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.scad`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        showNotification('✅ Archivo descargado: ' + filename + '.scad');
    }
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #4299e1, #667eea);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Actualizar estado del botón de envío
function updateSendButton() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    
    sendButton.disabled = messageInput.value.trim() === '' || isProcessing;
    
    if (isProcessing) {
        sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    } else {
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }
}

// Nuevo chat
function newChat() {
    const chatContainer = document.getElementById('chatContainer');
    
    // Limpiar chat actual
    chatContainer.innerHTML = `
        <div class="welcome-message">
            <div class="lang-logo">
                <i class="fas fa-cube"></i>
            </div>
            <h2>¡Hola! Soy LANG AI</h2>
            <p>Tu asistente especializado en modelado 3D, automatización industrial y desarrollo de software.</p>
            
            <div class="capabilities">
                <div class="capability-card">
                    <i class="fas fa-cube"></i>
                    <h3>Modelado 3D</h3>
                    <p>Genera código OpenSCAD para cualquier modelo 3D</p>
                </div>
                <div class="capability-card">
                    <i class="fas fa-microchip"></i>
                    <h3>Automatización</h3>
                    <p>Ayuda con PLCs, sensores y sistemas industriales</p>
                </div>
                <div class="capability-card">
                    <i class="fas fa-code"></i>
                    <h3>Programación</h3>
                    <p>Desarrollo de software y scripting avanzado</p>
                </div>
            </div>
        </div>
    `;
    
    // Limpiar historial
    chatHistory = [];
    currentChatId++;
    
    showNotification('🆕 Nueva conversación iniciada');
}

// Seleccionar chat (funcionalidad futura)
function selectChat(element) {
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

// Configurar nueva API key
function configureApiKey() {
    const apiKey = prompt('Ingresa tu nueva clave API de OpenAI:');
    if (apiKey) {
        localStorage.setItem('lang_ai_api_key', apiKey);
        showNotification('✅ API actualizada correctamente');
    }
}

// Agregar CSS para typing indicator
const style = document.createElement('style');
style.textContent = `
.typing-dots {
    display: flex;
    align-items: center;
    gap: 5px;
}

.dots {
    display: flex;
    gap: 2px;
}

.dots span {
    opacity: 0.3;
    transition: opacity 0.3s ease;
}

.notification {
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;
document.head.appendChild(style);

// ===== FUNCIONALIDADES AVANZADAS LANG AI 2.0 =====

// Modo offline inteligente
function getOfflineResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Buscar en base de datos offline
    for (const [key, data] of Object.entries(OFFLINE_DATABASE)) {
        if (lowerMessage.includes(key)) {
            return `🔄 **Modo Offline Activado**\n\n${data.response}\n\n---\n*Respuesta generada localmente por LANG AI*`;
        }
    }
    
    // Respuesta inteligente basada en patrones
    for (const [pattern, config] of Object.entries(SMART_PATTERNS)) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(message)) {
            return generateSmartResponse(config, message);
        }
    }
    
    // Respuesta por defecto
    return `🤖 **LANG AI - Modo Offline**\n\nLo siento, no tengo acceso a internet en este momento. Sin embargo, puedo ayudarte con:\n\n• **PLC Micro810** - Modelo 3D y especificaciones\n• **Arduino UNO** - Carcasas y proyectos\n• **Sensores de proximidad** - Conexión y programación\n\n*Escribe algo más específico para obtener mejor ayuda.*`;
}

// Generar respuesta inteligente
function generateSmartResponse(config, message) {
    const lowerMessage = message.toLowerCase();
    
    if (config.type === 'creation' && lowerMessage.includes('3d')) {
        return `🎯 **Generador 3D LANG AI**\n\n¡Perfecto! Puedo ayudarte a crear modelos 3D. Aquí tienes algunas opciones:\n\n**📦 Modelos Disponibles:**\n• PLC Micro810 (90x100x62mm)\n• Arduino UNO + Carcasa\n• Sensores industriales\n• Soportes personalizados\n\n**💡 Ejemplo de uso:**\n*"Crea un modelo 3D de un PLC Micro810"*\n\n¿Qué modelo específico necesitas?`;
    }
    
    if (config.type === 'connection') {
        return `⚡ **Asistente de Conexiones LANG AI**\n\n¡Excelente! Te ayudo con conexiones industriales:\n\n**🔌 Tipos de Conexión:**\n• Sensores → PLC (2,3,4 hilos)\n• Actuadores → Salidas PLC\n• Comunicación Ethernet/IP\n• Redes industriales\n\n**📋 Información necesaria:**\n• Tipo de sensor/dispositivo\n• Modelo de PLC\n• Voltaje de trabajo\n\n¿Qué dispositivos quieres conectar?`;
    }
    
    if (config.type === 'programming') {
        return `💻 **Centro de Programación LANG AI**\n\n¡Genial! Puedo ayudarte con programación:\n\n**🛠️ Lenguajes Soportados:**\n• Ladder (PLCs Allen-Bradley)\n• Python (Automatización)\n• JavaScript (Aplicaciones web)\n• PowerShell (Scripts Windows)\n\n**🎯 Especialidades:**\n• Control de procesos\n• Interfaces HMI\n• Comunicación serial\n• APIs industriales\n\n¿Qué tipo de programa necesitas?`;
    }
    
    return getOfflineResponse(message);
}

// Mejorar función sendMessage con modo offline
const originalSendMessage = sendMessage;
sendMessage = async function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isProcessing) return;
    
    // Limpiar input y agregar mensaje del usuario
    messageInput.value = '';
    adjustTextareaHeight(messageInput);
    isProcessing = true;
    updateSendButton();
    addMessage('user', message);
    showTypingIndicator();
    
    try {
        let response;
        const apiKey = getApiKey();
        
        // Intentar modo online primero
        if (apiKey && navigator.onLine) {
            try {
                response = await callOpenAIWithRetry(message, apiKey);
            } catch (error) {
                if (error.message.includes('429') || error.message.includes('límite')) {
                    showNotification('⚠️ Límite API alcanzado - Cambiando a modo offline');
                    response = getOfflineResponse(message);
                } else {
                    throw error;
                }
            }
        } else {
            // Modo offline
            response = getOfflineResponse(message);
            if (!apiKey) {
                showNotification('💡 Modo offline - Configura tu API para funcionalidad completa');
            }
        }
        
        hideTypingIndicator();
        addMessage('ai', response);
        checkForCode(response);
        
    } catch (error) {
        hideTypingIndicator();
        addMessage('ai', `❌ Error: ${error.message}\n\nCambiando a modo offline...`);
        setTimeout(() => {
            const offlineResponse = getOfflineResponse(message);
            addMessage('ai', offlineResponse);
        }, 1000);
    }
    
    isProcessing = false;
    updateSendButton();
};

// Función mejorada de llamada API con reintentos
async function callOpenAIWithRetry(message, apiKey, attempt = 1) {
    try {
        return await callOpenAI(message, apiKey);
    } catch (error) {
        if (attempt < API_CONFIG.retryAttempts && error.message.includes('429')) {
            showNotification(`🔄 Reintentando (${attempt}/${API_CONFIG.retryAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * attempt));
            return callOpenAIWithRetry(message, apiKey, attempt + 1);
        }
        throw error;
    }
}

// Detección de conexión
window.addEventListener('online', () => {
    isOnline = true;
    showNotification('🌐 Conexión restaurada - Modo online activado');
});

window.addEventListener('offline', () => {
    isOnline = false;
    showNotification('📱 Sin conexión - Modo offline activado');
});

// Autoguardado de conversaciones
function autoSaveChat() {
    if (autoSaveEnabled && chatHistory.length > 0) {
        const chatData = {
            id: currentChatId,
            timestamp: Date.now(),
            history: chatHistory
        };
        localStorage.setItem(`lang_ai_chat_${currentChatId}`, JSON.stringify(chatData));
    }
}

// Autoguardar cada 30 segundos
setInterval(autoSaveChat, 30000);

// Cargar chats guardados
function loadSavedChats() {
    const chatHistory = document.querySelector('.chat-history');
    const savedChats = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('lang_ai_chat_')) {
            const chatData = JSON.parse(localStorage.getItem(key));
            savedChats.push(chatData);
        }
    }
    
    // Ordenar por timestamp
    savedChats.sort((a, b) => b.timestamp - a.timestamp);
    
    // Agregar al sidebar (solo los primeros 5)
    savedChats.slice(0, 5).forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.innerHTML = `
            <i class="fas fa-message"></i>
            <span>Chat ${new Date(chat.timestamp).toLocaleDateString()}</span>
        `;
        chatItem.onclick = () => loadChat(chat.id);
        chatHistory.appendChild(chatItem);
    });
}

// Cargar chat específico
function loadChat(chatId) {
    const chatData = JSON.parse(localStorage.getItem(`lang_ai_chat_${chatId}`));
    if (chatData) {
        chatHistory = chatData.history;
        currentChatId = chatId;
        
        // Reconstruir interfaz
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.innerHTML = '';
        
        chatHistory.forEach(msg => {
            addMessage(msg.role === 'user' ? 'user' : 'ai', msg.content);
        });
        
        showNotification('📂 Chat cargado correctamente');
    }
}

// Exportar chat como archivo
function exportChat() {
    if (chatHistory.length === 0) {
        showNotification('❌ No hay conversación para exportar');
        return;
    }
    
    const chatText = chatHistory.map(msg => {
        const sender = msg.role === 'user' ? 'Usuario' : 'LANG AI';
        return `${sender}: ${msg.content}\n\n`;
    }).join('');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `LANG_AI_Chat_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showNotification('💾 Chat exportado correctamente');
}

// Limpiar todos los chats guardados
function clearAllChats() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los chats guardados?')) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key.startsWith('lang_ai_chat_')) {
                localStorage.removeItem(key);
            }
        }
        location.reload();
    }
}

// Estadísticas de uso
function showStats() {
    const totalChats = Object.keys(localStorage).filter(key => key.startsWith('lang_ai_chat_')).length;
    const currentMessages = chatHistory.length;
    const apiKey = localStorage.getItem('lang_ai_api_key') ? '✅ Configurada' : '❌ No configurada';
    
    const statsHTML = `
        📊 **Estadísticas LANG AI**\n\n
        🗂️ Chats guardados: ${totalChats}\n
        💬 Mensajes en sesión actual: ${currentMessages}\n
        🔑 API Key: ${apiKey}\n
        🌐 Estado conexión: ${isOnline ? '✅ Online' : '📱 Offline'}\n
        🎯 Versión: 2.0 Avanzada
    `;
    
    addMessage('ai', statsHTML);
}

// Comandos especiales
function handleSpecialCommands(message) {
    const command = message.toLowerCase().trim();
    
    switch(command) {
        case '/help':
        case '/ayuda':
            return `🎯 **Comandos Especiales LANG AI**\n\n**📝 Comandos disponibles:**\n• \`/help\` - Mostrar esta ayuda\n• \`/stats\` - Ver estadísticas\n• \`/export\` - Exportar chat\n• \`/clear\` - Limpiar chats\n• \`/config\` - Configurar API\n• \`/offline\` - Forzar modo offline\n\n**🎲 Ejemplos rápidos:**\n• "PLC Micro810" - Modelo 3D\n• "sensor proximidad" - Conexión\n• "arduino carcasa" - Diseño\n\n*¡Prueba cualquier comando o pregunta!*`;
        
        case '/stats':
        case '/estadisticas':
            showStats();
            return null;
        
        case '/export':
        case '/exportar':
            exportChat();
            return null;
        
        case '/clear':
        case '/limpiar':
            clearAllChats();
            return null;
        
        case '/config':
        case '/configurar':
            configureApiKey();
            return null;
        
        case '/offline':
            return getOfflineResponse('modo offline activado');
        
        default:
            return null;
    }
}

// Modificar addMessage para manejar comandos especiales
const originalAddMessage = addMessage;
addMessage = function(sender, content) {
    if (sender === 'user') {
        const specialResponse = handleSpecialCommands(content);
        if (specialResponse !== null) {
            originalAddMessage(sender, content);
            if (specialResponse) {
                setTimeout(() => originalAddMessage('ai', specialResponse), 500);
            }
            return;
        }
    }
    originalAddMessage(sender, content);
    autoSaveChat();
};

// Inicialización avanzada
document.addEventListener('DOMContentLoaded', function() {
    // Cargar chats guardados al inicio
    setTimeout(loadSavedChats, 1000);
    
    // Mostrar mensaje de bienvenida mejorado
    setTimeout(() => {
        if (chatHistory.length === 0) {
            const welcomeMsg = `🚀 **¡Bienvenido a LANG AI 2.0!**\n\nSoy tu asistente inteligente mejorado con:\n\n✨ **Nuevas funcionalidades:**\n• 🔄 Modo offline inteligente\n• 💾 Autoguardado de conversaciones\n• 📊 Estadísticas de uso\n• 🎯 Comandos especiales\n• ⚡ Reintentos automáticos\n\n💡 **Escribe \`/help\` para ver todos los comandos**\n\n¿En qué puedo ayudarte hoy?`;
            
            // Solo mostrar si no hay API key configurada
            if (!localStorage.getItem('lang_ai_api_key')) {
                addMessage('ai', welcomeMsg);
            }
        }
    }, 2000);
});

console.log('🧠 LANG AI 2.0 Cargado - Versión Avanzada Activa');


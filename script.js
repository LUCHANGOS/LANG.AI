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
let lastRequestTime = 0;
let requestCount = 0;
let rateLimitResetTime = 0;
let isFirstRequest = true; // Nueva variable para manejar primera solicitud

// Configuración de la API
const API_CONFIG = {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    maxTokens: 2000, // Reducido para evitar límites
    temperature: 0.3,
    retryAttempts: 5, // Más reintentos
    retryDelay: 2000, // Más tiempo entre reintentos
    maxRequestsPerMinute: 3, // Límite de solicitudes por minuto
    cooldownTime: 20000 // 20 segundos de cooldown después de error 429
};

// Base de conocimientos offline para LANG AI - AMPLIADA
const OFFLINE_DATABASE = {
    'hola': {
        type: 'greeting',
        response: `# ¡Hola! 👋

¡Bienvenido a LANG AI en modo offline! Aunque no tengo acceso a internet, puedo ayudarte con:

## 🎯 Especialidades disponibles:
- **Modelado 3D** con OpenSCAD
- **Automatización Industrial** (PLCs, sensores)
- **Programación** básica
- **Documentación técnica**

¿En qué puedo ayudarte?`
    },
    
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
    
    'servo motor': {
        type: '3d_model',
        response: `# Soporte para Servo Motor SG90

## Especificaciones del SG90:
- **Dimensiones**: 22.2 x 11.8 x 31mm
- **Peso**: 9g
- **Torque**: 1.8kg⋅cm (4.8V)
- **Ángulo**: 180° (±90°)

\`\`\`openscad
// Soporte Servo SG90
module servo_mount() {
    difference() {
        // Base del soporte
        cube([30, 20, 6]);
        
        // Agujeros para tornillos servo
        translate([4, 4, -1]) cylinder(h=8, r=1);
        translate([26, 4, -1]) cylinder(h=8, r=1);
        translate([4, 16, -1]) cylinder(h=8, r=1);
        translate([26, 16, -1]) cylinder(h=8, r=1);
    }
    
    // Paredes laterales
    translate([0, -2, 0]) cube([30, 2, 15]);
    translate([0, 20, 0]) cube([30, 2, 15]);
}

servo_mount();
\`\`\``,
        tags: ['servo', 'sg90', 'motor', '3d', 'soporte']
    },
    
    'led strip': {
        type: 'automation',
        response: `# Control de Tira LED con Arduino/PLC

## Conexión Tira LED RGB (WS2812B):
- **VCC**: 5V (fuente externa para >10 LEDs)
- **GND**: Común con Arduino/PLC
- **DIN**: Pin digital (Arduino: D6, PLC: salida PWM)

## Código Arduino:
\`\`\`cpp
#include <FastLED.h>

#define LED_PIN     6
#define NUM_LEDS    30
#define BRIGHTNESS  64
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB

CRGB leds[NUM_LEDS];

void setup() {
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
    FastLED.setBrightness(BRIGHTNESS);
}

void loop() {
    // Efecto arcoíris
    fill_rainbow(leds, NUM_LEDS, 0, 7);
    FastLED.show();
    delay(50);
}
\`\`\`

**⚡ Consumo**: ~60mA por LED a máximo brillo`,
        tags: ['led', 'strip', 'ws2812b', 'arduino', 'rgb']
    },
    
    'raspberry pi': {
        type: '3d_model',
        response: `# Carcasa Raspberry Pi 4

## Especificaciones Pi 4:
- **Dimensiones**: 85mm x 56mm x 17mm
- **Puertos**: USB-C, 2×USB3, 2×USB2, HDMI×2
- **Refrigeración**: Ventilador 30x30mm recomendado

\`\`\`openscad
// Carcasa Raspberry Pi 4
module pi4_case() {
    difference() {
        // Cuerpo principal
        cube([90, 61, 25]);
        
        // Cavidad para Pi
        translate([2.5, 2.5, 2]) {
            cube([85, 56, 20]);
        }
        
        // Puerto USB-C (alimentación)
        translate([-1, 10.6, 8]) cube([5, 9, 3]);
        
        // HDMI ports
        translate([-1, 25, 8]) cube([5, 15, 8]);
        translate([-1, 43, 8]) cube([5, 15, 8]);
        
        // USB ports
        translate([85, 9, 8]) cube([8, 13, 6]);
        translate([85, 27, 8]) cube([8, 13, 6]);
        
        // Ethernet
        translate([85, 45, 8]) cube([8, 16, 14]);
        
        // Ventilación
        for(x = [10:10:80]) {
            for(y = [10:10:50]) {
                translate([x, y, -1]) cylinder(h=4, r=1.5);
            }
        }
    }
    
    // Soportes GPIO
    translate([5, 5, 2]) cylinder(h=3, r=1.5);
    translate([63, 5, 2]) cylinder(h=3, r=1.5);
    translate([5, 51, 2]) cylinder(h=3, r=1.5);
    translate([63, 51, 2]) cylinder(h=3, r=1.5);
}

pi4_case();
\`\`\``,
        tags: ['raspberry', 'pi4', 'carcasa', '3d', 'ventilacion']
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
    
    // Configurar API key al inicio - NUEVA API CONFIGURADA
    const newApiKey = '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';
    localStorage.setItem('lang_ai_api_key', newApiKey);
    console.log('🔑 Nueva API key configurada automáticamente');
    
    // ARREGLO: Habilitar botón inmediatamente sin restricciones estrictas
    sendButton.disabled = false;
    console.log('✅ Botón de envío habilitado');
    
    // Habilitar/deshabilitar botón de envío de forma más permisiva
    messageInput.addEventListener('input', function() {
        // Solo deshabilitar si está completamente vacío O procesando
        const isEmpty = this.value.trim() === '';
        sendButton.disabled = isEmpty || isProcessing;
        console.log(`📝 Input: "${this.value}" - Botón ${sendButton.disabled ? 'deshabilitado' : 'habilitado'}`);
    });
    
    // Manejar Enter para enviar
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (!sendButton.disabled) {
                sendMessage();
            }
        }
    });
    
    // También manejar click del botón
    sendButton.addEventListener('click', function() {
        if (!sendButton.disabled) {
            sendMessage();
        }
    });
    
    // Mostrar notificación de API actualizada
    setTimeout(() => {
        showNotification('🔑 API Key actualizada - Sistema listo');
        updateApiStatus('ready', 'API Lista');
    }, 1000);
    
    // Focus automático en el input
    setTimeout(() => {
        messageInput.focus();
        console.log('🎯 Input enfocado automáticamente');
    }, 1500);
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

// FUNCIÓN SENDMESSAGE TEMPORAL ELIMINADA - USAR LA VERSIÓN SIMPLIFICADA ABAJO

// LLAMADA DIRECTA A API SIN LÍMITES
async function directApiCall(message, apiKey) {
    console.log('📞 Realizando llamada directa a OpenAI API...');
    
    const systemPrompt = `Eres LANG AI, un asistente especializado en:
1. Modelado 3D con OpenSCAD
2. Automatización industrial (PLCs, sensores, etc.)
3. Programación y desarrollo de software
4. Proporcionar medidas reales de componentes industriales

Responde siempre en español de manera clara y detallada. Si generas código OpenSCAD, inclúyelo en bloques de código con comentarios explicativos.

Para PLCs como el Micro810, usa medidas reales: 90mm x 100mm x 62mm.

Sé conciso pero completo en tus respuestas.`;
    
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
                { role: 'user', content: message }
            ],
            max_tokens: API_CONFIG.maxTokens,
            temperature: API_CONFIG.temperature
        })
    });
    
    console.log(`📊 Respuesta HTTP: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Respuesta exitosa de OpenAI');
    
    updateApiStatus('ready', 'API Lista');
    return data.choices[0].message.content;
}

// FUNCIÓN ORIGINAL COMENTADA PARA REFERENCIA
// async function callOpenAI(message, apiKey) {
//     const now = Date.now();
//     
//     // NUNCA bloquear si es la primera solicitud
//     if (isFirstRequest) {
//         console.log('🚀 PRIMERA SOLICITUD - Sin límites aplicados');
//         isFirstRequest = false;
//         // No verificar nada más, continuar directamente
//     } else {
//         // Solo verificar límites DESPUÉS de la primera solicitud
//         
//         // Verificar cooldown activo
//         if (now < rateLimitResetTime) {
//             const waitTime = Math.ceil((rateLimitResetTime - now) / 1000);
//             throw new Error(`Límite de velocidad activo. Espera ${waitTime} segundos.`);
//         }
//         
//         // Controlar solicitudes por minuto
//         if (now - lastRequestTime < 60000) {
//             if (requestCount >= API_CONFIG.maxRequestsPerMinute) {
//                 throw new Error('Límite de solicitudes por minuto alcanzado. Espera 60 segundos.');
//             }
//         } else {
//             // Reset contador cada minuto
//             requestCount = 0;
//             console.log('⏰ Contador de minuto reseteado');
//         }
//     }

    const systemPrompt = `Eres LANG AI, un asistente especializado en:
1. Modelado 3D con OpenSCAD
2. Automatización industrial (PLCs, sensores, etc.)
3. Programación y desarrollo de software
4. Proporcionar medidas reales de componentes industriales

Responde siempre en español de manera clara y detallada. Si generas código OpenSCAD, inclúyelo en bloques de código con comentarios explicativos.

Para PLCs como el Micro810, usa medidas reales: 90mm x 100mm x 62mm.

Sé conciso pero completo en tus respuestas.`;
    
    // Limitar historial para evitar tokens excesivos
    const limitedHistory = chatHistory.slice(-6); // Solo últimos 6 mensajes
    
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
                ...limitedHistory.map(msg => ({ role: msg.role, content: msg.content })),
                { role: 'user', content: message }
            ],
            max_tokens: API_CONFIG.maxTokens,
            temperature: API_CONFIG.temperature
        })
    });
    
    // Actualizar contadores
    lastRequestTime = now;
    requestCount++;
    console.log(`📊 Solicitud ${requestCount}/${API_CONFIG.maxRequestsPerMinute} en este minuto`);
    
    if (!response.ok) {
        if (response.status === 429) {
            // Activar cooldown
            rateLimitResetTime = now + API_CONFIG.cooldownTime;
            const waitTime = Math.ceil(API_CONFIG.cooldownTime / 1000);
            updateApiStatus('cooldown', `Cooldown: ${waitTime}s`);
            throw new Error(`Límite de velocidad alcanzado. Sistema en cooldown por ${waitTime} segundos.`);
        } else if (response.status === 401) {
            updateApiStatus('error', 'API Inválida');
            localStorage.removeItem('lang_ai_api_key');
            throw new Error('Clave API inválida. Por favor, configúrala nuevamente.');
        } else if (response.status === 403) {
            updateApiStatus('error', 'Acceso Denegado');
            throw new Error('Acceso denegado. Verifica tu plan de OpenAI.');
        } else if (response.status >= 500) {
            updateApiStatus('error', 'Error Servidor');
            throw new Error('Error del servidor de OpenAI. Intenta más tarde.');
        } else {
            updateApiStatus('error', `Error ${response.status}`);
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
    }
    
    const data = await response.json();
    updateApiStatus('ready', 'API Lista');
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

// Actualizar estado visual de la API
function updateApiStatus(status, message) {
    const apiStatus = document.getElementById('apiStatus');
    if (!apiStatus) return;
    
    // Remover todas las clases de estado
    apiStatus.classList.remove('ready', 'cooldown', 'error', 'offline');
    
    // Agregar nueva clase y actualizar contenido
    apiStatus.classList.add(status);
    apiStatus.innerHTML = `<i class="fas fa-circle"></i><span>${message}</span>`;
}

// Inicializar estado de API
function initializeApiStatus() {
    // SIEMPRE empezar con estado limpio
    rateLimitResetTime = 0;
    requestCount = 0;
    lastRequestTime = 0;
    isFirstRequest = true;
    
    if (!localStorage.getItem('lang_ai_api_key')) {
        updateApiStatus('offline', 'API No Configurada');
    } else {
        updateApiStatus('ready', 'API Lista');
    }
    
    console.log('🔄 Estado API inicializado - Sistema listo');
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
        updateApiStatus('ready', 'API Lista');
        showNotification('✅ API actualizada correctamente');
    }
}

// Agregar CSS para typing indicator y estado de API
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

.api-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85em;
    padding: 4px 8px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.api-status.ready {
    color: #22c55e;
    background: rgba(34, 197, 94, 0.1);
}

.api-status.cooldown {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
}

.api-status.error {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
}

.api-status.offline {
    color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
}

.api-status i {
    font-size: 8px;
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

// VERSIÓN SIMPLIFICADA - SIN LÍMITES PARA DIAGNÓSTICO
sendMessage = async function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isProcessing) return;
    
    const apiKey = getApiKey();
    if (!apiKey) {
        showNotification('❌ Por favor configura tu clave API primero');
        return;
    }
    
    // Limpiar input y agregar mensaje del usuario
    messageInput.value = '';
    adjustTextareaHeight(messageInput);
    isProcessing = true;
    updateSendButton();
    addMessage('user', message);
    showTypingIndicator();
    
    try {
        console.log('🔥 LLAMADA DIRECTA A API - Sin verificaciones de límites');
        
        // LLAMADA DIRECTA SIN VERIFICACIONES
        const response = await directApiCall(message, apiKey);
        
        hideTypingIndicator();
        addMessage('ai', response);
        checkForCode(response);
        
    } catch (error) {
        console.error('❌ Error en sendMessage:', error);
        hideTypingIndicator();
        
        if (error.message.includes('429')) {
            addMessage('ai', `❌ Error 429: ${error.message}\n\n🔄 Cambiando a modo offline...`);
            setTimeout(() => {
                const offlineResponse = getOfflineResponse(message);
                addMessage('ai', offlineResponse);
            }, 1000);
        } else {
            addMessage('ai', `❌ Error: ${error.message}`);
        }
    }
    
    isProcessing = false;
    updateSendButton();
};

// Función mejorada de llamada API con reintentos inteligentes
async function callOpenAIWithRetry(message, apiKey, attempt = 1) {
    try {
        return await callOpenAI(message, apiKey);
    } catch (error) {
        console.log(`Intento ${attempt} falló:`, error.message);
        
        // No reintentar si es error de autenticación o configuración
        if (error.message.includes('inválida') || error.message.includes('denegado')) {
            throw error;
        }
        
        // Reintentar solo para errores de red o límites de velocidad
        if (attempt < API_CONFIG.retryAttempts && 
            (error.message.includes('límite') || 
             error.message.includes('servidor') || 
             error.message.includes('429'))) {
            
            const delay = API_CONFIG.retryDelay * Math.pow(2, attempt - 1); // Backoff exponencial
            const waitSeconds = Math.ceil(delay / 1000);
            
            showNotification(`🔄 Reintentando en ${waitSeconds}s (${attempt}/${API_CONFIG.retryAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, delay));
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
    // Inicializar estado de API
    setTimeout(initializeApiStatus, 500);
    
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


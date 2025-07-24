# 🧠 LANG AI v2.1
## Tu Asistente Inteligente Personalizado

![LANG AI](https://img.shields.io/badge/LANG%20AI-v2.1-blue?style=for-the-badge&logo=brain)
![Status](https://img.shields.io/badge/Status-Estable-brightgreen?style=for-the-badge)
![OpenSCAD](https://img.shields.io/badge/OpenSCAD-Compatible-green?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)
![CSS3](https://img.shields.io/badge/CSS3-Modern-blue?style=flat-square)

---

## 🎯 **¿Qué es LANG AI?**

LANG AI es tu asistente inteligente personalizado con interfaz similar a ChatGPT, pero con tu marca y especializado en:

- 🎲 **Modelado 3D con OpenSCAD**
- ⚙️ **Automatización Industrial (PLCs, sensores)**
- 💻 **Programación y desarrollo de software**
- 📐 **Medidas reales de componentes industriales**

---

## ✨ **Características Principales**

### 🚀 **NUEVO v2.1 - Control Inteligente de API**
- 🎯 **Control automático de límites** - Máximo 3 solicitudes/minuto
- ⏱️ **Cooldown visual** - Contador en tiempo real del estado
- 🔄 **Recuperación automática** - Reintentos inteligentes con backoff exponencial
- 📱 **Modo offline** - Funciona sin internet para tareas básicas
- 🟢🟡🔴 **Indicador de estado** - API Lista / Cooldown / Error en tiempo real

### 🧠 **Base de Conocimientos Offline**
- **PLC Micro810** - Modelos 3D con medidas exactas (90x100x62mm)
- **Arduino UNO** - Carcasas protectoras y proyectos
- **Sensores de proximidad** - Esquemas de conexión y programación
- **Respuestas inteligentes** - Reconocimiento de patrones para mejor ayuda

### 🎨 **Interfaz Moderna**
- Diseño similar a ChatGPT pero con identidad LANG
- Colores azules con gradientes profesionales
- Responsive design para móviles y desktop
- Animaciones suaves y experiencia fluida

### 🤖 **IA Especializada**
- Integración directa con OpenAI GPT-4o-mini
- Prompts optimizados para modelado 3D
- Conocimiento especializado en automatización
- Respuestas siempre en español

### 🛠️ **Funcionalidades Avanzadas**
- ✅ Generación automática de código OpenSCAD
- ✅ Descarga directa de archivos .scad
- ✅ Historial de conversaciones con autoguardado
- ✅ Indicadores de escritura en tiempo real
- ✅ Detección automática de código
- ✅ Notificaciones elegantes
- ✅ **NUEVO:** Comandos especiales (/help, /stats, /config)
- ✅ **NUEVO:** Manejo inteligente de errores HTTP

---

## 🚀 **Instalación y Uso**

### 1. **Requisitos**
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Clave API de OpenAI ([Obtener aquí](https://platform.openai.com/account/api-keys))
- **RECOMENDADO:** Plan de pago en OpenAI para evitar límites estrictos

### 2. **Instalación**
```bash
# Clona o descarga los archivos
cd LANG_AI

# Abre index.html en tu navegador
start index.html  # Windows
open index.html   # macOS
```

### 3. **Configuración**
1. Al abrir la aplicación por primera vez, se te pedirá tu clave API
2. La clave se guarda de forma segura en localStorage
3. **IMPORTANTE:** Observa el indicador de estado (🟢🟡🔴) en la parte inferior
4. ¡Listo para usar!

### 4. **🆕 Cómo Usar v2.1**
- **Observa el indicador:** 🟢 = Listo, 🟡 = Espera, 🔴 = Error
- **Respeta los límites:** Máximo 3 preguntas por minuto
- **Usa comandos:** Escribe `/help` para ver todos los comandos
- **Modo offline:** Funciona sin internet para PLC, Arduino, sensores

---

## 💡 **Ejemplos de Uso**

### 🎲 **Modelado 3D**
```
"Crea un modelo 3D de un PLC Micro810 con medidas reales"
"Genera una carcasa para Arduino UNO con ventilación"
"Diseña un soporte para monitor de escritorio"
```

### ⚙️ **Automatización**
```
"Explica cómo conectar un sensor de proximidad a un PLC"
"Programa un semáforo con Allen-Bradley"
"Configuración de red Ethernet/IP"
```

### 💻 **Programación**
```
"Crea un script PowerShell para automatizar backups"
"Genera código Python para comunicación serial"
"Desarrolla una API REST en Node.js"
```

---

## 🎨 **Personalización**

### **Cambiar Colores de Marca**
```css
/* En styles.css - Cambiar variables principales */
:root {
  --primary-color: #4299e1;  /* Tu color principal */
  --secondary-color: #667eea; /* Color secundario */
  --accent-color: #48bb78;    /* Color de acento */
}
```

### **Modificar Nombre de Marca**
```html
<!-- En index.html - Cambiar todas las referencias LANG AI -->
<title>TU_MARCA AI - Tu Asistente Inteligente</title>
```

### **Personalizar Capacidades**
```javascript
// En script.js - Modificar systemPrompt
const systemPrompt = `Eres TU_MARCA AI, especializado en...`;
```

---

## 📁 **Estructura del Proyecto**

```
LANG_AI/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── script.js           # Funcionalidad JavaScript
├── README.md           # Este archivo
└── assets/             # Recursos adicionales (opcional)
    ├── logo.png
    └── favicon.ico
```

---

## 🔧 **Configuración Avanzada**

### **Cambiar Modelo de IA**
```javascript
// En script.js
const API_CONFIG = {
    model: 'gpt-4',           // Cambiar modelo
    maxTokens: 3000,          # Más tokens
    temperature: 0.2          # Más conservador
};
```

### **Agregar Nuevas Funcionalidades**
```javascript
// Ejemplo: Integrar con base de datos
function saveChatToDatabase(chatHistory) {
    // Tu código aquí
}
```

---

## 🚀 **Características Futuras**

- [ ] 🗣️ Soporte de voz (speech-to-text)
- [ ] 📱 Aplicación móvil nativa
- [ ] 🔌 Integración con OpenSCAD local
- [ ] 📊 Dashboard de estadísticas
- [ ] 👥 Modo colaborativo
- [ ] 🌙 Modo oscuro
- [ ] 🔐 Autenticación de usuarios

---

## 🤝 **Contribuir**

¿Quieres mejorar LANG AI? ¡Genial!

1. Fork el proyecto
2. Crea una nueva rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 🆘 **Soporte**

¿Necesitas ayuda?

- 📧 Email: soporte@lang-ai.com
- 💬 Discord: [Servidor LANG AI](https://discord.gg/lang-ai)
- 📚 Documentación: [Wiki del proyecto](https://github.com/lang-ai/wiki)

---

## 🙏 **Agradecimientos**

- OpenAI por su increíble API
- La comunidad de OpenSCAD
- Font Awesome por los iconos
- Google Fonts por la tipografía Inter

---

<div align="center">

### 🎉 **¡Disfruta usando LANG AI!**

*Desarrollado con ❤️ por el equipo LANG*

[![Estrellas](https://img.shields.io/github/stars/lang-ai/lang-ai?style=social)](https://github.com/lang-ai/lang-ai)
[![Forks](https://img.shields.io/github/forks/lang-ai/lang-ai?style=social)](https://github.com/lang-ai/lang-ai)
[![Seguir](https://img.shields.io/github/followers/lang-ai?style=social)](https://github.com/lang-ai)

</div>


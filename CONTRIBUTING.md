# Contribuir a Los Cuatro Caminos de la Vida

## 🤝 Bienvenidos Colaboradores

Agradecemos tu interés en contribuir a esta aplicación de terapia sistémica. Este proyecto es parte del programa Playworld Pro del Dr. Miguel Ojeda Ríos.

## 🎯 Tipos de Contribuciones

### Desarrollo
- Mejoras en la interfaz 3D
- Optimizaciones de rendimiento
- Nuevas funcionalidades terapéuticas
- Corrección de bugs

### Contenido Terapéutico
- Documentación metodológica
- Casos de uso terapéutico
- Traducciones
- Mejoras en la experiencia del usuario

### Testing
- Pruebas en diferentes dispositivos
- Validación con terapeutas profesionales
- Reportes de bugs detallados

## 🚀 Configuración de Desarrollo

### Pre-requisitos
```bash
Node.js 18+
npm o yarn
Git
```

### Setup Local
```bash
# Clonar el repo
git clone https://github.com/TU-USUARIO/cuatro-caminos-vida.git
cd cuatro-caminos-vida

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Configurar variables necesarias
DATABASE_URL=tu_url_postgresql (opcional)
```

## 📋 Proceso de Contribución

### 1. Issues
- Revisar issues existentes antes de crear uno nuevo
- Usar templates de issue cuando estén disponibles
- Ser específico y detallado en descripciones

### 2. Pull Requests
```bash
# Crear branch para tu feature
git checkout -b feature/nombre-descriptivo

# Hacer cambios y commits
git add .
git commit -m "feat: descripción clara del cambio"

# Push del branch
git push origin feature/nombre-descriptivo

# Crear PR en GitHub
```

### 3. Revisión de Código
- Todos los PRs requieren revisión
- Seguir guías de estilo del proyecto
- Incluir tests cuando sea aplicable
- Documentar cambios significativos

## 🎨 Guías de Estilo

### JavaScript/TypeScript
- Usar TypeScript para todo el código nuevo
- Seguir configuración de ESLint del proyecto
- Preferir funciones arrow para componentes
- Documentar funciones complejas

### CSS/Styling
- Usar TailwindCSS para estilos
- Componentes responsivos obligatorios
- Probar en dispositivos móviles/tablets
- Mantener consistencia visual

### 3D/Three.js
- Optimizar geometrías y materiales
- Usar LOD cuando sea necesario
- Documentar parámetros de cámara/iluminación
- Probar rendimiento en dispositivos menos potentes

## 🧪 Testing

### Pruebas Manuales
- Probar en Chrome, Firefox, Safari
- Validar en dispositivos iOS/Android
- Verificar exportación de imágenes
- Confirmar funcionalidad táctil

### Casos de Prueba Críticos
1. Colocación automática de muñecos
2. Dirección de mirada independiente
3. Exportación de imagen PNG
4. Modo pantalla completa
5. Responsive design en tablets

## 📝 Commits

### Formato de Mensajes
```
tipo(scope): descripción breve

Descripción más detallada si es necesaria

- Cambio específico 1
- Cambio específico 2
```

### Tipos de Commit
- `feat`: nueva funcionalidad
- `fix`: corrección de bug
- `docs`: cambios en documentación
- `style`: cambios de formato
- `refactor`: refactoring de código
- `test`: añadir o modificar tests
- `chore`: tareas de mantenimiento

## 🐛 Reportar Bugs

### Información Requerida
- Descripción detallada del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots o videos si es visual
- Información del dispositivo/navegador
- Logs de consola si están disponibles

### Template de Bug Report
```markdown
**Descripción del Bug**
Descripción clara y concisa del problema.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

**Comportamiento Esperado**
Lo que debería haber pasado.

**Screenshots**
Si aplica, agregar screenshots.

**Información del Dispositivo:**
- OS: [e.g. iOS, Android, Windows]
- Navegador: [e.g. chrome, safari]
- Versión: [e.g. 22]

**Contexto Adicional**
Cualquier otra información relevante.
```

## 🎓 Recursos para Colaboradores

### Documentación Técnica
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js](https://threejs.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

### Metodología Terapéutica
- Los Cuatro Caminos de la Vida
- Dinámicas Sistémicas
- Constelaciones Familiares
- Programa Playworld Pro

## 🔒 Consideraciones Éticas

### Uso Terapéutico
- Respetar la privacidad de los pacientes
- No almacenar información personal
- Mantener estándares profesionales
- Validar cambios con terapeutas certificados

### Propiedad Intelectual
- Respetar derechos del Dr. Miguel Ojeda Ríos
- No usar contenido terapéutico sin autorización
- Citar fuentes apropiadamente

## 📞 Contacto

Para preguntas sobre contribuciones:
- Crear issue en GitHub
- Contactar al equipo de Playworld Pro
- Revisar documentación existente

## 🙏 Reconocimientos

Agradecemos a todos los colaboradores que ayudan a mejorar esta herramienta para la comunidad terapéutica.

---

**Desarrollado con cuidado para terapeutas sistémicos en todo el mundo**
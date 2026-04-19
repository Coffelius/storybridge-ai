# StoryBridge AI

**Entorno de planificación narrativa compatible con Story Plotter y optimizado para LLMs**

---

## 1. Visión General

StoryBridge AI es una herramienta de **arquitectura literaria** diseñada para autores, guionistas y creadores de contenido narrativo. La aplicación replica y extiende la funcionalidad de Story Plotter, permitiendo organizar personajes, tramas, cronologías y mundos ficticios de manera visual e intuitiva.

### Propuesta de Valor

La ventaja competitiva de StoryBridge AI radica en tres pilares fundamentales:

1. **Compatibilidad Total**: Importación y exportación perfecta con el formato de datos de Story Plotter (.txt/.json), permitiendo migración sin fricción de proyectos existentes.

2. **Interfaz Web Moderna**: Acceso desde cualquier dispositivo sin necesidad de instalación, con sincronización automática y colaboración en tiempo real.

3. **Pipeline AI-Ready**: Una capa de procesamiento inteligente que estructura los datos narrativos para que Modelos de Lenguaje Grandes (LLMs) como GPT-4 o Claude comprendan el contexto completo de la historia, minimizando alucinaciones y maximizando la coherencia narrativa.

---

## 2. Problema que Resuelve

### El Desafío del Autor Moderno

Los escritores enfrentan múltiples obstáculos al intentar usar herramientas de IA para asistir en su proceso creativo:

| Problema | Impacto |
|----------|---------|
| **Contexto Fragmentado** | Las IAs no conocen la historia completa, generando contenido inconsistente |
| **Pérdida de Metadatos** | Al copiar/pegar texto se pierde información estructural crucial |
| **Formatos Incompatibles** | Herramientas de planificación no se comunican con asistentes de IA |
| **Alucinaciones Narrativas** | La IA inventa personajes, eventos o detalles que contradicen el canon establecido |

### La Solución StoryBridge

StoryBridge actúa como un **puente inteligente** entre la mente creativa del autor y las capacidades generativas de la IA:

```
[Story Plotter] <---> [StoryBridge AI] <---> [LLM (GPT/Claude)]
      |                      |                      |
  Datos crudos         Estructura +            Generación
  del autor            Contexto optimizado     coherente
```

---

## 3. Arquitectura del Proyecto

### 3.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 16 + React 19 + TypeScript + Tailwind CSS          │
│  - Renderizado híbrido (SSR/CSR)                            │
│  - Estado global con React Context                          │
│  - Persistencia local con localStorage                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│  Parser JSON compatible con Story Plotter                    │
│  - Deserialización de campos anidados                       │
│  - Validación de esquema                                    │
│  - Transformación bidireccional                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 PIPELINE AI (Futuro)                         │
│  - Generador de prompts contextuales                        │
│  - Compresión semántica para ventanas de contexto           │
│  - Integración con OpenAI/Anthropic APIs                    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Modelo de Datos

El sistema maneja el esquema nativo de Story Plotter:

```typescript
interface StoryPlotterExport {
  memoList: string;        // Notas generales
  tagColorMap: string;     // Configuración visual
  plotList: string;        // Array de historias/plots
  allFolderList: string;   // Estructura de carpetas
}

interface Plot {
  title: string;
  subtitle: string;
  folderPath: string;
  writingstatus: "unwritten" | "writing" | "written";
  tagList: string;
  sequenceUnitList: SequenceUnit[];  // Opening, MainStory, Finale
  charList: Character[];              // Personajes
  relationShipList: Relationship[];   // Relaciones
  eraList: Era[];                     // Líneas temporales
  areaList: Area[];                   // Locaciones
  // ... más campos
}

interface Character {
  charParam: {
    char_name: { value: string };
    char_memo: { value: string };      // Descripción
    char_personality: { value: string };
    char_age: { value: string };
    char_sex: { value: string };
    char_call_me: { value: string };   // Pronombres
    // ... campos extensibles
  };
  priority: string;  // Main, Supporting, Minor
  tagList: string;
}
```

---

## 4. Funcionalidades Implementadas

### 4.1 Gestión de Archivos

- **Importación**: Drag & drop o selección de archivos `.txt` / `.json`
- **Exportación**: Descarga de archivo compatible con Story Plotter
- **Persistencia Local**: Auto-guardado en localStorage del navegador
- **Recuperación de Sesión**: Detección y restauración de trabajo previo

### 4.2 Navegación y Organización

- **Árbol de Carpetas**: Visualización jerárquica de la estructura del proyecto
- **Filtrado por Carpeta**: Vista enfocada en secciones específicas
- **Contadores**: Número de historias y personajes por carpeta
- **Vista General**: Acceso rápido a todas las historias

### 4.3 Visualización de Historias

- **Tarjetas de Historia**: Vista en grid con información resumida
  - Título y subtítulo
  - Estado de escritura (badge visual)
  - Ruta de carpeta
  - Conteo de personajes
  - Tags asociados
  - Fecha de última modificación

### 4.4 Detalle de Historia

- **Cabecera Editable**: Título, subtítulo, estado
- **Pestañas**: Story / Characters
- **Secuencias Narrativas**:
  - Opening (Apertura)
  - Main Story (Desarrollo)
  - Finale (Desenlace)
- **Tarjetas de Escena**: Ideas, descripciones, lugar, clima, notas

### 4.5 Gestión de Personajes

- **Tarjetas Expandibles**: Vista resumida y detallada
- **Campos Editables**:
  - Nombre y prioridad
  - Descripción/Memo
  - Género y edad
  - Pronombres
  - Apodos
  - Rol/Posición
  - Personalidad
  - Hábitos y razones
  - Apariencia
  - Trasfondo
- **Operaciones**: Crear, editar, eliminar

### 4.6 Modo Edición

- **Toggle Global**: Activar/desactivar edición
- **Edición Inline**: Modificar campos sin cambiar de vista
- **Feedback Visual**: Indicadores de estado de edición
- **Auto-guardado**: Cambios persistidos automáticamente

---

## 5. Casos de Uso con IA (Roadmap)

### 5.1 Análisis de Coherencia Narrativa

```
┌─────────────────────────────────────────────────────────────┐
│ ENTRADA: Estructura completa de la historia                  │
├─────────────────────────────────────────────────────────────┤
│ PROCESO:                                                     │
│ 1. Extraer línea temporal de eventos                        │
│ 2. Mapear presencia de personajes por escena                │
│ 3. Identificar conflictos lógicos                           │
├─────────────────────────────────────────────────────────────┤
│ SALIDA: Reporte de inconsistencias                          │
│ - "El personaje X aparece en la escena 5, pero fue         │
│    establecido como muerto en la escena 3"                  │
│ - "Hay un salto temporal de 2 años sin justificación"       │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Expansión de Personajes (Roleplay)

Utilizar los campos de personalidad, motivaciones y trasfondo para crear sesiones interactivas:

```markdown
**System Prompt Generado:**
Eres [NOMBRE], un personaje con las siguientes características:
- Personalidad: [char_personality]
- Edad: [char_age]
- Trasfondo: [char_background]
- Hábitos: [char_habit] porque [char_habit_why]
- Relaciones: [relationships_summary]

Mantén coherencia con estos eventos establecidos:
[relevant_plot_points]

Responde como este personaje lo haría.
```

### 5.3 Generación de Escenas

```markdown
**Contexto proporcionado a la IA:**

# Historia: [title]
## Estado actual: Capítulo [X] - [sequence_category]

### Personajes presentes:
- [character_1]: [brief_description]
- [character_2]: [brief_description]

### Eventos previos relevantes:
1. [previous_scene_summary_1]
2. [previous_scene_summary_2]

### Parámetros de la escena:
- Lugar: [place]
- Clima: [weather]
- Momento: [timezone]

### Objetivo narrativo:
[user_prompt]

---
Genera una escena que respete todos los elementos establecidos.
```

### 5.4 Brainstorming Estructurado

```
ENTRADA:
- Personajes disponibles
- Reglas del mundo
- Conflictos activos
- Tono de la historia

PROMPT:
"Sugiere 3 posibles giros argumentales para el Capítulo 5 que:
1. Involucren al personaje [X] de manera significativa
2. Respeten la regla establecida de [Y]
3. Escalen el conflicto principal sin resolverlo"

SALIDA:
Opciones rankeadas por impacto narrativo con justificación
```

---

## 6. Arquitectura AI-Ready (Diseño Futuro)

### 6.1 Generador de Contexto Inteligente

```typescript
interface AIContextGenerator {
  // Genera contexto optimizado para la ventana del LLM
  generateContext(params: {
    plot: Plot;
    focusArea: 'character' | 'scene' | 'timeline' | 'world';
    targetCharacters?: string[];
    relevanceThreshold?: number;
    maxTokens?: number;
  }): StructuredContext;
}

interface StructuredContext {
  systemPrompt: string;
  relevantFacts: string[];
  characterProfiles: CharacterSummary[];
  timelineSnapshot: Event[];
  worldRules: string[];
  estimatedTokens: number;
}
```

### 6.2 Compresión Semántica

Para historias grandes que exceden la ventana de contexto:

```typescript
interface SemanticCompressor {
  // Reduce información manteniendo coherencia
  compress(fullContext: StructuredContext, targetTokens: number): {
    compressed: StructuredContext;
    omittedDetails: string[];
    coherenceScore: number;
  };
}
```

### 6.3 Validador de Respuestas

```typescript
interface ResponseValidator {
  // Verifica que la salida de la IA sea coherente
  validate(
    aiResponse: string,
    originalContext: StructuredContext
  ): {
    isValid: boolean;
    contradictions: Contradiction[];
    suggestions: string[];
  };
}
```

---

## 7. Beneficios por Tipo de Usuario

### Para Escritores Noveles
- Estructura predefinida (Opening/Main/Finale)
- Plantillas de personajes completas
- Asistencia IA para superar bloqueos

### Para Autores Experimentados
- Migración perfecta desde Story Plotter
- Control total sobre la información compartida con IA
- Análisis profundo de coherencia

### Para Equipos de Guionistas
- Colaboración en tiempo real (futuro)
- Historial de cambios
- Roles y permisos

### Para Desarrolladores de Juegos
- Gestión de lore extenso
- Exportación para motores de diálogo
- Integración con pipelines de desarrollo

---

## 8. Instalación y Uso

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación Local

```bash
# Clonar el repositorio
git clone [repository-url]
cd story-plotter-viewer

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000
```

### Despliegue en Vercel (Free Tier)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# O conectar repositorio de GitHub para CI/CD automático
```

### Uso Básico

1. **Cargar datos**: Arrastra tu archivo de Story Plotter o haz clic en "Select File"
2. **Navegar**: Usa el árbol de carpetas para explorar tu contenido
3. **Editar**: Activa el modo edición con el botón "Edit"
4. **Guardar**: Los cambios se guardan automáticamente en el navegador
5. **Exportar**: Descarga el archivo modificado con el botón "Export"

---

## 9. Roadmap de Desarrollo

### Fase 1: MVP (Completada)
- [x] Parser de formato Story Plotter
- [x] Visualización de carpetas y historias
- [x] Vista de detalle con personajes y secuencias
- [x] Modo edición completo
- [x] Persistencia en localStorage
- [x] Exportación compatible

### Fase 2: Mejoras de UX
- [ ] Búsqueda global
- [ ] Filtros avanzados (por tag, estado, fecha)
- [ ] Vista de línea temporal
- [ ] Mapa de relaciones entre personajes
- [ ] Temas claro/oscuro
- [ ] Atajos de teclado

### Fase 3: Integración IA
- [ ] Generador de contexto estructurado
- [ ] Integración con OpenAI API
- [ ] Integración con Anthropic API
- [ ] Análisis de coherencia narrativa
- [ ] Sugerencias de escritura
- [ ] Roleplay con personajes

### Fase 4: Colaboración
- [ ] Autenticación de usuarios
- [ ] Almacenamiento en la nube
- [ ] Colaboración en tiempo real
- [ ] Historial de versiones
- [ ] Comentarios y anotaciones

---

## 10. Contribución

### Estructura del Proyecto

```
story-plotter-viewer/
├── src/
│   ├── app/              # Páginas Next.js
│   ├── components/       # Componentes React
│   │   ├── FileUpload.tsx
│   │   ├── FolderTree.tsx
│   │   ├── PlotList.tsx
│   │   ├── PlotDetail.tsx
│   │   └── CharacterCard.tsx
│   ├── context/          # Estado global
│   │   └── StoryContext.tsx
│   ├── lib/              # Utilidades
│   │   └── parser.ts
│   └── types/            # Definiciones TypeScript
│       └── storyplotter.ts
├── public/               # Archivos estáticos
└── package.json
```

### Guía de Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

## 11. Licencia

MIT License - Libre para uso personal y comercial.

---

## 12. Contacto y Soporte

- **Issues**: [GitHub Issues]
- **Discusiones**: [GitHub Discussions]
- **Email**: [contacto@storybridge.ai]

---

*StoryBridge AI - Donde la creatividad humana encuentra la inteligencia artificial.*

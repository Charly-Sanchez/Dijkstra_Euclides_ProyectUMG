# 🔬 Visualizador de Algoritmos - Euclides y Dijkstra

Un elegante visualizador interactivo que demuestra el funcionamiento del **Algoritmo de Euclides** para calcular el MCD y el **Algoritmo de Dijkstra** para encontrar rutas más cortas en grafos, con animaciones suaves y tema oscuro/metálico.

## ✨ Características Principales

### 🔢 Algoritmo de Euclides
- **Tabla tradicional** mostrando divisiones sucesivas (dividendo, divisor, cociente, residuo)
- **Visualización en tiempo real** de los números A, B y resultado MCD
- **Animaciones fluidas** de los cambios de valores
- **Pasos detallados** con explicaciones paso a paso
- **Controles interactivos** para configurar los números de entrada

### 🗺️ Algoritmo de Dijkstra
- **Grafo interactivo** con nodos y aristas clicables
- **Etiquetas dinámicas** en formato `[origen, distancia]` en cada nodo
- **Visualización del proceso** con nodos visitados, actuales y ruta óptima
- **Animaciones de recorrido** mostrando la exploración del algoritmo
- **Panel de resultados** con camino más corto y distancia total

## 🎨 Diseño y UX
- **Tema oscuro/metálico** con paleta de colores profesional
- **Animaciones suaves** powered by Framer Motion
- **Interfaz responsive** que funciona en desktop y móvil
- **Navegación intuitiva** con landing page y selección de algoritmos
- **Controles de velocidad** personalizables para las animaciones

## 🚀 Tecnologías Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool ultrarrápido
- **Framer Motion** - Animaciones fluidas y profesionales
- **D3.js** - Visualización de datos para grafos
- **React Router** - Navegación entre páginas
- **CSS Custom Properties** - Sistema de colores consistente

## 🛠️ Instalación y Uso

### Prerequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Charly-Sanchez/Dijkstra_Euclides_ProyectUMG.git

# Navegar al directorio
cd Proyecto-Final-2

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
# Desarrollo
npm run dev          # Servidor local en http://localhost:5173

# Producción
npm run build        # Generar build optimizado
npm run preview      # Preview del build de producción

# Linting
npm run lint         # Ejecutar ESLint
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── AlgorithmCard.*  # Tarjetas de selección de algoritmos
│   ├── EuclidesVisualizer.*  # Visualizador del algoritmo de Euclides
│   └── DijkstraVisualizer.*  # Visualizador del algoritmo de Dijkstra
├── pages/               # Páginas principales
│   ├── Home.*          # Landing page con selección
│   ├── EuclidesPage.*  # Página del algoritmo de Euclides
│   └── DijkstraPage.*  # Página del algoritmo de Dijkstra
├── algorithms/          # Lógica de algoritmos (futuro)
├── App.*               # Componente principal con routing
└── index.css           # Estilos globales y variables CSS
```

## 🎯 Casos de Uso

### Educativo
- **Estudiantes** aprendiendo sobre algoritmos fundamentales
- **Profesores** demostrando conceptos de matemática discreta
- **Programadores** visualizando algoritmos de grafos

### Profesional
- **Análisis de rutas** en redes y sistemas
- **Optimización de caminos** en logística
- **Comprensión visual** de algoritmos complejos

## 🎨 Paleta de Colores

```css
/* Colores Base */
--bg-primary: #0D1117     /* Negro carbón */
--bg-secondary: #161B22   /* Gris antracita */
--surface: #21262D        /* Gris oscuro */

/* Colores Metálicos */
--text-primary: #C9D1D9   /* Plata */
--accent-gold: #FFD700    /* Oro metálico */
--accent-copper: #B87333  /* Cobre */
--accent-steel: #58A6FF   /* Acero azul */

/* Estados */
--processing: #FFA657     /* Procesando */
--completed: #3FB950      /* Completado */
--error: #F85149          /* Error */
--optimal-path: #A5A5FF   /* Ruta óptima */
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👥 Autores

- **Carlos Sánchez** - Desarrollo principal
- Proyecto desarrollado para el curso de Matemática Discreta

## 🙏 Agradecimientos

- Algoritmo de Euclides basado en los principios matemáticos clásicos
- Algoritmo de Dijkstra implementado según el paper original (1959)
- Inspiración de diseño en interfaces modernas de desarrollo

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

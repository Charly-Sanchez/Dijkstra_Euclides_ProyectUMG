import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DijkstraVisualizerModern from '../components/DijkstraVisualizerModern';
import './DijkstraPage.css';

const DijkstraPage = () => {
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);

  return (
    <div className="dijkstra-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/" className="back-btn">
          ← Volver al inicio
        </Link>
        <h1>Algoritmo de Dijkstra</h1>
        <p>Encuentra las rutas más cortas en grafos con visualización interactiva</p>
      </motion.div>

      <motion.div 
        className="algorithm-description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="description-content">
          <h3>¿Cómo funciona el Algoritmo de Dijkstra?</h3>
          <div className="algorithm-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-info">
                <h4>Inicialización</h4>
                <p>Asignar distancia infinita a todos los nodos excepto el inicial (distancia 0)</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-info">
                <h4>Selección</h4>
                <p>Seleccionar el nodo no visitado con menor distancia conocida</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-info">
                <h4>Relajación</h4>
                <p>Actualizar distancias de nodos adyacentes si se encuentra un camino más corto</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-info">
                <h4>Repetición</h4>
                <p>Marcar como visitado y repetir hasta llegar al destino o agotar nodos</p>
              </div>
            </div>
          </div>
          <div className="algorithm-features">
            <h4>✨ Características del Visualizador:</h4>
            <ul>
              <li><strong>Interactivo:</strong> Haz clic en nodos para seleccionar inicio y destino</li>
              <li><strong>Paso a paso:</strong> Ve cada iteración del algoritmo en tiempo real</li>
              <li><strong>Tabla de pasos:</strong> Registro detallado de cada operación</li>
              <li><strong>Control de velocidad:</strong> Ajusta la velocidad de animación</li>
              <li><strong>Visualización de resultados:</strong> Ruta óptima y distancia total destacadas</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="visualizer-container enhanced"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <DijkstraVisualizerModern 
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          setSelectedStart={setSelectedStart}
          setSelectedEnd={setSelectedEnd}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
        />
      </motion.div>
    </div>
  );
};

export default DijkstraPage;
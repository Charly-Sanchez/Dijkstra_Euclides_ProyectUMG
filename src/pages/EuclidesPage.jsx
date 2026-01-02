import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EuclidesVisualizerModern from '../components/EuclidesVisualizerModern';
import './EuclidesPage.css';

const EuclidesPage = () => {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="euclides-page enhanced">
      <motion.div 
        className="page-header enhanced"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/" className="back-btn enhanced">
          ← Volver al inicio
        </Link>
        <div className="header-content">
          <h1>🧮 Algoritmo de Euclides Mejorado</h1>
          <p>Calcula el MCD de múltiples números con visualización paso a paso</p>
        </div>
      </motion.div>

      <motion.div 
        className="algorithm-description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="description-content">
          <h3>¿Cómo funciona el Algoritmo de Euclides?</h3>
          <div className="algorithm-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-info">
                <h4>División</h4>
                <p>Dividir el número mayor por el menor y obtener el residuo</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-info">
                <h4>Sustitución</h4>
                <p>Reemplazar el dividendo por el divisor y el divisor por el residuo</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-info">
                <h4>Repetición</h4>
                <p>Repetir el proceso hasta que el residuo sea 0</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-info">
                <h4>Resultado</h4>
                <p>El último divisor no nulo es el MCD</p>
              </div>
            </div>
          </div>
          <div className="multiple-numbers-info">
            <h4>✨ Funciones Mejoradas:</h4>
            <ul>
              <li><strong>Múltiples números:</strong> Calcula MCD de 2 a 6 números</li>
              <li><strong>Visualización detallada:</strong> Tabla tradicional con animaciones</li>
              <li><strong>Proceso paso a paso:</strong> Ve cada división en tiempo real</li>
              <li><strong>Control de velocidad:</strong> Ajusta la velocidad de animación</li>
              <li><strong>Números dinámicos:</strong> Agrega/elimina números fácilmente</li>
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
        <EuclidesVisualizerModern 
          isRunning={isRunning}
          setIsRunning={setIsRunning}
        />
      </motion.div>
    </div>
  );
};

export default EuclidesPage;
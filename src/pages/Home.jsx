import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AlgorithmCard from '../components/AlgorithmCard';
import './Home.css';

const Home = () => {
  const algorithms = [
    {
      id: 'euclides',
      title: 'Algoritmo de Euclides',
      description: 'Visualiza el cálculo del Máximo Común Divisor (MCD) con animaciones paso a paso',
      icon: '🔢',
      features: ['Animación de números', 'Pasos detallados', 'Entrada interactiva'],
      path: '/euclides',
      color: 'gold'
    },
    {
      id: 'dijkstra',
      title: 'Algoritmo de Dijkstra',
      description: 'Encuentra las rutas más cortas en grafos con visualización interactiva',
      icon: '🗺️',
      features: ['Grafos interactivos', 'Algoritmo de etiquetas', 'Creación de nodos'],
      path: '/dijkstra',
      color: 'steel'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="home">
      <motion.div 
        className="hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-content" variants={itemVariants}>
          <h1>Visualizador de Algoritmos</h1>
          <motion.p 
            className="hero-subtitle"
            variants={itemVariants}
          >
            Explora y comprende algoritmos fundamentales con animaciones interactivas
          </motion.p>
        </motion.div>

        <motion.div 
          className="algorithms-grid"
          variants={itemVariants}
        >
          {algorithms.map((algorithm, index) => (
            <motion.div
              key={algorithm.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <AlgorithmCard algorithm={algorithm} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="features-section"
          variants={itemVariants}
        >
          <h2>Características</h2>
          <div className="features-grid">
            <motion.div 
              className="feature"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="feature-icon">✨</span>
              <h3>Animaciones Suaves</h3>
              <p>Visualiza cada paso con transiciones fluidas y elegantes</p>
            </motion.div>
            <motion.div 
              className="feature"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="feature-icon">🎮</span>
              <h3>Interactividad</h3>
              <p>Controla la velocidad, pausa y reinicia las animaciones</p>
            </motion.div>
            <motion.div 
              className="feature"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="feature-icon">📊</span>
              <h3>Visualización Clara</h3>
              <p>Comprende la lógica con representaciones visuales intuitivas</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
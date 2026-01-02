import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './AlgorithmCard.css';

const AlgorithmCard = ({ algorithm }) => {
  const { title, description, icon, features, path, color } = algorithm;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className={`algorithm-card ${color}`}
      variants={cardVariants}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      <div className="card-header">
        <span className="algorithm-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      
      <p className="algorithm-description">{description}</p>
      
      <ul className="features-list">
        {features.map((feature, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <span className="feature-bullet">•</span>
            {feature}
          </motion.li>
        ))}
      </ul>
      
      <Link to={path} className="algorithm-link">
        <motion.button 
          className={`explore-btn ${color}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explorar Algoritmo
          <span className="btn-arrow">→</span>
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default AlgorithmCard;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import EuclidesPage from './pages/EuclidesPage';
import DijkstraPage from './pages/DijkstraPage';
import './App.css'

function App() {
  return (
    <Router basename="/Dijkstra_Euclides_ProyectUMG">
      <div className="app">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/euclides" element={<EuclidesPage />} />
            <Route path="/dijkstra" element={<DijkstraPage />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  )
}

export default App

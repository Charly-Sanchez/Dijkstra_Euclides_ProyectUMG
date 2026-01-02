import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EuclidesVisualizerModern.css';

const EuclidesVisualizerModern = ({ isRunning, setIsRunning }) => {
  const [numbers, setNumbers] = useState([48, 18, 24]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [currentPairProcess, setCurrentPairProcess] = useState(null);
  const [result, setResult] = useState(null);
  const [allProcesses, setAllProcesses] = useState({
    processes: [],
    finalMCD: 1,
    originalNumbers: []
  });
  const [currentProcessIndex, setCurrentProcessIndex] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [processSteps, setProcessSteps] = useState({});

  // Función para calcular MCD de dos números con pasos detallados
  const calculateMCDWithSteps = (a, b) => {
    let tempA = Math.max(a, b);
    let tempB = Math.min(a, b);
    
    const quotients = [];
    const remainders = [];
    const steps = [];
    const originalA = tempA;
    const originalB = tempB;

    steps.push({
      dividend: tempA,
      divisor: tempB,
      quotient: null,
      remainder: null,
      operation: `Iniciar: MCD(${tempA}, ${tempB})`
    });

    while (tempB !== 0) {
      const quotient = Math.floor(tempA / tempB);
      const remainder = tempA % tempB;
      
      quotients.push(quotient);
      remainders.push(remainder);
      
      steps.push({
        dividend: tempA,
        divisor: tempB,
        quotient,
        remainder,
        operation: `${tempA} ÷ ${tempB} = ${quotient}, residuo = ${remainder}`
      });

      tempA = tempB;
      tempB = remainder;
    }

    const finalMCD = tempA;

    return {
      mcd: finalMCD,
      quotients,
      remainders,
      steps,
      originalA,
      originalB
    };
  };

  // Función para calcular MCD de múltiples números
  const calculateMultipleMCD = (numbersArray) => {
    if (numbersArray.length === 0) return { processes: [], finalMCD: 1, originalNumbers: [] };
    if (numbersArray.length === 1) return { processes: [], finalMCD: numbersArray[0], originalNumbers: numbersArray };

    const processes = [];
    let currentResult = numbersArray[0];
    const originalNumbers = [...numbersArray];

    for (let i = 1; i < numbersArray.length; i++) {
      const processData = calculateMCDWithSteps(currentResult, numbersArray[i]);
      processes.push({
        ...processData,
        processNumber: i,
        inputNumbers: [currentResult, numbersArray[i]],
        remainingNumbers: numbersArray.slice(i + 1)
      });
      currentResult = processData.mcd;
    }

    return {
      processes,
      finalMCD: currentResult,
      originalNumbers
    };
  };

  // Función principal de inicio
  const startVisualization = () => {
    if (numbers.length < 2) return;
    
    setIsRunning(true);
    setCurrentStep(-1);
    setCurrentProcessIndex(0);
    setResult(null);
    setProcessSteps({});

    const processesData = calculateMultipleMCD(numbers);
    setAllProcesses(processesData);

    setTimeout(() => {
      animateProcess(processesData, 0);
    }, 500);
  };

  // Función para animar cada proceso
  const animateProcess = async (processesData, processIndex) => {
    if (processIndex >= processesData.processes.length) {
      setResult(processesData.finalMCD);
      setIsRunning(false);
      return;
    }

    const currentProcess = processesData.processes[processIndex];
    setCurrentProcessIndex(processIndex);
    setCurrentPairProcess(currentProcess);

    // Animar los pasos del proceso actual
    for (let i = 0; i < currentProcess.steps.length; i++) {
      setCurrentStep(i);
      setProcessSteps(prev => ({
        ...prev,
        [processIndex]: i
      }));
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    // Pequeña pausa entre procesos
    await new Promise(resolve => setTimeout(resolve, speed * 0.8));
    
    // Continuar con el siguiente proceso
    setTimeout(() => {
      animateProcess(processesData, processIndex + 1);
    }, speed * 0.5);
  };

  // Función para agregar número
  const addNumber = () => {
    if (numbers.length < 6) {
      setNumbers([...numbers, 12]);
    }
  };

  // Función para remover número
  const removeNumber = (index) => {
    if (numbers.length > 2) {
      const newNumbers = numbers.filter((_, i) => i !== index);
      setNumbers(newNumbers);
    }
  };

  // Función para actualizar número
  const updateNumber = (index, value) => {
    const newNumbers = [...numbers];
    const numValue = parseInt(value) || 0;
    if (numValue > 0 && numValue <= 9999) {
      newNumbers[index] = numValue;
      setNumbers(newNumbers);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setCurrentPairProcess(null);
    setResult(null);
    setAllProcesses({ processes: [], finalMCD: 1, originalNumbers: [] });
    setCurrentProcessIndex(0);
    setProcessSteps({});
  };

  // Animaciones modernas y elegantes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="euclides-visualizer modern-enhanced"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Principal */}
      <motion.div className="visualizer-header modern" variants={itemVariants}>
        <h3>🧮 Algoritmo de Euclides - Versión Moderna</h3>
        <div className="enhanced-controls modern">
          <div className="speed-control modern">
            <label>Velocidad:</label>
            <input
              type="range"
              min="400"
              max="2000"
              step="200"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="speed-slider modern"
            />
            <span>{(2400 - speed) / 200}x</span>
          </div>
          <div className="main-controls modern">
            <motion.button
              onClick={startVisualization}
              disabled={isRunning}
              className="btn primary modern"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRunning ? 'Calculando...' : 'Iniciar Cálculo'}
            </motion.button>
            <motion.button
              onClick={reset}
              className="btn secondary modern"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reiniciar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Sección de Entrada de Números */}
      <motion.div className="numbers-input-section modern" variants={itemVariants}>
        <h4>Ingresa los números (2-6):</h4>
        <div className="numbers-inputs modern">
          <AnimatePresence>
            {numbers.map((number, index) => (
              <motion.div
                key={index}
                className="number-input-group modern"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="number-label">N{index + 1}:</span>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => updateNumber(index, e.target.value)}
                  disabled={isRunning}
                  className="number-input modern"
                  min="1"
                  max="9999"
                />
                {numbers.length > 2 && (
                  <motion.button
                    onClick={() => removeNumber(index)}
                    disabled={isRunning}
                    className="remove-btn modern"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {numbers.length < 6 && (
            <motion.button
              onClick={addNumber}
              disabled={isRunning}
              className="add-number-btn modern"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Agregar Número
            </motion.button>
          )}
        </div>
        <div className="numbers-preview modern">
          MCD({numbers.join(', ')}) = ?
        </div>
      </motion.div>

      {/* Contenedor de Todos los Procesos */}
      <AnimatePresence>
        {allProcesses?.processes && allProcesses.processes.length > 0 && (
          <motion.div 
            className="all-processes-container modern"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="processes-grid modern">
              {allProcesses.processes.map((process, processIndex) => (
                <motion.div
                  key={processIndex}
                  className={`process-display modern ${
                    processIndex === currentProcessIndex ? 'current-process' : 
                    processIndex < currentProcessIndex ? 'completed-process' : 'pending-process'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: processIndex * 0.1 }}
                >
                  {/* Header del Proceso */}
                  <div className="process-header modern">
                    <h4>
                      <motion.span 
                        className="process-badge modern"
                        animate={processIndex === currentProcessIndex ? { 
                          boxShadow: ["0 4px 15px rgba(156, 163, 175, 0.3)", "0 4px 25px rgba(156, 163, 175, 0.5)", "0 4px 15px rgba(156, 163, 175, 0.3)"]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Proceso {processIndex + 1}
                      </motion.span>
                      MCD({process.inputNumbers.join(', ')})
                      {processIndex < currentProcessIndex && (
                        <span className="process-result modern">= {process.mcd}</span>
                      )}
                    </h4>
                    {process.remainingNumbers && process.remainingNumbers.length > 0 && (
                      <div className="remaining-numbers modern">
                        Números pendientes: {process.remainingNumbers.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Tabla Formato Exacto de la Imagen */}
                  <div className="enhanced-traditional-table modern">
                    <div className="table-header">
                      <div className="formula-text modern">
                        MCD({process.originalA}, {process.originalB}) = {processIndex < currentProcessIndex ? process.mcd : '?'}
                      </div>
                    </div>
                    
                    <div className="euclides-table-container modern">
                      <table className="euclides-table modern">
                        <thead>
                          {/* Fila de Cocientes - ARRIBA */}
                          <tr className="quotients-header">
                            <th className="label-cell">Cocientes</th>
                            {process.quotients.map((quotient, qIndex) => {
                              const isCurrentQuotient = processIndex === currentProcessIndex && 
                                                      qIndex === (processSteps[processIndex] || 1) - 1;
                              const isRevealedQuotient = processIndex < currentProcessIndex || 
                                                       (processIndex === currentProcessIndex && 
                                                        qIndex < (processSteps[processIndex] || 1) - 1);
                              
                              return (
                                <th key={qIndex} className="quotient-header">
                                  <motion.span
                                    className={`quotient-cell modern ${
                                      isCurrentQuotient ? 'current' : isRevealedQuotient ? 'revealed' : 'hidden'
                                    }`}
                                    animate={isCurrentQuotient ? {
                                      scale: [1, 1.1, 1],
                                      backgroundColor: ["rgba(180, 83, 9, 0.2)", "rgba(180, 83, 9, 0.4)", "rgba(180, 83, 9, 0.2)"]
                                    } : {}}
                                    transition={{ duration: 0.8 }}
                                  >
                                    q{qIndex + 1}: {isRevealedQuotient || isCurrentQuotient ? quotient : '?'}
                                  </motion.span>
                                </th>
                              );
                            })}
                            <th className="arrow-cell">⇒MCD(A,B) = r{process.remainders.length}</th>
                          </tr>
                        </thead>
                        
                        <tbody>
                          {/* Fila Principal - A y B EN EL CENTRO */}
                          <tr className="main-numbers-row">
                            <td className="side-label">A</td>
                            <td className="main-number left">{process.originalA}</td>
                            <td className="main-number right">{process.originalB}</td>
                            {/* Generar las columnas siguientes basadas en los pasos */}
                            {process.steps.slice(1).map((step, stepIndex) => {
                              if (stepIndex === 0) return null; // Ya tenemos A y B
                              
                              const isCurrentStep = processIndex === currentProcessIndex && 
                                                  stepIndex === (processSteps[processIndex] || 1) - 1;
                              const isRevealedStep = processIndex < currentProcessIndex || 
                                                   (processIndex === currentProcessIndex && 
                                                    stepIndex < (processSteps[processIndex] || 1) - 1);
                              
                              return (
                                <td key={stepIndex} className="next-number">
                                  <motion.span
                                    className={`number-cell modern ${
                                      isCurrentStep ? 'current' : isRevealedStep ? 'revealed' : 'hidden'
                                    }`}
                                    animate={isCurrentStep ? {
                                      scale: [1, 1.05, 1]
                                    } : {}}
                                    transition={{ duration: 0.6 }}
                                  >
                                    {isRevealedStep || isCurrentStep ? step.divisor : '?'}
                                  </motion.span>
                                </td>
                              );
                            })}
                            <td className="side-label">B</td>
                          </tr>
                          
                          {/* Fila de Residuos - ABAJO */}
                          <tr className="remainders-row">
                            <td className="side-label">Residuos</td>
                            {process.remainders.map((remainder, rIndex) => {
                              const isCurrentRemainder = processIndex === currentProcessIndex && 
                                                       rIndex === (processSteps[processIndex] || 1) - 1;
                              const isRevealedRemainder = processIndex < currentProcessIndex || 
                                                        (processIndex === currentProcessIndex && 
                                                         rIndex < (processSteps[processIndex] || 1) - 1);
                              const isMCD = remainder === 0 && rIndex === process.remainders.length - 1;
                              
                              return (
                                <td key={rIndex} className="remainder-header">
                                  <motion.span
                                    className={`remainder-cell modern ${
                                      isMCD ? 'mcd-final' : ''
                                    } ${isCurrentRemainder ? 'current' : isRevealedRemainder ? 'revealed' : 'hidden'}`}
                                    animate={isCurrentRemainder ? {
                                      scale: [1, 1.1, 1],
                                      backgroundColor: isMCD ? 
                                        ["rgba(34, 197, 94, 0.3)", "rgba(34, 197, 94, 0.5)", "rgba(34, 197, 94, 0.3)"] :
                                        ["rgba(156, 163, 175, 0.2)", "rgba(156, 163, 175, 0.4)", "rgba(156, 163, 175, 0.2)"]
                                    } : {}}
                                    transition={{ duration: 0.8 }}
                                  >
                                    r{rIndex + 1}: {isRevealedRemainder || isCurrentRemainder ? remainder : '?'}
                                  </motion.span>
                                </td>
                              );
                            })}
                            <td className="final-indicator">
                              {processIndex < currentProcessIndex && (
                                <motion.span
                                  className="mcd-final-result"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.6, delay: 0.5 }}
                                >
                                  = {process.mcd}
                                </motion.span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Explicación del paso actual */}
                  {processIndex === currentProcessIndex && currentStep >= 0 && process.steps[currentStep] && (
                    <motion.div 
                      className="current-step-explanation modern"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="step-detail modern">
                        <span className="step-number modern">Paso {currentStep + 1}</span>
                        <span className="step-operation modern">{process.steps[currentStep].operation}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultado Final */}
      <AnimatePresence>
        {result !== null && (
          <motion.div 
            className="final-result-section modern"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="result-content modern">
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                🎯 Resultado Final
              </motion.h3>
              <motion.div 
                className="final-mcd-formula modern"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                MCD({allProcesses.originalNumbers?.join(', ')}) = 
                <motion.span 
                  className="final-mcd-value modern"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {result}
                </motion.span>
              </motion.div>
              <motion.p 
                className="result-explanation modern"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                El Máximo Común Divisor de los números ingresados es <strong>{result}</strong>.
                Este es el mayor número que divide exactamente a todos los números dados.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resumen de Procesos */}
      {allProcesses?.processes && allProcesses.processes.length > 1 && (
        <motion.div 
          className="processes-summary modern"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4>📊 Resumen de Procesos</h4>
          <div className="processes-timeline modern">
            {allProcesses.processes.map((process, index) => (
              <motion.div
                key={index}
                className={`process-summary modern ${
                  index === currentProcessIndex ? 'current' : 
                  index < currentProcessIndex ? 'completed' : 'pending'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <motion.div 
                  className="process-number modern"
                  animate={index === currentProcessIndex ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {index + 1}
                </motion.div>
                <div className="process-info modern">
                  <div className="process-title modern">
                    MCD({process.inputNumbers.join(', ')}) = {index < currentProcessIndex ? process.mcd : '?'}
                  </div>
                  <div className="process-steps modern">
                    {process.steps.length - 1} pasos de división
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EuclidesVisualizerModern;
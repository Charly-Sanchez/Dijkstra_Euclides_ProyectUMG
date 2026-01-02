import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./DijkstraVisualizerModern.css";

const DijkstraVisualizerModern = ({
  selectedStart,
  selectedEnd,
  setSelectedStart,
  setSelectedEnd,
  isRunning,
  setIsRunning
}) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [distances, setDistances] = useState({});
  const [visited, setVisited] = useState(new Set());
  const [currentNode, setCurrentNode] = useState(null);
  const [shortestPath, setShortestPath] = useState([]);
  const [previous, setPrevious] = useState({});
  const [speed, setSpeed] = useState(1000);
  const [dynamicLabels, setDynamicLabels] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAction, setEditAction] = useState(null); // 'addNode', 'addEdge', 'deleteNode', 'deleteEdge', 'editEdge'
  const [newNodeId, setNewNodeId] = useState("");
  const [selectedNodeForEdge, setSelectedNodeForEdge] = useState(null);
  const [edgeWeight, setEdgeWeight] = useState("");
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const sampleGraph = {
    nodes: [
      { id: "A", x: 140, y: 100 },
      { id: "B", x: 340, y: 60 },
      { id: "C", x: 540, y: 100 },
      { id: "D", x: 140, y: 260 },
      { id: "E", x: 340, y: 200 },
      { id: "F", x: 540, y: 260 },
      { id: "G", x: 340, y: 360 }
    ],
    edges: [
      { source: "A", target: "B", weight: 4 },
      { source: "A", target: "D", weight: 2 },
      { source: "B", target: "C", weight: 3 },
      { source: "B", target: "E", weight: 1 },
      { source: "C", target: "F", weight: 2 },
      { source: "D", target: "E", weight: 5 },
      { source: "E", target: "F", weight: 2 },
      { source: "D", target: "G", weight: 3 },
      { source: "E", target: "G", weight: 1 },
      { source: "F", target: "G", weight: 4 },
      { source: "A", target: "E", weight: 6 },
      { source: "C", target: "E", weight: 3 }
    ]
  };

  useEffect(() => {
    setNodes(sampleGraph.nodes);
    setEdges(sampleGraph.edges);
    initializeDistances();
  }, []);

  const initializeDistances = () => {
    const dist = {};
    const prev = {};
    sampleGraph.nodes.forEach(node => {
      dist[node.id] = Infinity;
      prev[node.id] = null;
    });
    setDistances(dist);
    setPrevious(prev);
    setVisited(new Set());
    setCurrentNode(null);
    setShortestPath([]);
    setDynamicLabels([]);
    setSteps([]);
  };

  const runDijkstraAlgorithm = async () => {
    if (!selectedStart || !selectedEnd) {
      alert("Por favor selecciona nodos de inicio y destino");
      return;
    }

    setIsRunning(true);
    initializeDistances();

    const dist = {};
    const prev = {};
    const unvisited = new Set(nodes.map(n => n.id));
    const visitedNodes = new Set();
    const stepList = [];

    // Inicialización con mensajes descriptivos
    nodes.forEach(n => (dist[n.id] = Infinity));
    dist[selectedStart] = 0;
    
    stepList.push(`🚀 Iniciando algoritmo de Dijkstra desde ${selectedStart} hacia ${selectedEnd}`);
    stepList.push(`📊 Distancias iniciales: ${selectedStart}=0, resto=∞ • Todos los nodos marcados como no visitados`);
    setSteps([...stepList]);

    while (unvisited.size > 0) {
      let current = null;
      let minDistance = Infinity;
      for (const nodeId of unvisited) {
        if (dist[nodeId] < minDistance) {
          minDistance = dist[nodeId];
          current = nodeId;
        }
      }
      if (current === null || dist[current] === Infinity) break;

      setCurrentNode(current);
      unvisited.delete(current);
      visitedNodes.add(current);
      setVisited(new Set(visitedNodes));

      stepList.push(`🎯 Procesando nodo ${current} • Distancia mínima: ${dist[current]} • Marcado como visitado`);
      setSteps([...stepList]);

      if (current === selectedEnd) break;

      const neighbors = edges.filter(
        edge => edge.source === current || edge.target === current
      );

      stepList.push(`🔍 Examinando vecinos de ${current}: ${neighbors.map(e => e.source === current ? e.target : e.source).filter(n => !visitedNodes.has(n)).join(', ') || 'ninguno disponible'}`);
      setSteps([...stepList]);

      for (const edge of neighbors) {
        const neighbor = edge.source === current ? edge.target : edge.source;
        if (visitedNodes.has(neighbor)) {
          stepList.push(`❌ Saltando ${neighbor} • Ya visitado anteriormente`);
          setSteps([...stepList]);
          continue;
        }

        const newDist = dist[current] + edge.weight;
        const currentDist = dist[neighbor] === Infinity ? '∞' : dist[neighbor];
        
        if (newDist < dist[neighbor]) {
          dist[neighbor] = newDist;
          prev[neighbor] = current;
          setDistances({ ...dist });
          setPrevious({ ...prev });
          stepList.push(`✅ Relajando arista ${current}→${neighbor} • Costo: ${edge.weight} • Nueva distancia: ${currentDist} → ${newDist} • Mejor camino encontrado vía ${current}`);
          setSteps([...stepList]);

          // 💬 etiqueta dinámica con animación
          setDynamicLabels(prevLabels => {
            const updated = prevLabels.filter(
              l => !(l.from === current && l.to === neighbor)
            );
            return [
              ...updated,
              { from: current, to: neighbor, cost: newDist }
            ];
          });
        } else {
          stepList.push(`⚖️ Evaluando ${current}→${neighbor} • Costo: ${edge.weight} • Nueva distancia: ${newDist} vs actual: ${currentDist} • Mantener distancia actual (mejor camino)`);
          setSteps([...stepList]);
        }
        await new Promise(r => setTimeout(r, speed * 0.4));
      }
      await new Promise(r => setTimeout(r, speed * 0.5));
    }

    // Construir el camino más corto
    const path = [];
    let curr = selectedEnd;
    while (curr) {
      path.unshift(curr);
      curr = prev[curr];
    }

    stepList.push(`🎯 ¡Algoritmo completado! Construyendo camino más corto hacia ${selectedEnd}`);
    if (dist[selectedEnd] === Infinity) {
      stepList.push(`❌ No existe camino desde ${selectedStart} hacia ${selectedEnd}`);
    } else {
      stepList.push(`🛤️ Camino óptimo encontrado: ${path.join(' → ')} • Distancia total: ${dist[selectedEnd]} • Número de saltos: ${path.length - 1}`);
    }
    stepList.push(`✨ Resumen: Se visitaron ${visitedNodes.size} nodos de ${nodes.length} • Tiempo de ejecución: O(V²) • Camino garantizado como óptimo`);
    setSteps([...stepList]);

    setShortestPath(path);
    setCurrentNode(null);
    setIsRunning(false);
  };

  const handleNodeClick = nodeId => {
    if (isRunning || draggingNode) return;
    
    // Modo edición
    if (isEditMode) {
      if (editAction === 'deleteNode') {
        deleteNode(nodeId);
      } else if (editAction === 'addEdge') {
        if (!selectedNodeForEdge) {
          setSelectedNodeForEdge(nodeId);
        } else if (selectedNodeForEdge !== nodeId) {
          addEdge(selectedNodeForEdge, nodeId);
          setSelectedNodeForEdge(null);
        }
      }
      return;
    }
    
    // Modo normal (selección de inicio/destino)
    if (!selectedStart) setSelectedStart(nodeId);
    else if (!selectedEnd && nodeId !== selectedStart) setSelectedEnd(nodeId);
    else {
      setSelectedStart(nodeId);
      setSelectedEnd(null);
      initializeDistances();
    }
  };

  // Funciones de arrastrar nodos
  const handleMouseDown = (nodeId, e) => {
    if (isRunning || (isEditMode && editAction)) return;
    
    const node = nodes.find(n => n.id === nodeId);
    const svg = e.currentTarget.ownerSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    
    setDraggingNode(nodeId);
    setDragOffset({
      x: svgP.x - node.x,
      y: svgP.y - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingNode) return;
    
    requestAnimationFrame(() => {
      const svg = e.currentTarget;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      
      setNodes(prevNodes => prevNodes.map(node => 
        node.id === draggingNode 
          ? { 
              ...node, 
              x: Math.max(30, Math.min(670, svgP.x - dragOffset.x)),
              y: Math.max(30, Math.min(430, svgP.y - dragOffset.y))
            }
          : node
      ));
    });
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  // Funciones de edición del grafo
  const addNode = () => {
    if (!newNodeId || nodes.find(n => n.id === newNodeId)) {
      alert("ID inválido o ya existe");
      return;
    }
    const newNode = {
      id: newNodeId,
      x: 300 + Math.random() * 100,
      y: 200 + Math.random() * 100,
      isNew: true
    };
    setNodes([...nodes, newNode]);
    
    // Remover flag después de la animación
    setTimeout(() => {
      setNodes(prev => prev.map(n => 
        n.id === newNodeId ? { ...n, isNew: false } : n
      ));
    }, 600);
    
    setNewNodeId("");
    setEditAction(null);
  };

  const deleteNode = (nodeId) => {
    // Marcar como eliminándose para animación
    setNodes(nodes.map(n => 
      n.id === nodeId ? { ...n, isDeleting: true } : n
    ));
    
    // Eliminar después de la animación
    setTimeout(() => {
      setNodes(prev => prev.filter(n => n.id !== nodeId));
      setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    }, 400);
  };

  const addEdge = (source, target) => {
    const weight = parseInt(edgeWeight);
    if (!weight || weight <= 0) {
      alert("Peso inválido");
      return;
    }
    const edgeExists = edges.find(
      e => (e.source === source && e.target === target) || 
           (e.source === target && e.target === source)
    );
    if (edgeExists) {
      alert("La arista ya existe");
      return;
    }
    setEdges([...edges, { source, target, weight, isNew: true }]);
    
    // Remover flag después de la animación
    setTimeout(() => {
      setEdges(prev => prev.map(e => 
        (e.source === source && e.target === target) || (e.source === target && e.target === source)
          ? { ...e, isNew: false } : e
      ));
    }, 600);
    
    setEdgeWeight("");
    setEditAction(null);
  };

  const deleteEdge = (source, target) => {
    // Marcar como eliminándose para animación
    setEdges(edges.map(e => 
      ((e.source === source && e.target === target) || (e.source === target && e.target === source))
        ? { ...e, isDeleting: true } : e
    ));
    
    // Eliminar después de la animación
    setTimeout(() => {
      setEdges(edges.filter(
        e => !((e.source === source && e.target === target) || 
               (e.source === target && e.target === source))
      ));
    }, 400);
  };

  const handleEdgeClick = (edge, e) => {
    e.stopPropagation();
    if (isEditMode && editAction === 'deleteEdge') {
      deleteEdge(edge.source, edge.target);
    } else if (isEditMode && editAction === 'editEdge') {
      const newWeight = prompt(`Nuevo peso para ${edge.source}-${edge.target}:`, edge.weight);
      if (newWeight && parseInt(newWeight) > 0) {
        // Marcar como editada para animación
        setEdges(edges.map(e => 
          ((e.source === edge.source && e.target === edge.target) || 
           (e.source === edge.target && e.target === edge.source))
            ? { ...e, weight: parseInt(newWeight), isEdited: true }
            : e
        ));
        
        // Remover flag después de la animación
        setTimeout(() => {
          setEdges(prev => prev.map(e => 
            ((e.source === edge.source && e.target === edge.target) || 
             (e.source === edge.target && e.target === edge.source))
              ? { ...e, isEdited: false } : e
          ));
        }, 600);
      }
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setEditAction(null);
    setSelectedNodeForEdge(null);
    setEdgeWeight("");
    setNewNodeId("");
  };

  const getNodeClass = nodeId => {
    if (nodeId === selectedStart) return "start";
    if (nodeId === selectedEnd) return "end";
    if (nodeId === currentNode) return "current";
    if (visited.has(nodeId)) return "visited";
    if (shortestPath.includes(nodeId)) return "path";
    return "default";
  };

  return (
    <div className="dijkstra-workspace">
      {/* Controles superiores */}
      <div className="top-controls">
        <div className="control-section">
          <h3>⚙️ Control del Algoritmo</h3>
          <div className="control-buttons">
            <button
              className="btn primary"
              disabled={isRunning || !selectedStart || !selectedEnd || isEditMode}
              onClick={runDijkstraAlgorithm}
            >
              {isRunning ? "🔄 Ejecutando..." : "▶️ Iniciar Dijkstra"}
            </button>
            <button className="btn secondary" disabled={isRunning || isEditMode} onClick={initializeDistances}>
              🔄 Reiniciar
            </button>
            <button 
              className={`btn ${isEditMode ? 'warning' : 'edit'}`}
              disabled={isRunning}
              onClick={toggleEditMode}
            >
              {isEditMode ? "✅ Finalizar Edición" : "✏️ Editar Grafo"}
            </button>
            <div className="speed-control">
              <label>⚡ Velocidad:</label>
              <input
                type="range"
                min="300"
                max="2000"
                step="100"
                value={speed}
                onChange={e => setSpeed(parseInt(e.target.value))}
                disabled={isRunning}
              />
              <span className="speed-value">{speed}ms</span>
            </div>
          </div>
        </div>
        
        <div className="selection-info">
          <div className="node-status">
            {isEditMode && !editAction && "✏️ Modo edición activado - Selecciona una acción"}
            {isEditMode && editAction === 'addNode' && "➕ Ingresa el ID del nuevo nodo"}
            {isEditMode && editAction === 'addEdge' && !selectedNodeForEdge && "🔗 Selecciona el primer nodo"}
            {isEditMode && editAction === 'addEdge' && selectedNodeForEdge && `🔗 Selecciona el segundo nodo (origen: ${selectedNodeForEdge})`}
            {isEditMode && editAction === 'deleteNode' && "🗑️ Haz clic en el nodo a eliminar"}
            {isEditMode && editAction === 'deleteEdge' && "🗑️ Haz clic en la arista a eliminar"}
            {isEditMode && editAction === 'editEdge' && "✏️ Haz clic en la arista a editar"}
            {!isEditMode && !selectedStart && "📍 Selecciona el nodo inicial"}
            {!isEditMode && selectedStart && !selectedEnd && "🎯 Selecciona el nodo destino"}
            {!isEditMode && selectedStart && selectedEnd && !isRunning && "✅ Listo para ejecutar"}
          </div>
          {selectedStart && !isEditMode && (
            <div className="selected-nodes">
              <span className="node-selection start">Inicio: {selectedStart}</span>
              {selectedEnd && <span className="node-selection end">Destino: {selectedEnd}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Panel de edición */}
      {isEditMode && (
        <motion.div 
          className="edit-panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3>🛠️ Herramientas de Edición</h3>
          <div className="edit-actions">
            <button 
              className={`edit-btn ${editAction === 'addNode' ? 'active' : ''}`}
              onClick={() => setEditAction(editAction === 'addNode' ? null : 'addNode')}
            >
              ➕ Añadir Nodo
            </button>
            <button 
              className={`edit-btn ${editAction === 'deleteNode' ? 'active' : ''}`}
              onClick={() => setEditAction(editAction === 'deleteNode' ? null : 'deleteNode')}
            >
              🗑️ Eliminar Nodo
            </button>
            <button 
              className={`edit-btn ${editAction === 'addEdge' ? 'active' : ''}`}
              onClick={() => {
                setEditAction(editAction === 'addEdge' ? null : 'addEdge');
                setSelectedNodeForEdge(null);
              }}
            >
              🔗 Añadir Arista
            </button>
            <button 
              className={`edit-btn ${editAction === 'deleteEdge' ? 'active' : ''}`}
              onClick={() => setEditAction(editAction === 'deleteEdge' ? null : 'deleteEdge')}
            >
              ✂️ Eliminar Arista
            </button>
            <button 
              className={`edit-btn ${editAction === 'editEdge' ? 'active' : ''}`}
              onClick={() => setEditAction(editAction === 'editEdge' ? null : 'editEdge')}
            >
              ✏️ Editar Peso
            </button>
          </div>

          {editAction === 'addNode' && (
            <div className="edit-form">
              <input 
                type="text" 
                placeholder="ID del nodo (ej: H)" 
                value={newNodeId}
                onChange={(e) => setNewNodeId(e.target.value.toUpperCase())}
                maxLength={2}
              />
              <button className="btn primary" onClick={addNode}>Crear Nodo</button>
            </div>
          )}

          {editAction === 'addEdge' && selectedNodeForEdge && (
            <div className="edit-form">
              <input 
                type="number" 
                placeholder="Peso de la arista" 
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
                min="1"
              />
            </div>
          )}
        </motion.div>
      )}

      <div className="main-content">
        {/* Panel del grafo */}
        <motion.div
          className="graph-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
        <svg 
          className="graph-svg" 
          width="700" 
          height="460"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {edges.map((edge, index) => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;

            const isInPath =
              shortestPath.includes(edge.source) &&
              shortestPath.includes(edge.target) &&
              Math.abs(
                shortestPath.indexOf(edge.source) -
                  shortestPath.indexOf(edge.target)
              ) === 1;

            const label = dynamicLabels.find(
              l =>
                (l.from === edge.source && l.to === edge.target) ||
                (l.from === edge.target && l.to === edge.source)
            );

            return (
              <motion.g 
                key={index}
                initial={edge.isNew ? { opacity: 0, scale: 0 } : false}
                animate={edge.isDeleting 
                  ? { opacity: 0, scale: 0 } 
                  : { opacity: 1, scale: 1 }
                }
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <motion.line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className={`edge ${isInPath ? "path-edge" : ""} ${isEditMode ? "editable" : ""}`}
                  strokeWidth={isInPath ? 4 : 2}
                  animate={{
                    stroke: isInPath ? "#22c55e" : edge.isEdited ? "#FFD700" : "#6b7280",
                    strokeWidth: edge.isEdited ? 5 : (isInPath ? 4 : 2)
                  }}
                  transition={{ duration: 0.4 }}
                  onClick={(e) => handleEdgeClick(edge, e)}
                  style={{ cursor: isEditMode ? 'pointer' : 'default' }}
                />
                <motion.text
                  x={(source.x + target.x) / 2}
                  y={(source.y + target.y) / 2 - 10}
                  className="edge-weight"
                  textAnchor="middle"
                  onClick={(e) => handleEdgeClick(edge, e)}
                  style={{ cursor: isEditMode ? 'pointer' : 'default' }}
                  animate={edge.isEdited ? {
                    scale: [1, 1.3, 1],
                    color: ["#C9D1D9", "#FFD700", "#C9D1D9"]
                  } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {edge.weight}
                </motion.text>

                <AnimatePresence>
                  {label && (
                    <motion.text
                      key={`${label.from}-${label.to}`}
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 25}
                      className="dynamic-edge-label"
                      textAnchor="middle"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {`${label.from}→${label.to} (${label.cost})`}
                    </motion.text>
                  )}
                </AnimatePresence>
              </motion.g>
            );
          })}

          {nodes.map(node => (
            <motion.g 
              key={node.id}
              initial={node.isNew ? { scale: 0, opacity: 0 } : false}
              animate={node.isDeleting 
                ? { scale: 0, opacity: 0, rotate: 180 } 
                : { scale: 1, opacity: 1, rotate: 0 }
              }
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="28"
                className={`node ${getNodeClass(node.id)} ${selectedNodeForEdge === node.id ? 'selected-for-edge' : ''} ${draggingNode === node.id ? 'dragging' : ''}`}
                onClick={() => handleNodeClick(node.id)}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                whileHover={draggingNode ? {} : { scale: 1.1 }}
                whileTap={draggingNode ? {} : { scale: 0.95 }}
                animate={node.isNew ? {
                  scale: [0, 1.2, 1],
                  boxShadow: [
                    "0 0 0px rgba(255, 215, 0, 0)",
                    "0 0 20px rgba(255, 215, 0, 0.8)",
                    "0 0 0px rgba(255, 215, 0, 0)"
                  ]
                } : {}}
                style={{ 
                  cursor: draggingNode === node.id ? 'grabbing' : (isEditMode && !editAction) || (!isEditMode) ? 'grab' : 'pointer'
                }}
              />
              <motion.text
                x={node.x}
                y={node.y + 5}
                className="node-label"
                textAnchor="middle"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
                animate={node.isNew ? {
                  scale: [0, 1.2, 1]
                } : {}}
              >
                {node.id}
              </motion.text>
            </motion.g>
          ))}
        </svg>
      </motion.div>

        {/* Roadbook - Pasos del Algoritmo */}
        <div className="roadbook-panel">
          <div className="roadbook-header">
            <h2>📋 Roadbook de Dijkstra</h2>
            <div className="step-counter">
              {steps.length > 0 && (
                <>
                  <span>{steps.length} pasos registrados</span>
                  {steps.length > 8 && (
                    <span className="scroll-indicator">↓ Scroll para ver más</span>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="roadbook-content">
            {steps.length === 0 ? (
              <div className="empty-roadbook">
                <div className="empty-icon">🗺️</div>
                <p>El roadbook se llenará paso a paso durante la ejecución del algoritmo</p>
                <p>Cada decisión, cálculo y resultado será documentado aquí</p>
              </div>
            ) : (
              <div className="steps-roadbook">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="roadbook-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <div className="step-text">{step}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DijkstraVisualizerModern;

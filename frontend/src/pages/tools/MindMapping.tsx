import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
import html2canvas from 'html2canvas';
import { saveSvgAsPng } from 'save-svg-as-png';

interface MindNode {
  id: string;
  x: number;
  y: number;
  text: string;
  connections: string[];
  color: string;
  collapsed: boolean;
}

const Node = ({ node, updateNode, connectNodes, deleteNode, transform, isConnecting }: {
  node: MindNode;
  updateNode: (id: string, updates: Partial<MindNode>) => void;
  connectNodes: (id: string) => void;
  deleteNode: (id: string) => void;
  transform: { x: number; y: number; k: number };
  isConnecting: boolean;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'node',
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        transform: `scale(${transform.k})`,
        transformOrigin: '0 0',
        backgroundColor: node.color,
        opacity: isDragging ? 0.7 : 1,
        zIndex: isDragging ? 1000 : 1,
      }}
      className={`w-48 h-24 rounded-lg p-4 shadow-lg cursor-move transition-transform ${
        isConnecting ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="w-full h-full overflow-hidden">{node.text}</div>
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          onClick={() => connectNodes(node.id)}
          className={`w-6 h-6 rounded-full text-white ${
            isConnecting ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          {isConnecting ? '✓' : '+'}
        </button>
        <button
          onClick={() => updateNode(node.id, { color: getRandomColor() })}
          className="w-6 h-6 rounded-full border-2 border-gray-300"
        />
        <button
          onClick={() => deleteNode(node.id)}
          className="w-6 h-6 bg-red-500 rounded-full text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const MindMap = () => {
  const [nodes, setNodes] = useState<MindNode[]>([]);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMinimap, setShowMinimap] = useState(true);
  const [useForceLayout, setUseForceLayout] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Zoom initialization
  useEffect(() => {
    if (containerRef.current && svgRef.current) {
      const zoomBehavior = zoom()
        .scaleExtent([0.1, 5])
        .on('zoom', (event) => {
          setTransform(event.transform);
        });

      select(svgRef.current).call(zoomBehavior as any);
    }
  }, []);

  // Force layout simulation
  const simulation = useMemo(() => {
    return forceSimulation<MindNode>()
      .force('charge', forceManyBody().strength(-1000))
      .force('link', forceLink().id(d => (d as MindNode).id))
      .force('x', forceX().strength(0.05))
      .force('y', forceY().strength(0.05));
  }, []);

  useEffect(() => {
    if (useForceLayout) {
      simulation.nodes(nodes).on('tick', () => {
        setNodes([...nodes]);
      });

      simulation.force<forceLink<MindNode, any>>('link')?.links(
        nodes.flatMap(node => 
          node.connections.map(targetId => ({
            source: node.id,
            target: targetId
          }))
      ));

      simulation.alpha(0.3).restart();
    }
    return () => simulation.stop();
  }, [nodes, useForceLayout]);

  const createNode = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (clientX - rect.left - transform.x) / transform.k;
    const y = (clientY - rect.top - transform.y) / transform.k;

    const newNode: MindNode = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      text: 'New Idea',
      connections: [],
      color: getRandomColor(),
      collapsed: false,
    };

    setNodes(prev => [...prev, newNode]);
  }, [transform]);

  const updateNodePosition = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, x, y } : node
    ));
  }, []);

  const deleteNode = useCallback((id: string) => {
    setNodes(prev => 
      prev.filter(node => node.id !== id)
         .map(node => ({
           ...node,
           connections: node.connections.filter(connId => connId !== id)
         }))
    );
  }, []);

  const exportAsImage = async () => {
    if (containerRef.current) {
      const canvas = await html2canvas(containerRef.current);
      const link = document.createElement('a');
      link.download = 'mindmap.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const exportAsSVG = () => {
    if (svgRef.current) {
      saveSvgAsPng(svgRef.current, 'mindmap.png', { scale: 2 });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-screen bg-gray-50 overflow-hidden">
        <div className="p-4 bg-white shadow flex gap-4 flex-wrap">
          <button
            onClick={(e) => createNode(e.clientX, e.clientY)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Node (Right Click)
          </button>
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={() => setUseForceLayout(!useForceLayout)}
            className={`px-4 py-2 ${useForceLayout ? 'bg-green-500' : 'bg-gray-500'} text-white rounded`}
          >
            {useForceLayout ? 'Disable Auto Layout' : 'Enable Auto Layout'}
          </button>
          <button
            onClick={exportAsImage}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Export PNG
          </button>
          <button
            onClick={exportAsSVG}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Export SVG
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative w-full h-[calc(100vh-64px)] cursor-grab"
          onContextMenu={(e) => {
            e.preventDefault();
            createNode(e.clientX, e.clientY);
          }}
        >
          <svg ref={svgRef} className="absolute w-full h-full">
            {nodes.flatMap(node =>
              node.connections.map(targetId => {
                const target = nodes.find(n => n.id === targetId);
                if (!target) return null;
                return (
                  <path
                    key={`${node.id}-${targetId}`}
                    d={`M ${node.x + 96} ${node.y + 48} Q ${(node.x + target.x) / 2} ${(node.y + target.y) / 2}, ${target.x + 96} ${target.y + 48}`}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    fill="none"
                    className="hover:stroke-blue-500 cursor-pointer"
                    onClick={() => {
                      setNodes(prev => prev.map(n => 
                        n.id === node.id ? { ...n, connections: n.connections.filter(id => id !== targetId) } : n
                      ));
                    }}
                  />
                );
              })
            )}
          </svg>

          {nodes.map(node => (
            <Node
              key={node.id}
              node={node}
              updateNode={(id, updates) => setNodes(prev => 
                prev.map(n => n.id === id ? { ...n, ...updates } : n)
              )}
              connectNodes={(id) => {
                if (connectingFrom) {
                  setNodes(prev => prev.map(n => 
                    n.id === connectingFrom ? { ...n, connections: [...n.connections, id] } : n
                  ));
                  setConnectingFrom(null);
                } else {
                  setConnectingFrom(id);
                }
              }}
              deleteNode={deleteNode}
              transform={transform}
              isConnecting={connectingFrom === node.id}
            />
          ))}

          {showMinimap && (
            <div className="absolute bottom-4 right-4 w-48 h-48 bg-white shadow-lg border rounded-lg overflow-hidden">
              <svg className="w-full h-full">
                {nodes.map(node => (
                  <circle
                    key={node.id}
                    cx={(node.x / 2000) * 48 + 24}
                    cy={(node.y / 2000) * 48 + 24}
                    r="2"
                    fill={node.color}
                  />
                ))}
              </svg>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

const getRandomColor = () => {
  const colors = ['#fecaca', '#bbf7d0', '#bfdbfe', '#fef08a', '#ddd6fe'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default MindMap;
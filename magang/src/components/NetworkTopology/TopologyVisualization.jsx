import React, { useState, useRef, useEffect } from 'react';

const TopologyVisualization = ({ nodes, connections, onNodeClick, selectedNode }) => {
  const svgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener('wheel', handleWheel);
      svg.addEventListener('mousemove', handleMouseMove);
      svg.addEventListener('mouseup', handleMouseUp);
      svg.addEventListener('mouseleave', handleMouseUp);

      return () => {
        svg.removeEventListener('wheel', handleWheel);
        svg.removeEventListener('mousemove', handleMouseMove);
        svg.removeEventListener('mouseup', handleMouseUp);
        svg.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, pan]);

  const getNodeColor = (type, status) => {
    if (status === 'maintenance') return '#f59e0b';
    if (status === 'error') return '#ef4444';
    
    switch (type) {
      case 'core': return '#2563eb';
      case 'backbone': return '#7c3aed';
      case 'edge': return '#059669';
      case 'peering': return '#ea580c';
      default: return '#6b7280';
    }
  };

  const getConnectionColor = (type) => {
    switch (type) {
      case 'fiber': return '#00ff88';
      case 'backbone': return '#ff6b35';
      default: return '#9ca3af';
    }
  };

  const getConnectionWidth = (bandwidth) => {
    switch (bandwidth) {
      case '100G': return 4;
      case '40G': return 3;
      case '10G': return 2;
      default: return 1;
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        viewBox="0 0 800 600"
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center'
        }}
      >
        {/* Grid Background */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connections */}
        {connections.map((connection, index) => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          if (!fromNode || !toNode) return null;

          return (
            <g key={index}>
              {/* Connection Line */}
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getConnectionColor(connection.type)}
                strokeWidth={getConnectionWidth(connection.bandwidth)}
                strokeDasharray={connection.type === 'backbone' ? '5,5' : '0'}
                opacity="0.8"
              />
              
              {/* Bandwidth Label */}
              <text
                x={(fromNode.x + toNode.x) / 2}
                y={(fromNode.y + toNode.y) / 2 - 5}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-600"
                style={{ fontSize: '10px' }}
              >
                {connection.bandwidth}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const nodeColor = getNodeColor(node.type, node.status);
          
          return (
            <g key={node.id}>
              {/* Node Shadow */}
              <circle
                cx={node.x + 2}
                cy={node.y + 2}
                r="22"
                fill="rgba(0,0,0,0.1)"
                opacity="0.3"
              />
              
              {/* Node Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill={nodeColor}
                stroke={isSelected ? '#3b82f6' : '#ffffff'}
                strokeWidth={isSelected ? '3' : '2'}
                className="cursor-pointer transition-all duration-200 hover:scale-110"
                onClick={() => onNodeClick(node)}
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
              />
              
              {/* Node Icon */}
              <text
                x={node.x}
                y={node.y + 2}
                textAnchor="middle"
                className="text-white text-xs font-bold fill-current"
                style={{ fontSize: '10px' }}
              >
                {node.name.split(' ').map(word => word[0]).join('')}
              </text>
              
              {/* Node Label */}
              <text
                x={node.x}
                y={node.y + 35}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
                style={{ fontSize: '9px' }}
              >
                {node.name}
              </text>
              
              {/* Status Indicator */}
              <circle
                cx={node.x + 15}
                cy={node.y - 15}
                r="4"
                fill={node.status === 'operational' ? '#10b981' : 
                      node.status === 'maintenance' ? '#f59e0b' : '#ef4444'}
                stroke="#ffffff"
                strokeWidth="1"
              />
            </g>
          );
        })}
      </svg>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev * 0.8))}
          className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">Core Router</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <span className="text-gray-600">Backbone Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-gray-600">Edge Router</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            <span className="text-gray-600">Peering Point</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-400"></div>
            <span className="text-gray-600">Fiber Connection</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-orange-500" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-gray-600">Backbone Link</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopologyVisualization;

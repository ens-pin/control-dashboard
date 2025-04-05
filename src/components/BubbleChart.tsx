"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface BubbleData {
  label: string;
  count: number;
  color?: string;
  hash?: string;  // Add hash property for redirect
}

interface BubbleChartProps {
  data: BubbleData[];
  maxBubbleSize?: number;
  width?: number;
  height?: number;
  onBubbleClick?: (hash: string) => void;  // Add click handler
}

interface BubbleNode extends d3.SimulationNodeDatum {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius: number;
  data: BubbleData;
  scale?: number; // For hover animation
}

const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  maxBubbleSize = 160,
  width = 800,
  height = 600,
  onBubbleClick
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [nodes, setNodes] = useState<BubbleNode[]>([]);
  const mouse = useRef({ x: width / 2, y: height / 2 });
  const simulationRef = useRef<d3.Simulation<BubbleNode, undefined> | null>(
    null
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const maxCount = Math.max(...data.map((d) => d.count));

    // Create bubbles with random initial positions for better distribution
    const bubbles: BubbleNode[] = data.map((d) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: (d.count / maxCount) * (maxBubbleSize / 2) + 20,
      data: d,
    }));

    // Create and configure the simulation with improved physics
    const simulation = d3
      .forceSimulation<BubbleNode>(bubbles)
      .force("x", d3.forceX(width / 2).strength(0.01)) // Reduced strength for more natural floating
      .force("y", d3.forceY(height / 2).strength(0.01))
      .force(
        "collision",
        d3
          .forceCollide<BubbleNode>()
          .radius((d) => d.radius + 5) // Increased padding between bubbles
          .strength(0.9) // Strong collision to prevent overlap
          .iterations(3) // More iterations for better collision resolution
      )
      // Add slight repulsion between nodes to keep them separated
      .force("charge", d3.forceManyBody().strength(-10).distanceMax(100))
      .velocityDecay(0.2) // Lower for more persistent movement
      .alphaDecay(0.005) // Slower decay to keep animation going longer
      .on("tick", () => {
        // Create a new array to trigger React re-render
        setNodes([...bubbles]);
      });

    // Enhanced mouse repel force with stronger effect
    simulation.force("repelMouse", () => {
      for (const node of bubbles) {
        const dx = node.x - mouse.current.x;
        const dy = node.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = node.radius + 120; // Increased interaction radius

        if (dist < minDist && dist > 0.1) {
          // Stronger repulsion with smoother falloff
          const strength = 0.8 * Math.pow(1 - dist / minDist, 1.2);
          node.vx = (node.vx || 0) + (dx / dist) * strength;
          node.vy = (node.vy || 0) + (dy / dist) * strength;

          // Reheat the simulation when interacting for more responsive feel
          simulation.alpha(0.3);
        }
      }
    });

    // Add boundary forces to keep bubbles within the container with bouncing
    simulation.force("boundary", () => {
      for (const node of bubbles) {
        // Left boundary
        if (node.x - node.radius < 0) {
          node.vx = Math.abs(node.vx || 0) * 0.8; // Bounce with slight energy loss
          node.x = node.radius + 1;
        }
        // Right boundary
        if (node.x + node.radius > width) {
          node.vx = -Math.abs(node.vx || 0) * 0.8;
          node.x = width - node.radius - 1;
        }
        // Top boundary
        if (node.y - node.radius < 0) {
          node.vy = Math.abs(node.vy || 0) * 0.8;
          node.y = node.radius + 1;
        }
        // Bottom boundary
        if (node.y + node.radius > height) {
          node.vy = -Math.abs(node.vy || 0) * 0.8;
          node.y = height - node.radius - 1;
        }
      }
    });

    const handleMouseMove = (event: MouseEvent) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    svgRef.current?.addEventListener("mousemove", handleMouseMove);

    // Add random motion to keep bubbles floating
    const intervalId = setInterval(() => {
      if (simulation.alpha() < 0.1) {
        bubbles.forEach((node) => {
          // Add small random impulses to keep bubbles moving
          node.vx = (node.vx || 0) + (Math.random() - 0.5) * 0.5;
          node.vy = (node.vy || 0) + (Math.random() - 0.5) * 0.5;
        });
        simulation.alpha(0.2); // Reheat the simulation
      }
    }, 4000); // Add random motion every 4 seconds

    return () => {
      simulation.stop();
      svgRef.current?.removeEventListener("mousemove", handleMouseMove);
      clearInterval(intervalId);
    };
  }, [data, maxBubbleSize, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="bg-transparent rounded-lg mx-auto"
    >
      {/* Enhanced drop shadow filter for 3D look */}
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="300%" height="200%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="4"
            floodColor="#000"
            floodOpacity="0.2"
          />
        </filter>
        <radialGradient
          id="bubbleGradient"
          cx="0.5"
          cy="0.5"
          r="0.5"
          fx="0.25"
          fy="0.25"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Render each bubble */}
      {nodes.map((node, i) => (
        <g
          key={i}
          transform={`translate(${node.x}, ${node.y})`}
          style={{ transition: "transform 0.1s ease-out" }}
          onClick={() => node.data.hash && onBubbleClick && onBubbleClick(node.data.hash)}
          className={node.data.hash && onBubbleClick ? "cursor-pointer" : ""}
        >
          {/* Main bubble */}
          <circle
            r={node.radius}
            fill={node.data.color || "#6D28D9"}
            filter="url(#shadow)"
            style={{ transition: "all 0.2s ease" }}
          />

          {/* Highlight effect for 3D look */}
          <circle
            r={node.radius * 0.8}
            cx={-node.radius * 0.15}
            cy={-node.radius * 0.15}
            fill="url(#bubbleGradient)"
            opacity="0.4"
          />
          {/* Text label only */}
          <text
            textAnchor="middle"
            dy="0.35em"
            fill="#fff"
            fontSize={Math.min(14, node.radius / 5 + 6)}
          >
            {node.data.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default BubbleChart;

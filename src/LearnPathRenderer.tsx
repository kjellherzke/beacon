import { useEffect, useMemo, useState } from "react";

// Idea is to have a router for all files under that path and then display them:
// - Nodes can have subnodes
// - Nodes can have alternatively (preferred) node url, so that the node itself proposes a new node list
//

const nodeHeight = 42;
const nodeWidth = (str: string) => 17 + str.length * 10;

interface Path {
  title: string;
  nodes: PathNode[];
}

interface PathNode {
  name: string;
  generation: number;
  x: number;
  y: number;
  width: number;
  height: number;
  nodes?: PathNode[];
}

const generationColor = (generation: number) =>
  generation == 0
    ? "#D9D9D9"
    : generation == 1
      ? "#999999"
      : generation == 2
        ? "#636363"
        : "#404040";

function SingleNode({ data }: { data: PathNode }) {
  return (
    <div
      className="p-2 border rounded-xl bg-background hover:underline hover:cursor-pointer transition-all"
      style={{
        position: "absolute",
        left: data.x,
        top: data.y,
        color: generationColor(data.generation),
        borderColor: generationColor(data.generation),
      }}
    >
      {data.name}
    </div>
  );
}

interface PathLine {
  from: { x: number; y: number; width: number; height: number };
  to: { x: number; y: number; width: number; height: number };
  generation: number;
}

/* function SingleCurve({ data }: { data: PathLine }) {
  // Calculate the direction vector from the start point to the end point
  const directionVector = [data.to.x - data.from.x, data.to.y - data.from.y];

  // Calculate the magnitude of the direction vector
  const magnitude = Math.sqrt(
    directionVector[0] ** 2 + directionVector[1] ** 2,
  );

  // Calculate the unit direction vector
  const unitDirectionVector = [
    directionVector[0] / magnitude,
    directionVector[1] / magnitude,
  ];

  // Calculate the angle between the x-axis and the direction vector
  const angle = Math.atan2(unitDirectionVector[1], unitDirectionVector[0]);

  // Determine the offset based on the angle
  let offset = Math.sin(angle) * 20; // Adjust the multiplier as needed

  // Adjust the offset for horizontal or vertical lines
  if (Math.abs(directionVector[0]) > Math.abs(directionVector[1])) {
    // Horizontal line, adjust the offset to prevent disappearing
    offset *= 0.5;
  } else if (Math.abs(directionVector[1]) > Math.abs(directionVector[0])) {
    // Vertical line, adjust the offset similarly
    offset *= 0.5;
  }

  // Calculate the control points based on the direction vector and adjusted offset
  const controlPoint1 = [
    data.from.x + unitDirectionVector[0] * 0.25 * magnitude + offset,
    data.from.y + unitDirectionVector[1] * 0.25 * magnitude + offset,
  ];

  const controlPoint2 = [
    data.to.x - unitDirectionVector[0] * 0.25 * magnitude + offset,
    data.to.y - unitDirectionVector[1] * 0.25 * magnitude + offset,
  ];

  // Function to draw the Bezier curve
  const drawBezierCurve = (
    startX: number,
    startY: number,
    controlX1: number,
    controlY1: number,
    controlX2: number,
    controlY2: number,
    endX: number,
    endY: number,
  ) => {
    return (
      <svg
        width="1000px"
        height="1000px"
        style={{
          position: "absolute",
          zIndex: -1,
          width: Math.abs(endX - startX) || 10,
          height: Math.abs(endY - startY) || 10,
          left: data.from.x,
          top: data.from.y,
        }}
      >
        <path
          d={`M ${data.from.width / 2} ${data.from.height / 2} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
          fill="none"
          stroke={generationColor(data.generation)}
          strokeWidth="4"
        />
      </svg>
    );
  };

  return drawBezierCurve(
    data.from.x,
    data.from.y,
    controlPoint1[0],
    controlPoint1[1],
    controlPoint2[0],
    controlPoint2[1],
    data.to.x,
    data.to.y,
  );
} */

const SingleLine = ({ data }: { data: PathLine }) => {
  const totalWidth =
    Math.abs(data.to.x - data.from.x) + data.from.width + data.to.width;
  const totalHeight =
    Math.max(data.from.y, data.to.y) -
    Math.min(data.from.y, data.to.y) +
    data.from.height +
    data.to.height;

  return (
    <svg
      style={{
        width: "100%",
        height: "",
        top: 0,
        left: 0,
        position: "absolute",
        zIndex: -1,
      }}
    >
      <line
        x1={Math.max(0, data.from.x)}
        y1={Math.max(0, data.from.y)}
        x2={Math.min(totalWidth, data.to.x + data.to.width)}
        y2={Math.min(totalHeight, data.to.y + data.to.height)}
        strokeWidth={4}
        stroke={generationColor(data.generation)}
      />
    </svg>
  );
};

function Node({ data }: { data: PathNode }) {
  return (
    <div>
      <SingleNode data={data} />
      <div className="relative w-full h-full">
        {useMemo(
          () =>
            data.nodes
              ?.map((node) => ({
                ...node,
                height: nodeHeight,
                width: nodeWidth(node.name),
              }))
              .map((node, i) => (
                <div key={i}>
                  <Node data={node} />
                  <SingleLine
                    data={{
                      from: data,
                      to: node,
                      generation: node.generation,
                    }}
                  />
                </div>
              )),
          [],
        )}
      </div>
    </div>
  );
}

export default function LearnPathRenderer() {
  const [path, setPath] = useState<Path | null>(null);

  // WORKING CODE FOR GETTING ALL OF DIRECTORY
  /*  useEffect(() => {
    const modules = import.meta.glob(`/public/static/learningpath/*.json`);
    for (const path in modules) {
      modules[path]().then((mod) => {
        console.log(path, mod);
      });
    }
  }); */
  useEffect(() => {
    const modules = import.meta.glob(`/public/static/learningpath/*.json`);
    for (const path in modules) {
      modules[path]().then((mod) => setPath(mod as Path));
    }
  }, []);

  return (
    <div className="h-[30vh] overflow-scroll border border-secondary rounded-xl p-3">
      <div className="relative w-full h-full">
        {useMemo(
          () =>
            path?.nodes
              .map((node) => ({
                ...node,
                height: nodeHeight,
                width: nodeWidth(node.name),
              }))
              .map((node, i) => <Node key={i} data={node} />),
          [path],
        )}
      </div>
    </div>
  );
}

import { ReactPropTypes, useEffect, useMemo, useState } from "react";

// Idea is to have a router for all files under that path and then display them:
// - Nodes can have subnodes
// - Nodes can have alternatively (preferred) node url, so that the node itself proposes a new node list
//

const nodeHeight = 42;
const nodeWidth = (str: string) => 17 + str.length * 10;

interface Path {
  title: string;
  nodes?: PathNode[];
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
      className="py-2 px-4 border-2 rounded-2xl bg-background hover:scale-105 hover:cursor-pointer transition-all whitespace-nowrap"
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

function NodeLine({ data, from }: { data: PathNode; from: PathNode }) {
  return (
    <svg
      style={{
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        position: "absolute",
        zIndex: -1,
      }}
    >
      <line
        x1={from.x + from.width / 2}
        y1={from.y + from.height / 2}
        x2={data.x + data.width / 2}
        y2={data.y + data.height / 2}
        strokeWidth={4}
        stroke={generationColor(data.generation)}
      />
      )),
    </svg>
  );
}

function Node({ data, from }: { data: PathNode; from: PathNode | null }) {
  return (
    <div>
      <SingleNode data={data} />
      {useMemo(
        () =>
          data.nodes?.map((node, i) => (
            <Node key={i} data={node} from={data} />
          )),
        [],
      )}
      {from && <NodeLine data={data} from={from} />}
    </div>
  );
}

function PathRenderer({ path, ...props }: { path: Path | null }) {
  return (
    <div className="absolute w-full h-full" {...props}>
      {useMemo(
        () =>
          path?.nodes?.map((node, i, elements) => (
            <Node key={i} data={node} from={elements[i - 1] || null} />
          )),
        [path],
      )}
    </div>
  );
}

export default function LearnPathRenderer() {
  const [path, setPath] = useState<Path | null>(null);
  const [maxDimensions, setMaxDimensions] = useState<{
    maxX: number;
    maxY: number;
  }>({ maxX: 0, maxY: 0 });

  useEffect(() => {
    const recursiveChangeNodes = (
      nodes: PathNode[],
      generation: number,
    ): PathNode[] | undefined =>
      nodes?.map((n) => ({
        ...n,
        generation,
        height: nodeHeight,
        width: nodeWidth(n.name),
        nodes: n.nodes
          ? recursiveChangeNodes(n.nodes, generation + 1)
          : undefined,
      }));

    const calculateMaxDimensions = (
      nodes: PathNode[] | undefined,
    ): { maxX: number; maxY: number } | null => {
      if (!nodes) return null;

      let maxX = 0;
      let maxY = 0;

      const updateDimensions = (node: PathNode) => {
        if (node.x + node.width > maxX) {
          maxX = node.x + node.width;
        }
        if (node.y + node.height > maxY) {
          maxY = node.y + node.height;
        }
        node.nodes?.forEach(updateDimensions);
      };

      nodes.forEach(updateDimensions);
      return { maxX, maxY };
    };

    const manipulatePath = (path: Path | null): Path | null => {
      if (!path) return null;
      if (!path.nodes) return path;

      const pathNew = { ...path, nodes: recursiveChangeNodes(path.nodes, 0) };
      const dimensions = calculateMaxDimensions(pathNew.nodes);
      if (dimensions) setMaxDimensions(dimensions);
      return pathNew;
    };

    // TODO: This has to be changed later...
    const modules = import.meta.glob("/public/static/learningpath/*.json");
    for (const path in modules) {
      modules[path]().then((mod) => setPath(manipulatePath(mod as Path)));
    }
  }, []);

  return (
    <div className="h-[40rem] w-[50rem] overflow-scroll border-2 border-secondary border-opacity-20 rounded-2xl p-5 pt-16 select-none relative">
      <h3 className="text-center text-2xl font-semibold text-secondary absolute left-0 right-0 top-2">
        {path?.title}
      </h3>
      <PathRenderer
        path={path}
        style={{ width: maxDimensions.maxX, height: maxDimensions.maxY }}
      />
    </div>
  );
}

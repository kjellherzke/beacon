import { useEffect, useMemo, useState } from "react";

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
  markdownUrl: string;
  nodes?: PathNode[];
}

const generationColor = (generation: number) =>
  generation == 0 ? "#F8E16C" : generation == 1 ? "#00C49A" : "#156064";

function SingleNode({
  data,
  setMarkdownUrl,
}: {
  data: PathNode;
  setMarkdownUrl: (url: string) => void;
}) {
  return (
    <div
      onClick={() => setMarkdownUrl(data.markdownUrl)}
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
  const gradientId = `gradient-${Math.random().toString(36).substring(2)}`;

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
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={gradientId}>
          <stop offset="20%" stopColor={generationColor(from.generation)} />
          <stop
            offset="50%"
            stopColor={generationColor(from.generation + 1)}
            opacity={0.2}
          />
          <stop offset="80%" stopColor={generationColor(data.generation)} />
        </linearGradient>
      </defs>
      <line
        x1={from.x + from.width / 2}
        y1={from.y + from.height / 2}
        x2={data.x + data.width / 2}
        y2={data.y + data.height / 2}
        strokeWidth={4}
        // stroke={generationColor(data.generation)}
        stroke={`url(#${gradientId})`}
        strokeDasharray={data.generation > 1 ? "5,5" : "none"}
      />
    </svg>
  );
}

function Node({
  data,
  from,
  setMarkdownUrl,
}: {
  data: PathNode;
  from: PathNode | null;
  setMarkdownUrl: (url: string) => void;
}) {
  return (
    <div>
      <SingleNode setMarkdownUrl={setMarkdownUrl} data={data} />
      {useMemo(
        () =>
          data.nodes?.map((node, i) => (
            <Node
              setMarkdownUrl={setMarkdownUrl}
              key={i}
              data={node}
              from={data}
            />
          )),
        [],
      )}
      {from && <NodeLine data={data} from={from} />}
    </div>
  );
}

function PathRenderer({
  path,
  setMarkdownUrl,
  width,
  height,
}: {
  path: Path | null;
  setMarkdownUrl: (url: string) => void;
  width: number;
  height: number;
}) {
  return (
    <div className="absolute w-full h-full" style={{ width, height }}>
      {useMemo(
        () =>
          path?.nodes?.map((node, i, elements) => (
            <Node
              setMarkdownUrl={setMarkdownUrl}
              key={i}
              data={node}
              from={elements[i - 1] || null}
            />
          )),
        [path],
      )}
    </div>
  );
}

export default function LearnPathVisualRenderer({
  setMarkdownUrl,
}: {
  setMarkdownUrl: (url: string) => void;
}) {
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
    <div className="h-[100%] w-[100%] overflow-scroll border-2 border-secondary border-opacity-20 rounded-2xl p-5 pt-16 select-none relative">
      <h3 className="text-center text-2xl font-semibold text-secondary absolute left-0 right-0 top-2">
        {path?.title}
      </h3>
      <PathRenderer
        path={path}
        setMarkdownUrl={setMarkdownUrl}
        width={maxDimensions.maxX}
        height={maxDimensions.maxY}
      />
    </div>
  );
}

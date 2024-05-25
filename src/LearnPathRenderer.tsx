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

function NodeLine({ data }: { data: PathNode }) {
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
      {useMemo(
        () =>
          data.nodes?.map((node, i) => (
            <line
              key={i}
              x1={data.x + data.width / 2}
              y1={data.y + data.height / 2}
              x2={node.x + node.width / 2}
              y2={node.y + node.height / 2}
              strokeWidth={4}
              stroke={generationColor(data.generation)}
            />
          )),
        [],
      )}
    </svg>
  );
}

function Node({ data }: { data: PathNode }) {
  return (
    <div>
      <SingleNode data={data} />
      <div>
        {useMemo(
          () =>
            data.nodes?.map((node, i) => (
              <div key={i}>
                <Node data={node} />
              </div>
            )),
          [],
        )}
        <NodeLine data={data} />
      </div>
    </div>
  );
}

export default function LearnPathRenderer() {
  const [path, setPath] = useState<Path | null>(null);

  // WORKING CODE FOR GETTING ALL OF DIRECTORY
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

    const manipulatePath = (path: Path | null): Path | null => {
      if (!path) return null;
      return path.nodes
        ? { ...path, nodes: recursiveChangeNodes(path.nodes, 0) }
        : path;
    };

    const modules = import.meta.glob(`/public/static/learningpath/*.json`);
    for (const path in modules) {
      modules[path]().then((mod) => setPath(manipulatePath(mod as Path)));
    }
  }, []);

  return (
    <div className="h-[30rem] w-[50rem] overflow-scroll border-2 border-secondary border-opacity-20 rounded-2xl p-5 select-none">
      <div className="relative w-full h-full">
        {useMemo(
          () =>
            path?.nodes?.map((node, i, elements) => (
              <div key={i}>
                <Node key={i} data={node} />
                {elements.length - 1 > i && (
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
                      key={i}
                      x1={node.x + node.width / 2}
                      y1={node.y + node.height / 2}
                      x2={elements[i + 1].x + elements[i + 1].width / 2}
                      y2={elements[i + 1].y + elements[i + 1].height / 2}
                      strokeWidth={4}
                      stroke={generationColor(node.generation)}
                    />
                  </svg>
                )}
              </div>
            )),
          [path],
        )}
      </div>
    </div>
  );
}

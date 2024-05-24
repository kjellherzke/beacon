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

function Node({ data }: { data: PathNode }) {
  return (
    <div>
      <SingleNode data={data} />
      <div>
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
                </div>
              )),
          [],
        )}
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
              data.nodes
                ?.map((node) => ({
                  ...node,
                  height: nodeHeight,
                  width: nodeWidth(node.name),
                }))
                .map((node, i) => (
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
      </div>
    </div>
  );
}

export default function LearnPathRenderer() {
  const [path, setPath] = useState<Path | null>(null);

  // WORKING CODE FOR GETTING ALL OF DIRECTORY
  useEffect(() => {
    const modules = import.meta.glob(`/public/static/learningpath/*.json`);
    for (const path in modules) {
      modules[path]().then((mod) => setPath(mod as Path));
    }
  }, []);

  return (
    <div className="h-[30rem] overflow-scroll border border-secondary rounded-xl p-5 select-none">
      <div className="relative w-full h-[30rem]">
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

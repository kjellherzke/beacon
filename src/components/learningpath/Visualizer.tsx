// Idea is to have a router for all files under that path and then display them:
// - Nodes can have subnodes
// - Nodes can have alternatively (preferred) node url, so that the node itself proposes a new node list
// - BUT: Nodes can only have either a markdown or a new node url, whereas Node Urls have priority

import tailwind from "../../../tailwind.config";

export interface Path {
  title: string;
  markdownUrl?: string;
  nodes?: PathNode[];

  // new
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface PathNode {
  name: string;
  generation: number;
  x: number;
  y: number;
  width: number;
  height: number;
  markdownUrl?: string;
  nodeUrl?: string;
  nodes?: PathNode[];
}

const generationColor = (generation: number): string =>
  (tailwind.theme.extend.colors.visualGraphs as Record<string, string>)[
    `generation${generation}`
  ];

const toMarkdownUrl = (nodeUrl: string) =>
  nodeUrl.substring(0, nodeUrl.length - 4) + "md";

function SingleNode({
  data,
  setMarkdownUrl,
  setNodeUrl,
}: {
  data: PathNode;
  setMarkdownUrl: (url: string) => void;
  setNodeUrl: (url: string) => void;
}) {
  return (
    <div
      onClick={() => {
        if (data?.nodeUrl) {
          setNodeUrl(data.nodeUrl);
          setMarkdownUrl(toMarkdownUrl(data.nodeUrl));
        } else if (data?.markdownUrl) {
          setMarkdownUrl(data.markdownUrl);
        }
      }}
      className="py-2 px-4 z-[1] absolute border-2 flex items-center space-x-2 rounded-2xl bg-background hover:scale-105 hover:cursor-pointer transition-all whitespace-nowrap"
      style={{
        left: data.x,
        top: data.y,
        borderColor: generationColor(data.generation),
        fontWeight: data.generation == 0 ? 500 : 400,
        color:
          data.generation == 0
            ? tailwind.theme.extend.colors.background
            : generationColor(data.generation),
        backgroundColor:
          data.generation == 0
            ? generationColor(data.generation)
            : tailwind.theme.extend.colors.background,
      }}
    >
      <span>{data.name}</span>
      {data.generation > 0 &&
        (data?.nodeUrl ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            />
          </svg>
        ) : (
          data?.markdownUrl && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          )
        ))}
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
      }}
    >
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={gradientId}>
          <stop offset="40%" stopColor={generationColor(from.generation)} />
          <stop offset="60%" stopColor={generationColor(data.generation)} />
        </linearGradient>
      </defs>
      <line
        x1={from.x + from.width / 2}
        y1={from.y + from.height / 2}
        x2={data.x + data.width / 2}
        y2={data.y + data.height / 2}
        // strokeWidth={from.generation == 0 ? 7 : 5}
        strokeWidth={5}
        // stroke={`url(#${gradientId})`}
        stroke={generationColor(data.generation)}
        // strokeDasharray={data.generation > 1 ? "5,5" : "none"}
      />
    </svg>
  );
}

function Node({
  data,
  from,
  setMarkdownUrl,
  setNodeUrl,
}: {
  data: PathNode;
  from: PathNode | null;
  setMarkdownUrl: (url: string) => void;
  setNodeUrl: (url: string) => void;
}) {
  return (
    <div>
      <SingleNode
        setMarkdownUrl={setMarkdownUrl}
        setNodeUrl={setNodeUrl}
        data={data}
      />
      {data.nodes?.map((node, i) => (
        <Node
          setMarkdownUrl={setMarkdownUrl}
          setNodeUrl={setNodeUrl}
          key={i}
          data={node}
          from={data}
        />
      ))}
      {from && <NodeLine data={data} from={from} />}
    </div>
  );
}

export default function LearnPathVisualRenderer({
  setMarkdownUrl,
  setNodeUrl,
  maxDimensions,
  path,
}: {
  setMarkdownUrl: (url: string) => void;
  setNodeUrl: (url: string) => void;
  maxDimensions: {
    maxX: number;
    maxY: number;
  };
  path: Path;
}) {
  return (
    <div
      key={JSON.stringify(path)}
      className="h-[100%] w-[100%] overflow-scroll border-2 border-secondary bg-background border-opacity-20 rounded-2xl p-5 pt-20 select-none relative"
    >
      <div
        className="absolute w-full h-full"
        style={{
          width: maxDimensions?.maxX || 100,
          height: maxDimensions?.maxY || 100,
        }}
      >
        <Node
          setMarkdownUrl={setMarkdownUrl}
          setNodeUrl={setNodeUrl}
          data={{
            name: path.title,
            generation: 0,
            height: path.height,
            width: path.width,
            x: path.x,
            y: path.y,
            markdownUrl: path.markdownUrl,
          }}
          from={null}
        />
        {path.nodes?.map((node, i, elements) => (
          <Node
            setMarkdownUrl={setMarkdownUrl}
            setNodeUrl={setNodeUrl}
            key={i}
            data={node}
            from={
              i == 0
                ? {
                    name: path.title,
                    generation: 0,
                    height: path.height,
                    width: path.width,
                    x: path.x,
                    y: path.y,
                    markdownUrl: path.markdownUrl,
                  }
                : elements[i - 1]
            }
          />
        ))}
      </div>
    </div>
  );
}

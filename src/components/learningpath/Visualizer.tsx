// Idea is to have a router for all files under that path and then display them:
// - Nodes can have subnodes
// - Nodes can have alternatively (preferred) node url, so that the node itself proposes a new node list
// - BUT: Nodes can only have either a markdown or a new node url, whereas Node Urls have priority

export interface Path {
  title: string;
  markdownUrl?: string;
  nodes?: PathNode[];
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

const generationColor = (generation: number) =>
  generation == 0 ? "#F8E16C" : generation == 1 ? "#00C49A" : "#156064";

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
  } | null;
  path: Path | null;
}) {
  return (
    <div
      key={JSON.stringify(path)}
      className="h-[100%] w-[100%] overflow-scroll border-2 border-secondary border-opacity-20 rounded-2xl p-5 pt-16 select-none relative"
    >
      <h3
        onClick={() => path?.markdownUrl && setMarkdownUrl(path.markdownUrl)}
        className="text-center text-2xl font-semibold text-secondary absolute left-0 right-0 top-2 hover:cursor-pointer"
      >
        {path?.title}
      </h3>
      <div
        className="absolute w-full h-full"
        style={{
          width: maxDimensions?.maxX || 100,
          height: maxDimensions?.maxY || 100,
        }}
      >
        {path?.nodes?.map((node, i, elements) => (
          <Node
            setMarkdownUrl={setMarkdownUrl}
            setNodeUrl={setNodeUrl}
            key={i}
            data={node}
            from={elements[i - 1] || null}
          />
        ))}
      </div>
    </div>
  );
}

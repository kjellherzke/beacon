// Idea is to have a router for all files under that path and then display them:
// - Nodes can have subnodes
// - Nodes can have alternatively (preferred) node url, so that the node itself proposes a new node list
// - BUT: Nodes can only have either a markdown or a new node url, whereas Node Urls have priority

// import { useState } from "react";

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
      className="py-2 px-4 z-[1] absolute border-2 flex items-center space-x-2 rounded-2xl bg-background hover:scale-105 hover:cursor-pointer transition-all whitespace-nowrap"
      style={{
        left: data.x,
        top: data.y,
        color: generationColor(data.generation) + (data?.nodeUrl ? "" : "60"),
        borderColor:
          generationColor(data.generation) + (data?.nodeUrl ? "" : 60),
      }}
    >
      <span>{data.name}</span>
      {data?.nodeUrl && (
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
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      )}
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
          <stop
            offset="20%"
            stopColor={
              generationColor(from.generation) + (data?.nodeUrl ? "" : "60")
            }
          />
          <stop
            offset="50%"
            stopColor={
              generationColor(data.generation + 1) + (data?.nodeUrl ? "" : "60")
            }
            opacity={0.2}
          />
          <stop
            offset="80%"
            stopColor={
              generationColor(data.generation) + (data?.nodeUrl ? "" : "60")
            }
          />
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
      className="h-[100%] w-[100%] overflow-scroll border-2 border-secondary bg-background border-opacity-20 rounded-2xl p-5 pt-16 select-none relative"
    >
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

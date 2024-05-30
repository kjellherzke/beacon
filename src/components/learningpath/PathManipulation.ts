import { Path, PathNode } from "./Visualizer";

const nodeHeight = 42;
const nodeWidth = (str: string) => 17 + str.length * 10;

const recursiveChangeNodes = (
  nodes: PathNode[],
  generation: number,
): PathNode[] | undefined =>
  nodes?.map((n) => ({
    ...n,
    generation,
    height: nodeHeight,
    width: nodeWidth(n.name),
    nodes: n.nodes ? recursiveChangeNodes(n.nodes, generation + 1) : undefined,
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

// TODO: Might lead to errors
export const manipulatePath = (
  path: Path | null,
): [Path | null, { maxX: number; maxY: number } | null] => {
  if (!path) return [null, null];
  if (!path.nodes) return [path, null];

  const pathNew = { ...path, nodes: recursiveChangeNodes(path.nodes, 0) };
  const dimensions = calculateMaxDimensions(pathNew.nodes);
  return [pathNew, dimensions];
};

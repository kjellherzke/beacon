import { useEffect, useState } from "react";
import LearnPathMarkdownPreviewer from "./learningpath/MarkdownPreviewer";
import LearnPathVisualRenderer, {
  Path,
  manipulatePath,
} from "./learningpath/Visualizer";

const startPath = "/public/content/learningpaths/";
const getAbsolutePath = (relativePath: string) =>
  startPath +
  (relativePath.startsWith("/") ? relativePath.slice(1) : relativePath);

export default function Main() {
  const [nodeUrl, setNodeUrl] = useState<string>("/index.json");
  const [path, setPath] = useState<
    [Path | null, { maxX: number; maxY: number } | null]
  >([null, null]);
  const [markdownUrl, setMarkdownUrl] = useState<string>("/index.md");
  const [markdown, setMarkdown] = useState<string | null>(null);

  useEffect(() => {
    const modules = import.meta.glob("/public/content/learningpaths/**/*.json");
    const absolutePath = getAbsolutePath(nodeUrl);

    console.log("Nodes reload:", modules, absolutePath);

    if (modules[absolutePath]) {
      modules[absolutePath]().then((mod) => {
        setPath(manipulatePath(mod as Path));
        console.log("Node path:", path);
      });
    }
  }, [nodeUrl]);

  useEffect(() => {
    const modules = import.meta.glob("/public/content/learningpaths/**/*.md");
    const absolutePath = getAbsolutePath(markdownUrl);

    console.log("Markdown reload:", modules, absolutePath);

    if (modules[absolutePath]) {
      modules[absolutePath]().then((mod: any) => {
        setMarkdown(mod.default);
        console.log(mod);
      });
    }
  }, [markdownUrl]);

  // console.log(markdownUrl, markdown);
  // console.log(nodeUrl, path);

  return (
    <div className="flex justify-between space-x-2 h-[40rem]">
      <LearnPathVisualRenderer
        path={path[0]}
        maxDimensions={path[1]}
        setNodeUrl={setNodeUrl}
        setMarkdownUrl={setMarkdownUrl}
      />
      <LearnPathMarkdownPreviewer markdown={markdown} />
    </div>
  );
}

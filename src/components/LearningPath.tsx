import { useMemo, useState } from "react";
import LearnPathMarkdownPreviewer from "./learningpath/MarkdownPreviewer";
import LearnPathVisualRenderer, { Path } from "./learningpath/Visualizer";
import { manipulatePath } from "./learningpath/PathManipulation";

export default function Main() {
  const [nodeUrl, setNodeUrl] = useState<string>("/index.json");
  const [markdownUrl, setMarkdownUrl] = useState<string>("/index.md");

  const modules = useMemo(() => {
    const importModules = import.meta.glob(
      "/public/content/learningpaths/**/*.{md,json}",
      {
        eager: true,
      },
    );
    return (relativePath: string) =>
      importModules[
        "/public/content/learningpaths/" +
          (relativePath.startsWith("/") ? relativePath.slice(1) : relativePath)
      ];
  }, []);

  const node = useMemo(
    () =>
      modules(nodeUrl)
        ? manipulatePath(modules(nodeUrl) as Path)
        : [null, null],
    [nodeUrl, modules],
  );

  const markdown = useMemo(
    () =>
      modules(markdownUrl)
        ? (modules(markdownUrl) as { default: string }).default
        : null,
    [markdownUrl, modules],
  );

  const [isMarkdownOpen, setMarkdownOpen] = useState(false);

  return (
    <div className="h-[40rem] relative">
      <LearnPathVisualRenderer
        path={node[0]}
        maxDimensions={node[1]}
        setNodeUrl={setNodeUrl}
        setMarkdownUrl={setMarkdownUrl}
      />
      <LearnPathMarkdownPreviewer
        markdown={markdown}
        isOpen={isMarkdownOpen}
        setOpen={setMarkdownOpen}
      />
    </div>
  );
}

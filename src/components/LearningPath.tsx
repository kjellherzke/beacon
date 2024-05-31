import { useMemo, useState } from "react";
import LearnPathMarkdownPreviewer from "./learningpath/MarkdownPreviewer";
import LearnPathVisualRenderer, { Path } from "./learningpath/Visualizer";
import { manipulatePath } from "./learningpath/PathManipulation";

function Tab({
  setGraphFullView,
  isGraphFullView,
  setMarkdownOpen,
  isMarkdownOpen,
}: {
  setGraphFullView: (bool: boolean) => void;
  isGraphFullView: boolean;
  setMarkdownOpen: (bool: boolean) => void;
  isMarkdownOpen: boolean;
}) {
  return (
    <div className="flex items-center space-x-2 absolute top-3 right-3">
      <button
        onClick={() => setGraphFullView(!isGraphFullView)}
        className="border-2 bg-background text-secondary border-slate p-2.5 rounded-2xl"
      >
        {isGraphFullView ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        )}
      </button>
      <button
        onClick={() => setMarkdownOpen(!isMarkdownOpen)}
        className="border-2 bg-background text-secondary border-slate p-2.5 rounded-2xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      </button>
    </div>
  );
}

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

  const [isGraphFullView, setGraphFullView] = useState(false);
  const [isMarkdownOpen, setMarkdownOpen] = useState(false);

  return (
    <div
      style={
        isGraphFullView
          ? {
              position: "fixed",
              top: 4,
              left: 4,
              right: 4,
              bottom: 4,
              width: "auto",
              height: "auto",
            }
          : {}
      }
      className="h-[40rem] relative"
    >
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
      <Tab
        isGraphFullView={isGraphFullView}
        setGraphFullView={setGraphFullView}
        setMarkdownOpen={setMarkdownOpen}
        isMarkdownOpen={isMarkdownOpen}
      />
    </div>
  );
}

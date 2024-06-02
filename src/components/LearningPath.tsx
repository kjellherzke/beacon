import { useMemo, useState } from "react";
import LearnPathMarkdownPreviewer from "./learningpath/MarkdownPreviewer";
import LearnPathVisualRenderer, { Path } from "./learningpath/Visualizer";
import { manipulatePath } from "./learningpath/PathManipulation";

const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

function Tab({
  setGraphFullView,
  isGraphFullView,
  setMarkdownOpen,
  isMarkdownOpen,
  undoNodeLink,
  isUndoDisabled,
}: {
  setGraphFullView: (bool: boolean) => void;
  isGraphFullView: boolean;
  setMarkdownOpen: (bool: boolean) => void;
  isMarkdownOpen: boolean;
  undoNodeLink: () => void;
  isUndoDisabled: boolean;
}) {
  return (
    <div className="flex items-center space-x-3 absolute top-3 right-3">
      <button
        onClick={() => undoNodeLink()}
        disabled={isUndoDisabled}
        className="border-2 bg-background text-secondary border-slate p-2.5 rounded-xl disabled:text-slate"
      >
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
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </button>
      <button
        onClick={() => copyToClipboard(window.location.toString())}
        className="border-2 bg-background text-secondary border-slate p-2 rounded-xl"
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
            d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
          />
        </svg>
      </button>
      <button
        onClick={() => setGraphFullView(!isGraphFullView)}
        className="border-2 bg-background text-secondary border-slate p-2 rounded-xl"
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
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
            />
          </svg>
        )}
      </button>
      <button
        onClick={() => setMarkdownOpen(!isMarkdownOpen)}
        className="border-2 bg-background text-secondary border-slate p-2 rounded-xl"
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
  const nodeParam =
    new URLSearchParams(window.location.search).get("node") || "/index";

  const [nodeUrl, setNodeUrl] = useState<string>(nodeParam + ".json");
  const [markdownUrl, setMarkdownUrl] = useState<string>(nodeParam + ".md");

  const [isGraphFullView, setGraphFullView] = useState(false);
  const [isMarkdownOpen, setMarkdownOpen] = useState(false);

  const modules = useMemo(() => {
    const importModules = import.meta.glob(
      "/public/content/learningpaths/**/*.{md,json}",
      { eager: true },
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

  const markdown = useMemo(() => {
    const md = modules(markdownUrl)
      ? (modules(markdownUrl) as { default: string }).default
      : null;
    return md;
  }, [markdownUrl, modules]);

  const [nodeUrlHistory, setNodeUrlHistory] = useState<string[]>([]);

  const openNewMarkdown = (newMarkdownUrl: string) => {
    setMarkdownUrl(newMarkdownUrl);
    setMarkdownOpen(true);
  };

  const changeNode = (url: string) => {
    setNodeUrlHistory((nodes) => [...nodes, nodeUrl]);
    setNodeUrl(url);
  };

  const revertNode = () => {
    if (nodeUrlHistory.length > 0) {
      setNodeUrl(nodeUrlHistory[nodeUrlHistory.length - 1]);
      const nodes = [...nodeUrlHistory];
      nodes.pop();
      setNodeUrlHistory(nodes);
    }
  };

  return node[0] && node[1] ? (
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
        setNodeUrl={changeNode}
        setMarkdownUrl={openNewMarkdown}
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
        isUndoDisabled={nodeUrlHistory.length == 0}
        undoNodeLink={revertNode}
      />
    </div>
  ) : (
    <p className="border border-secondary px-4 py-2 rounded-xl">
      Sorry, but this visual graph could not be loaded.
    </p>
  );
}

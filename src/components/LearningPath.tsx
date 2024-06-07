import { Dispatch, SetStateAction, useMemo, useState } from "react";
import LearnPathMarkdownPreviewer from "./learningpath/MarkdownPreviewer";
import LearnPathVisualRenderer, { Path } from "./learningpath/Visualizer";
import { manipulatePath } from "./learningpath/PathManipulation";

const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

function Tab({
  setMarkdownOpen,
  isMarkdownOpen,
  undoNodeLink,
  isUndoDisabled,
  linkUrl,
  setVisualZoom,
  zoomStep,
}: {
  setMarkdownOpen: (bool: boolean) => void;
  isMarkdownOpen: boolean;
  undoNodeLink: () => void;
  isUndoDisabled: boolean;
  setVisualZoom: Dispatch<SetStateAction<number>>;
  zoomStep: number;
  linkUrl: string;
}) {
  return (
    <div className="flex items-center space-x-3 absolute top-3 right-3">
      <button
        onClick={() => undoNodeLink()}
        disabled={isUndoDisabled}
        className="p-2.5"
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
      <button onClick={() => copyToClipboard(linkUrl)}>
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
      <button onClick={() => setVisualZoom((zoom: number) => zoom + zoomStep)}>
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
      </button>
      <button onClick={() => setVisualZoom((zoom: number) => zoom - zoomStep)}>
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
      </button>
      <button onClick={() => setMarkdownOpen(!isMarkdownOpen)}>
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

function Footer() {
  return (
    <div className="absolute left-4 bottom-4 right-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img src="/beacon/logo-512x512.png" className="w-5 h-5" />
        <p className="text-secondary font-bold text-xl m-0 p-0">beacon</p>
      </div>
      <div className="flex items-center space-x-2">
        <a
          href="https://github.com/kjellherzke/beacon"
          target="_blank"
          title="Github"
          className="border-slate border p-1.5 rounded-xl"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              fill="currentColor"
              d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function Main({ nodeParam }: { nodeParam: string }) {
  const [nodeUrl, setNodeUrl] = useState<string>(nodeParam + ".json");
  const [markdownUrl, setMarkdownUrl] = useState<string>(nodeParam + ".md");

  const [visualZoom, setVisualZoom] = useState(1);
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
    <div className="fixed top-4 left-4 right-4 bottom-4">
      <LearnPathVisualRenderer
        path={node[0]}
        maxDimensions={node[1]}
        setNodeUrl={changeNode}
        setMarkdownUrl={openNewMarkdown}
        zoom={visualZoom}
      />
      <LearnPathMarkdownPreviewer
        markdown={markdown}
        isOpen={isMarkdownOpen}
        setOpen={setMarkdownOpen}
      />
      <Tab
        setVisualZoom={setVisualZoom}
        zoomStep={0.1}
        setMarkdownOpen={setMarkdownOpen}
        isMarkdownOpen={isMarkdownOpen}
        isUndoDisabled={nodeUrlHistory.length == 0}
        undoNodeLink={revertNode}
        linkUrl={
          window.location.origin +
          window.location.pathname +
          "?node=" +
          nodeUrl.split(".json")[0]
        }
      />
      <Footer />
    </div>
  ) : (
    <p className="border border-red-400 text-red-400 px-4 py-2 m-4 rounded-xl">
      Sorry, but this visual graph could not be loaded.
    </p>
  );
}

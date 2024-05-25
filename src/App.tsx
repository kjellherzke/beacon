import { useState } from "react";
import LearnPathMarkdownPreviewer from "./components/learningpath/MarkdownPreviewer";
import LearnPathVisualRenderer from "./components/learningpath/Visualizer";

function App() {
  const [markdownUrl, setMarkdownUrl] = useState<string | null>(null);

  return (
    <div className="pt-12 px-16">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-2">
          <img src="/beacon/logo-512x512.png" className="w-8 h-8" />
          <h1 className="text-secondary font-bold text-2xl m-0 p-0">beacon</h1>
        </div>
      </div>
      <p className="text-xl mb-8 font-bold">Hello, traveller!</p>
      <div className="flex justify-between space-x-2 h-[40rem]">
        <LearnPathVisualRenderer setMarkdownUrl={setMarkdownUrl} />
        <LearnPathMarkdownPreviewer markdownUrl={markdownUrl} />
      </div>
    </div>
  );
}

export default App;

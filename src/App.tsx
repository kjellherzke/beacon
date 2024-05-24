import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Test from "./assets/md/test.md";

function App() {
  return (
    <>
      <div className="flex items-center justify-between p-4 mb-4 bg-bg border-b border-b-border">
        <div className="flex space-x-2 items-center">
          <img src="/static/beacon-logo.svg" className="h-6" />
          <span className="font-bold text-lg">beacon</span>
        </div>
      </div>
      <div className="px-4">
        <p className="text-xl">Below is an example of markdown</p>
        <Markdown remarkPlugins={[remarkGfm]} children={Test} />
      </div>
    </>
  );
}

export default App;

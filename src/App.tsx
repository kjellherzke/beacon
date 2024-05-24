import LearnPathRenderer from "./LearnPathRenderer";

function App() {
  return (
    <div className="pt-12 px-16">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-2">
          <img src="/logo-512x512.png" className="w-8 h-8" />
          <h1 className="text-secondary font-bold text-2xl">beacon</h1>
        </div>
      </div>
      <p>Below you will have a render of a file...</p>
      <LearnPathRenderer />
    </div>
  );
}

export default App;

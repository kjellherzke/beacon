import LearningPath from "./components/LearningPath";

function App() {
  return (
    <div className="md:pt-12 md:px-16 pt-4 px-3">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-2">
          <img src="/beacon/logo-512x512.png" className="w-7 h-7" />
          <h1 className="text-secondary font-bold text-2xl m-0 p-0">beacon</h1>
        </div>
      </div>
      <p className="text-xl mb-8 font-bold">Hello, traveller!</p>
      <LearningPath />
    </div>
  );
}

export default App;

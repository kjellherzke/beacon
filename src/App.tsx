import LearningPath from "./components/LearningPath";

function App() {
  const nodeParam = new URLSearchParams(window.location.search).get("node");

  return <LearningPath nodeParam={nodeParam || "/index"} />;
}

export default App;

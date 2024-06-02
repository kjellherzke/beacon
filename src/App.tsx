import { useState } from "react";
import LearningPath from "./components/LearningPath";

function App() {
  const nodeParam = new URLSearchParams(window.location.search).get("node");
  const [isLearningPathOpen, setLearningPathOpen] = useState(nodeParam != null);

  return (
    <div className="md:pt-12 pt-4">
      <div className="px-3 md:px-16">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-2">
            <img src="/beacon/logo-512x512.png" className="w-7 h-7" />
            <p className="text-secondary font-bold text-2xl m-0 p-0">beacon</p>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="https://github.com/kjellherzke/beacon"
              target="_blank"
              title="Github"
              className="border-slate border p-1.5 rounded-2xl"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                  fill="currentColor"
                  d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      {isLearningPathOpen ? (
        <div className="px-3 md:px-16">
          <LearningPath nodeParam={nodeParam || "/index"} />
        </div>
      ) : (
        <div>
          <div className="px-3 md:px-16 flex flex-col items-center mb-32">
            <h1 className="text-4xl mb-2 text-center">
              Learn anything and become anyone.
            </h1>
            <h2 className="font-medium text-xl text-center text-secondary mb-20">
              Empower Your Growth: Discover Beacon's No-Login, Privacy-Centric
              Approach
            </h2>
            <button
              className="font-bold text-primary"
              onClick={() => setLearningPathOpen(true)}
            >
              Get started *
            </button>
            <p className="text-secondary mt-2">
              * Free, No Signup Required, Forever Secure
            </p>
          </div>
          <div className="relative border-t border-slate px-3 md:px-16 my-20 pt-10 flex flex-col items-center">
            <div className="top-[-1.25rem] absolute left-0 right-0 z-10">
              <p className="text-center text-secondary mx-auto w-max p-2 rounded-2xl border border-slate bg-background">
                What is it?
              </p>
            </div>
            <p className="w-1/2 text-secondary">
              Dive into a world where learning is limitless and personal growth
              is prioritized. Beacon stands as a beacon of light in the digital
              landscape, offering a unique platform that values your privacy and
              eliminates the need for login hassles. This innovative tool is
              designed to expand your knowledge and enhance your skills, all
              while ensuring your online activities remain private and secure.
              Join us in exploring how Beacon can transform your learning
              experience, making every moment count towards achieving your
              goals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

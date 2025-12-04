import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const Bootstrap = () => {
  const [isReady, setIsReady] = useState(false);
  const [AppComponent, setAppComponent] = useState<any>(null);

  useEffect(() => {
    const checkApp = () => {
      const App = (window as any).App;
      if (App) {
        // We use a functional update (() => App) because App is a function component,
        // and we want to store the function itself, not call it.
        setAppComponent(() => App);
        setIsReady(true);
      } else {
        setTimeout(checkApp, 50);
      }
    };
    checkApp();
  }, []);

  if (!isReady || !AppComponent) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#0D0F14] text-gray-400 font-sans">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
           <span className="text-sm tracking-wide">Initializing...</span>
        </div>
      </div>
    );
  }

  return <AppComponent />;
};

root.render(
  <React.StrictMode>
    <Bootstrap />
  </React.StrictMode>
);
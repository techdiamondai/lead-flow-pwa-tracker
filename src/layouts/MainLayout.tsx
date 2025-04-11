
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

const DebugPanel = () => {
  const [showDebug, setShowDebug] = React.useState(false);

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-white shadow-md"
          onClick={() => setShowDebug(true)}
        >
          Show Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white border rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Panel</h3>
        <Button size="sm" variant="ghost" onClick={() => setShowDebug(false)}>Close</Button>
      </div>
      <div className="text-xs space-y-2">
        <div>
          <strong>Current URL:</strong> {window.location.href}
        </div>
        <div>
          <strong>React loaded:</strong> {React ? "Yes" : "No"}
        </div>
        <div>
          <Button size="sm" variant="secondary" onClick={() => window.location.href = "/"}>
            Go to Home
          </Button>
          {" "}
          <Button size="sm" variant="secondary" onClick={() => window.location.href = "/dashboard"}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

const MainLayout: React.FC = () => {
  console.log("MainLayout rendering");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <DebugPanel />
      <Toaster />
    </div>
  );
};

export default MainLayout;

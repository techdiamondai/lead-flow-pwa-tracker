
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const SupabaseConnectionStatus: React.FC = () => {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Use a simple RPC call to test the connection
        const { data, error } = await supabase.rpc<boolean, { function_name: string }>('get_function_exists', {
          function_name: 'handle_new_user'
        });
        
        if (error) {
          console.error("Supabase connection error:", error);
          setConnected(false);
          setError(error.message);
        } else {
          console.log("Supabase connection test result:", data);
          setConnected(true);
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setConnected(false);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 p-4 rounded shadow-sm">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
          <span>Checking Supabase connection...</span>
        </div>
      </div>
    );
  }

  if (connected) {
    return (
      <div className="bg-green-100 p-4 rounded shadow-sm">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-green-800">Supabase connection established</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-100 p-4 rounded shadow-sm">
      <div className="flex items-center">
        <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
        <div>
          <span className="text-red-800">Supabase connection failed</span>
          {error && <p className="text-xs mt-1 text-red-700">{error}</p>}
        </div>
      </div>
    </div>
  );
};

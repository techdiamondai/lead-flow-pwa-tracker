
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

export const SupabaseConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      console.log("Checking Supabase connection...");
      const { data, error } = await supabase.from("profiles").select("count").limit(1);
      
      if (error) {
        console.error("Supabase connection error:", error);
        setIsConnected(false);
      } else {
        console.log("Supabase connection successful:", data);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error checking Supabase connection:", error);
      setIsConnected(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleClearStorage = () => {
    try {
      localStorage.clear();
      toast({
        title: "Storage Cleared",
        description: "All localStorage has been cleared, including auth tokens."
      });
      // Refresh the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error clearing storage:", error);
      toast({
        title: "Error",
        description: "Failed to clear storage",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {isConnected === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Cannot connect to Supabase. Your registration and login may not work.
          </AlertDescription>
        </Alert>
      )}

      {isConnected === true && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Connected to Supabase</AlertTitle>
          <AlertDescription className="text-green-600">
            Your application is properly connected to the database.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={checkConnection}
          disabled={checking}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking...' : 'Check Connection'}
        </Button>

        <Button 
          variant="outline" 
          size="sm"
          onClick={handleClearStorage}
        >
          Clear All Storage
        </Button>
      </div>
    </div>
  );
};

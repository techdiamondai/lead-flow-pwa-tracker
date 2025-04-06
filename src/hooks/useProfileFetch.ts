
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";

export const useProfileFetch = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, role')
          .eq('id', userId)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        } else {
          setProfile(data as UserProfile);
        }
      } catch (error) {
        console.error("Exception fetching user profile:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, isLoading };
};

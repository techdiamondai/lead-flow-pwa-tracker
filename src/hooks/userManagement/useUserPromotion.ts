
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user.types";
import { createAdminUser } from "@/hooks/auth/utils/roleUtils";

/**
 * Hook for handling user promotion functionality
 */
export const useUserPromotion = (
  users: User[],
  selectedUsers: string[],
  setIsPromoting: (value: boolean) => void,
  updateUserRole: (userId: string, role: string) => void,
  setSelectedUsers: (userIds: string[]) => void,
  refetchUsers: () => Promise<void>
) => {
  const { toast } = useToast();
  
  const promoteSelectedToAdmin = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select users to promote to admin.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPromoting(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      // Process each selected user
      for (const userId of selectedUsers) {
        const user = users.find(u => u.id === userId);
        
        if (!user) {
          failCount++;
          console.error("User not found:", userId);
          continue;
        }
        
        if (user.role === 'admin') {
          // Skip users who are already admins
          console.log(`User ${user.name} is already an admin, skipping`);
          continue;
        }
        
        console.log(`Attempting to promote user: ${user.name} (${user.id})`);
        
        // Call the createAdminUser function from roleUtils
        const success = await createAdminUser(
          user.name,
          user.email,
          user.id
        );
        
        if (success) {
          successCount++;
          console.log(`✅ Successfully promoted user: ${user.name}`);
          // Update the user's role in our local state
          updateUserRole(userId, 'admin');
        } else {
          failCount++;
          console.error(`❌ Failed to promote user: ${user.name}`);
        }
      }
      
      // Show appropriate toast notification
      if (successCount > 0) {
        toast({
          title: "Success",
          description: `Promoted ${successCount} user(s) to admin.`,
        });
      }
      
      if (failCount > 0) {
        toast({
          title: "Warning",
          description: `Failed to promote ${failCount} user(s).`,
          variant: "destructive"
        });
      }
      
    } catch (error: any) {
      console.error("Error promoting users:", error);
      toast({
        title: "Error",
        description: "An error occurred while promoting users.",
        variant: "destructive"
      });
    } finally {
      setIsPromoting(false);
      setSelectedUsers([]);
      
      // Reload users to ensure we have the latest data
      refetchUsers();
    }
  };

  return { promoteSelectedToAdmin };
};

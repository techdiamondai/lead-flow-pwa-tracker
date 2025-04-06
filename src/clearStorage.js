
// Script to explain Supabase authentication storage and provide clearing functionality

// Function to clear all localStorage
function clearAllStorage() {
  localStorage.clear();
  console.log("All localStorage has been cleared, including Supabase authentication tokens!");
  console.log("You will need to log in again.");
}

// Information about storage usage
console.log("We've migrated to Supabase for data storage!");
console.log("Note: Supabase still uses localStorage to store authentication tokens.");
console.log("This is normal behavior and ensures you stay logged in between sessions.");
console.log("To fully log out, use the logout button in the application.");
console.log("To clear all storage for testing purposes, run this function:");
console.log("clearAllStorage()");

// Export the function for use in other files
window.clearAllStorage = clearAllStorage;

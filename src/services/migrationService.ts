
import { Lead } from "@/models/Lead";
import { IndexedDB } from "@/services/db";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Local storage key for tracking migration status
const MIGRATION_STATUS_KEY = "crm_migration_complete";
const MIGRATION_VERSION_KEY = "crm_migration_version";
const CURRENT_MIGRATION_VERSION = 1;

// Check if migration has already been completed
export function isMigrationCompleted(): boolean {
  return localStorage.getItem(MIGRATION_STATUS_KEY) === "true" && 
         Number(localStorage.getItem(MIGRATION_VERSION_KEY)) >= CURRENT_MIGRATION_VERSION;
}

// Mark migration as completed
export function setMigrationCompleted(): void {
  localStorage.setItem(MIGRATION_STATUS_KEY, "true");
  localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_MIGRATION_VERSION.toString());
}

// Migrate leads from IndexedDB to Supabase
export async function migrateLeadsToSupabase(userId: string): Promise<boolean> {
  try {
    // Initialize IndexedDB connection
    const leadDb = new IndexedDB<Lead>("crm_app", { storeName: "leads" });
    
    // Get all leads from IndexedDB
    const localLeads = await leadDb.getAll();
    
    if (!localLeads || localLeads.length === 0) {
      console.log("No local leads to migrate");
      return true;
    }
    
    console.log(`Found ${localLeads.length} local leads to migrate`);
    
    // Transform leads to match Supabase schema
    const supabaseLeads = localLeads.map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      position: lead.position || "",
      address: lead.address || "",
      current_stage: lead.current_stage,
      assigned_to: userId,
      created_by: userId,
      notes: lead.notes || "",
      created_at: lead.created_at,
      updated_at: lead.updated_at
    }));
    
    // Insert leads into Supabase
    const { error } = await supabase
      .from('leads')
      .insert(supabaseLeads);
    
    if (error) {
      console.error("Error migrating leads to Supabase:", error);
      return false;
    }
    
    console.log(`Successfully migrated ${supabaseLeads.length} leads to Supabase`);
    
    // Migrate lead history entries
    const historyEntries: any[] = [];
    
    for (const lead of localLeads) {
      if (lead.history && lead.history.length > 0) {
        const leadHistoryEntries = lead.history.map(entry => ({
          lead_id: lead.id,
          stage: entry.stage,
          timestamp: entry.timestamp,
          updated_by: userId,
          notes: entry.notes || ""
        }));
        
        historyEntries.push(...leadHistoryEntries);
      }
    }
    
    if (historyEntries.length > 0) {
      const { error: historyError } = await supabase
        .from('lead_history')
        .insert(historyEntries);
      
      if (historyError) {
        console.error("Error migrating lead history to Supabase:", historyError);
        return false;
      }
      
      console.log(`Successfully migrated ${historyEntries.length} history entries to Supabase`);
    }
    
    // Clear local data after successful migration
    try {
      // Using a method to clear all records instead of clearAll
      const leads = await leadDb.getAll();
      for (const lead of leads) {
        if (lead.id) {
          await leadDb.delete(lead.id);
        }
      }
      console.log("Cleared local IndexedDB data after migration");
    } catch (error) {
      console.error("Error clearing IndexedDB after migration:", error);
      // Continue even if clearing fails
    }
    
    return true;
  } catch (error) {
    console.error("Exception during migration:", error);
    return false;
  }
}

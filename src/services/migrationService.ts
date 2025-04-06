
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadStage } from "@/models/Lead";
import { IndexedDB } from "@/services/db";
import { stringToLeadStage } from "./leadService";

// Function to migrate data from IndexedDB to Supabase
export async function migrateLeadsToSupabase(userId: string): Promise<boolean> {
  try {
    // Initialize IndexedDB leads store
    const leadsDB = new IndexedDB<Lead>("diamondflow", { storeName: "leads" });
    
    // Get all leads from IndexedDB
    const localLeads = await leadsDB.getAll();
    
    if (!localLeads || localLeads.length === 0) {
      console.log("No leads found in IndexedDB to migrate");
      return true;
    }
    
    console.log(`Migrating ${localLeads.length} leads to Supabase`);
    
    // Format leads for Supabase
    const supabaseLeads = localLeads.map(lead => {
      // Map old lead model to new one
      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        position: lead.position || null,
        address: lead.address || null,
        current_stage: stringToLeadStage(lead.current_stage),
        assigned_to: userId, // Assign to current user
        created_by: userId,
        notes: lead.notes || null,
        created_at: lead.created_at,
        updated_at: lead.updated_at
      };
    });
    
    // Insert leads into Supabase
    const { error } = await supabase
      .from('leads')
      .insert(supabaseLeads);
    
    if (error) {
      console.error("Error migrating leads to Supabase:", error);
      return false;
    }
    
    console.log("Successfully migrated leads to Supabase");
    
    // Migrate lead history if available
    const leadHistoryDB = new IndexedDB<any>("diamondflow", { storeName: "lead_history" });
    
    const localLeadHistory = await leadHistoryDB.getAll();
    
    if (localLeadHistory && localLeadHistory.length > 0) {
      console.log(`Migrating ${localLeadHistory.length} lead history records to Supabase`);
      
      const supabaseLeadHistory = localLeadHistory.map((history: any) => ({
        lead_id: history.leadId,
        stage: stringToLeadStage(history.stage),
        updated_by: userId,
        notes: history.notes || null,
        timestamp: history.timestamp
      }));
      
      const { error: historyError } = await supabase
        .from('lead_history')
        .insert(supabaseLeadHistory);
      
      if (historyError) {
        console.error("Error migrating lead history to Supabase:", historyError);
      } else {
        console.log("Successfully migrated lead history to Supabase");
      }
    }
    
    // Clear local data after successful migration
    try {
      // Use the clear method with IndexedDB
      await leadsDB.clear();
      if (localLeadHistory && localLeadHistory.length > 0) {
        await leadHistoryDB.clear();
      }
      console.log("Cleared local IndexedDB data after migration");
    } catch (clearError) {
      console.error("Error clearing local data after migration:", clearError);
    }
    
    return true;
  } catch (error) {
    console.error("Exception during migration:", error);
    return false;
  }
}

export const migrationService = {
  migrateLeadsToSupabase
};

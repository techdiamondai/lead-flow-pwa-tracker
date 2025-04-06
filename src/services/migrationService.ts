
import { IndexedDB } from "./db";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/models/Lead";
import { v4 as uuidv4 } from "uuid";

// Service to migrate data from IndexedDB to Supabase
export const migrationService = {
  // Check if migration is needed (if we have local data)
  async checkNeedsMigration(): Promise<boolean> {
    try {
      const leadDb = new IndexedDB<Lead>("DiamondFlow", { storeName: "leads", dbVersion: 1 });
      const localLeads = await leadDb.getAll();
      return localLeads.length > 0;
    } catch (error) {
      console.error("Error checking migration status:", error);
      return false;
    }
  },

  // Migrate leads data from IndexedDB to Supabase
  async migrateLeads(userId: string): Promise<{ success: boolean; count: number }> {
    try {
      const leadDb = new IndexedDB<Lead>("DiamondFlow", { storeName: "leads", dbVersion: 1 });
      const localLeads = await leadDb.getAll();

      if (localLeads.length === 0) {
        return { success: true, count: 0 };
      }

      // Map the local leads to match Supabase structure
      const mappedLeads = localLeads.map(lead => ({
        id: uuidv4(), // Generate new UUID for Supabase
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        position: lead.position || null,
        address: lead.address || null,
        current_stage: lead.currentStage,
        assigned_to: userId, // Assign to current user
        created_by: userId, // Set creator to current user
        notes: lead.notes || null,
        created_at: lead.created,
        updated_at: lead.updated
      }));

      // Create leads in Supabase
      const { error: leadsError } = await supabase
        .from('leads')
        .insert(mappedLeads);

      if (leadsError) {
        console.error("Error inserting leads:", leadsError);
        return { success: false, count: 0 };
      }

      // Prepare history records
      const historyRecords: any[] = [];
      
      // Map each lead's history
      mappedLeads.forEach((mappedLead, index) => {
        const originalLead = localLeads[index];
        if (originalLead.history && originalLead.history.length > 0) {
          originalLead.history.forEach(historyItem => {
            historyRecords.push({
              id: uuidv4(),
              lead_id: mappedLead.id,
              timestamp: historyItem.timestamp,
              stage: historyItem.stage,
              notes: historyItem.notes || null,
              updated_by: userId // Set updater to current user
            });
          });
        }
      });

      // Insert history records if there are any
      if (historyRecords.length > 0) {
        const { error: historyError } = await supabase
          .from('lead_history')
          .insert(historyRecords);

        if (historyError) {
          console.error("Error inserting lead history:", historyError);
          // Continue anyway, since leads were inserted
        }
      }

      // Clear the local database after successful migration
      await leadDb.clearAll();
      
      return { success: true, count: localLeads.length };
    } catch (error) {
      console.error("Error during migration:", error);
      return { success: false, count: 0 };
    }
  }
};

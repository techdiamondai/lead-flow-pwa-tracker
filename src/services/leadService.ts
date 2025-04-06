
import { v4 as uuidv4 } from "uuid";
import { Lead, LeadStage, LeadHistory, NewLead, LeadUpdate } from "@/models/Lead";
import { getUserNameById } from "@/services/userService";
import { supabase } from "@/integrations/supabase/client";

export async function getLeads(): Promise<Lead[]> {
  try {
    // Fetch leads from Supabase
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
      return [];
    }

    // For each lead, fetch its history
    const leadsWithHistory = await Promise.all(
      leads.map(async (lead) => {
        const { data: history, error: historyError } = await supabase
          .from('lead_history')
          .select('*')
          .eq('lead_id', lead.id)
          .order('timestamp', { ascending: false });

        if (historyError) {
          console.error(`Error fetching history for lead ${lead.id}:`, historyError);
          return { ...lead, history: [] };
        }

        return { ...lead, history };
      })
    );

    return leadsWithHistory as Lead[];
  } catch (error) {
    console.error("Exception fetching leads:", error);
    return [];
  }
}

export async function getLead(id: string): Promise<Lead | undefined> {
  try {
    // Fetch lead from Supabase
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching lead with ID ${id}:`, error);
      return undefined;
    }

    // Fetch lead history
    const { data: history, error: historyError } = await supabase
      .from('lead_history')
      .select('*')
      .eq('lead_id', id)
      .order('timestamp', { ascending: false });

    if (historyError) {
      console.error(`Error fetching history for lead ${id}:`, historyError);
      return { ...lead, history: [] };
    }

    return { ...lead, history };
  } catch (error) {
    console.error(`Exception fetching lead with ID ${id}:`, error);
    return undefined;
  }
}

export async function createLead(leadData: NewLead, userId: string): Promise<string | undefined> {
  try {
    const now = new Date().toISOString();
    const createdByName = await getUserNameById(userId);
    
    // Create the lead in Supabase
    const { data: newLead, error } = await supabase
      .from('leads')
      .insert([{
        ...leadData,
        created_by: userId
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      return undefined;
    }

    // Create initial history entry
    const initialHistory: Omit<LeadHistory, "id"> = {
      lead_id: newLead.id,
      timestamp: now,
      stage: leadData.current_stage,
      updated_by: userId,
      notes: `Lead created by ${createdByName}`
    };

    const { error: historyError } = await supabase
      .from('lead_history')
      .insert([initialHistory]);

    if (historyError) {
      console.error("Error creating lead history:", historyError);
      // We still return the lead ID since the lead was created successfully
    }
    
    return newLead?.id;
  } catch (error) {
    console.error("Exception creating lead:", error);
    return undefined;
  }
}

export async function updateLead(
  id: string, 
  updateData: LeadUpdate, 
  userId: string, 
  notes?: string
): Promise<boolean> {
  try {
    // Get current lead data
    const { data: currentLead, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error(`Error fetching lead with ID ${id}:`, fetchError);
      return false;
    }
    
    const now = new Date().toISOString();
    const userWhoUpdated = await getUserNameById(userId);
    
    // Update the lead
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        ...updateData,
        updated_at: now
      })
      .eq('id', id);

    if (updateError) {
      console.error(`Error updating lead with ID ${id}:`, updateError);
      return false;
    }

    // Create new history entry if stage changed
    if (updateData.current_stage && updateData.current_stage !== currentLead.current_stage) {
      const historyEntry: Omit<LeadHistory, "id"> = {
        lead_id: id,
        timestamp: now,
        stage: updateData.current_stage,
        updated_by: userId,
        notes: notes || `Stage changed to ${getStageDisplayName(updateData.current_stage)} by ${userWhoUpdated}`
      };

      const { error: historyError } = await supabase
        .from('lead_history')
        .insert([historyEntry]);

      if (historyError) {
        console.error("Error creating lead history:", historyError);
        // We still return true since the lead was updated successfully
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Exception updating lead with ID ${id}:`, error);
    return false;
  }
}

export async function transferLeads(
  leadIds: string[], 
  toUserId: string, 
  fromUserId: string
): Promise<boolean> {
  try {
    let allSuccess = true;
    
    // Get user names for the history notes
    const toUserName = await getUserNameById(toUserId);
    const fromUserName = await getUserNameById(fromUserId);
    
    for (const id of leadIds) {
      // Update the lead's assigned user
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          assigned_to: toUserId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error(`Error transferring lead ${id}:`, updateError);
        allSuccess = false;
        continue;
      }

      // Create transfer history entry
      const now = new Date().toISOString();
      
      // Get current stage
      const { data: lead, error: fetchError } = await supabase
        .from('leads')
        .select('current_stage')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error(`Error fetching lead stage ${id}:`, fetchError);
        allSuccess = false;
        continue;
      }
      
      const transferHistory: Omit<LeadHistory, "id"> = {
        lead_id: id,
        timestamp: now,
        stage: lead.current_stage,
        updated_by: fromUserId,
        notes: `Lead transferred from ${fromUserName} to ${toUserName}`
      };

      const { error: historyError } = await supabase
        .from('lead_history')
        .insert([transferHistory]);

      if (historyError) {
        console.error(`Error creating history for lead transfer ${id}:`, historyError);
        // We still continue since the transfer was successful
      }
    }
    
    return allSuccess;
  } catch (error) {
    console.error("Exception transferring leads:", error);
    return false;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    // Delete the lead (history will be cascade deleted)
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting lead with ID ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception deleting lead with ID ${id}:`, error);
    return false;
  }
}

export function getStageDisplayName(stage: LeadStage): string {
  const stageMap: Record<LeadStage, string> = {
    new: "New Lead",
    contacted: "Contacted",
    qualified: "Qualified",
    proposal: "Proposal Sent",
    negotiation: "Negotiation",
    won: "Won",
    lost: "Lost"
  };
  
  return stageMap[stage] || stage;
}

export function getAllStages(): { value: LeadStage; label: string }[] {
  return [
    { value: "new", label: "New Lead" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal Sent" },
    { value: "negotiation", label: "Negotiation" },
    { value: "won", label: "Won" },
    { value: "lost", label: "Lost" }
  ];
}

// Function to reassign all leads from a deleted user to another user (admin by default)
export async function reassignLeadsFromDeletedUser(deletedUserId: string, adminUserId: string): Promise<boolean> {
  try {
    // Find leads assigned to the deleted user
    const { data: userLeads, error: fetchError } = await supabase
      .from('leads')
      .select('id')
      .eq('assigned_to', deletedUserId);
    
    if (fetchError) {
      console.error("Error finding leads for deleted user:", fetchError);
      return false;
    }
    
    if (userLeads.length === 0) {
      return true; // No leads to reassign
    }
    
    const leadIds = userLeads.map(lead => lead.id);
    return await transferLeads(leadIds, adminUserId, deletedUserId);
  } catch (error) {
    console.error("Exception reassigning leads from deleted user:", error);
    return false;
  }
}

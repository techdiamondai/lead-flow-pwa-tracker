// Import necessary modules
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadHistory, LeadStage, NewLead } from "@/models/Lead";

// Get all leads
export async function getLeads(): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*');
    
    if (error) {
      console.error("Error fetching leads:", error);
      return [];
    }
    
    // Map the database records to the Lead type
    const leads = data.map(item => ({
      ...item,
      current_stage: item.current_stage as LeadStage
    })) as Lead[];
    
    return leads;
  } catch (error) {
    console.error("Exception fetching leads:", error);
    return [];
  }
}

// Get a single lead by ID
export async function getLead(id: string): Promise<Lead | null> {
  try {
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (leadError) {
      console.error("Error fetching lead:", leadError);
      return null;
    }
    
    // Get lead history
    const { data: historyData, error: historyError } = await supabase
      .from('lead_history')
      .select('*')
      .eq('lead_id', leadData.id)
      .order('timestamp', { ascending: false });
    
    if (historyError) {
      console.error("Error fetching lead history:", historyError);
    }
    
    // Map the lead data to the Lead type with its history
    const lead: Lead = {
      ...leadData,
      current_stage: leadData.current_stage as LeadStage,
      history: historyData as LeadHistory[] || []
    };
    
    return lead;
  } catch (error) {
    console.error("Exception fetching lead:", error);
    return null;
  }
}

// Create a new lead
export async function createLead(lead: NewLead, userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          ...lead,
          created_by: userId,
          assigned_to: userId,
          current_stage: lead.current_stage || 'new',
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating lead:", error);
      return null;
    }
    
    // Create initial history entry
    await logLeadHistory(data.id, data.current_stage, userId, "Lead created");
    
    return data.id;
  } catch (error) {
    console.error("Exception creating lead:", error);
    return null;
  }
}

// Update an existing lead
export async function updateLead(
  id: string, 
  updates: Partial<Lead>, 
  userId: string,
  historyNote?: string
): Promise<boolean> {
  try {
    // Get current lead for history tracking
    const { data: currentLead, error: fetchError } = await supabase
      .from('leads')
      .select('current_stage')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching current lead:", fetchError);
      return false;
    }
    
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error("Error updating lead:", error);
      return false;
    }
    
    // Log to history if stage changed or note provided
    if ((updates.current_stage && updates.current_stage !== currentLead.current_stage) || historyNote) {
      await logLeadHistory(
        id, 
        updates.current_stage || currentLead.current_stage, 
        userId, 
        historyNote || `Stage changed to ${getStageDisplayName(updates.current_stage as LeadStage)}`
      );
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating lead:", error);
    return false;
  }
}

// Delete a lead by ID
export async function deleteLead(id: string): Promise<boolean> {
  try {
    // First delete history entries
    await supabase
      .from('lead_history')
      .delete()
      .eq('lead_id', id);
    
    // Then delete the lead
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting lead:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception deleting lead:", error);
    return false;
  }
}

// Log lead history
export async function logLeadHistory(leadId: string, stage: LeadStage, userId: string | null, notes: string | null): Promise<LeadHistory | null> {
  try {
    const historyEntry = {
      lead_id: leadId,
      stage: stage,
      updated_by: userId,
      notes: notes,
      timestamp: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('lead_history')
      .insert([historyEntry])
      .select()
      .single();
    
    if (error) {
      console.error("Error logging lead history:", error);
      return null;
    }
    
    return data as LeadHistory;
  } catch (error) {
    console.error("Exception logging lead history:", error);
    return null;
  }
}

// Get lead history by lead ID
export async function getLeadHistory(leadId: string): Promise<LeadHistory[]> {
  try {
    const { data, error } = await supabase
      .from('lead_history')
      .select('*')
      .eq('lead_id', leadId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error("Error fetching lead history:", error);
      return [];
    }
    
    return data as LeadHistory[];
  } catch (error) {
    console.error("Exception fetching lead history:", error);
    return [];
  }
}

// Transfer leads to another user
export async function transferLeads(leadIds: string[], newUserId: string, currentUserId: string): Promise<boolean> {
  try {
    // Update assigned_to field for all provided lead IDs
    const { error } = await supabase
      .from('leads')
      .update({ 
        assigned_to: newUserId, 
        updated_at: new Date().toISOString() 
      })
      .in('id', leadIds);
    
    if (error) {
      console.error("Error transferring leads:", error);
      return false;
    }
    
    // Log history entries for each lead
    for (const leadId of leadIds) {
      // Get lead details
      const { data: lead } = await supabase
        .from('leads')
        .select('current_stage')
        .eq('id', leadId)
        .single();
      
      if (lead) {
        await logLeadHistory(
          leadId,
          lead.current_stage,
          currentUserId,
          `Lead transferred to another user`
        );
      }
    }
    
    return true;
  } catch (error) {
    console.error("Exception transferring leads:", error);
    return false;
  }
}

// Reassign leads from a deleted user to another user
export async function reassignLeadsFromDeletedUser(deletedUserId: string, newUserId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ 
        assigned_to: newUserId, 
        updated_at: new Date().toISOString() 
      })
      .eq('assigned_to', deletedUserId);
    
    if (error) {
      console.error("Error reassigning leads from deleted user:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception reassigning leads:", error);
    return false;
  }
}

// Helper function to convert string to LeadStage type
export const stringToLeadStage = (stage: string): LeadStage => {
  const validStages: LeadStage[] = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];
  return validStages.includes(stage as LeadStage) 
    ? (stage as LeadStage) 
    : "new"; // Default to "new" if invalid
};

// Get display name for lead stage
export function getStageDisplayName(stage: LeadStage): string {
  switch (stage) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "qualified":
      return "Qualified";
    case "proposal":
      return "Proposal Sent";
    case "negotiation":
      return "Negotiation";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
    default:
      return "Unknown Stage";
  }
}

// Get color for lead stage
export function getStageColor(stage: LeadStage): string {
  switch (stage) {
    case "new":
      return "text-gray-500";
    case "contacted":
      return "text-blue-500";
    case "qualified":
      return "text-green-500";
    case "proposal":
      return "text-yellow-500";
    case "negotiation":
      return "text-purple-500";
    case "won":
      return "text-green-600";
    case "lost":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

// Get all available stages with their display names
export function getAllStages(): { value: LeadStage; label: string }[] {
  return [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal Sent" },
    { value: "negotiation", label: "Negotiation" },
    { value: "won", label: "Won" },
    { value: "lost", label: "Lost" }
  ];
}

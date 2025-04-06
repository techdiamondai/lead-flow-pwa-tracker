
import { IndexedDB } from "./db";
import { Lead, LeadStage, LeadHistory, NewLead, LeadUpdate } from "@/models/Lead";
import { v4 as uuidv4 } from "uuid";

const leadDb = new IndexedDB<Lead>("LeadFlowCRM", { storeName: "leads", dbVersion: 1 });

export async function getLeads(): Promise<Lead[]> {
  try {
    return await leadDb.getAll();
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

export async function getLead(id: number): Promise<Lead | undefined> {
  try {
    return await leadDb.getById(id);
  } catch (error) {
    console.error(`Error fetching lead with ID ${id}:`, error);
    return undefined;
  }
}

export async function createLead(leadData: NewLead, userId: string): Promise<number | undefined> {
  try {
    const now = new Date().toISOString();
    
    // Create initial history entry
    const initialHistory: LeadHistory = {
      id: uuidv4(),
      timestamp: now,
      stage: leadData.currentStage,
      updatedBy: userId,
      notes: "Lead created"
    };
    
    const leadToCreate: Omit<Lead, "id"> = {
      ...leadData,
      created: now,
      updated: now,
      createdBy: userId, // Store who created the lead
      history: [initialHistory]
    };
    
    const id = await leadDb.add(leadToCreate);
    
    // Try to sync with server if online
    if (navigator.onLine) {
      // In a real app, you'd make an API call here
      try {
        await syncLead({ ...leadToCreate, id });
      } catch (error) {
        console.error("Error syncing lead:", error);
        // Register for background sync
        registerSyncLead();
      }
    } else {
      // Register for background sync
      registerSyncLead();
    }
    
    return id;
  } catch (error) {
    console.error("Error creating lead:", error);
    return undefined;
  }
}

export async function updateLead(
  id: number, 
  updateData: LeadUpdate, 
  userId: string, 
  notes?: string
): Promise<boolean> {
  try {
    const currentLead = await leadDb.getById(id);
    if (!currentLead) return false;
    
    const now = new Date().toISOString();
    
    // Create new history entry if stage changed
    let newHistory: LeadHistory[] = [...currentLead.history];
    if (updateData.currentStage && updateData.currentStage !== currentLead.currentStage) {
      newHistory.push({
        id: uuidv4(),
        timestamp: now,
        stage: updateData.currentStage,
        updatedBy: userId,
        notes: notes || `Stage changed to ${updateData.currentStage}`
      });
    }
    
    const updatedLead = {
      ...currentLead,
      ...updateData,
      updated: now,
      history: newHistory
    };
    
    const success = await leadDb.update(id, updatedLead);
    
    // Try to sync with server if online
    if (success && navigator.onLine) {
      try {
        const fullLead = await leadDb.getById(id);
        if (fullLead) {
          await syncLeadUpdate(fullLead);
        }
      } catch (error) {
        console.error("Error syncing lead update:", error);
        registerSyncLead();
      }
    } else {
      registerSyncLead();
    }
    
    return success;
  } catch (error) {
    console.error(`Error updating lead with ID ${id}:`, error);
    return false;
  }
}

// Transfer lead(s) to another user
export async function transferLeads(
  leadIds: number[], 
  toUserId: string, 
  fromUserId: string
): Promise<boolean> {
  try {
    let allSuccess = true;
    
    for (const id of leadIds) {
      const lead = await leadDb.getById(id);
      if (!lead) {
        allSuccess = false;
        continue;
      }
      
      const now = new Date().toISOString();
      const transferHistory: LeadHistory = {
        id: uuidv4(),
        timestamp: now,
        stage: lead.currentStage,
        updatedBy: fromUserId,
        notes: `Lead transferred to user ${toUserId}`
      };
      
      const updatedLead = {
        ...lead,
        assignedTo: toUserId,
        updated: now,
        history: [...lead.history, transferHistory]
      };
      
      const success = await leadDb.update(id, updatedLead);
      if (!success) {
        allSuccess = false;
      }
    }
    
    return allSuccess;
  } catch (error) {
    console.error("Error transferring leads:", error);
    return false;
  }
}

export async function deleteLead(id: number): Promise<boolean> {
  try {
    const success = await leadDb.delete(id);
    
    // Try to sync with server if online
    if (success && navigator.onLine) {
      try {
        await syncLeadDelete(id);
      } catch (error) {
        console.error("Error syncing lead deletion:", error);
        // For deletions, we might want to keep track separately
      }
    }
    
    return success;
  } catch (error) {
    console.error(`Error deleting lead with ID ${id}:`, error);
    return false;
  }
}

// These functions would interact with your backend API in a real app
async function syncLead(lead: Lead): Promise<void> {
  // Mock API call
  console.log("Syncing lead to server:", lead);
  // In a real app: await fetch('/api/leads', { method: 'POST', body: JSON.stringify(lead) });
}

async function syncLeadUpdate(lead: Lead): Promise<void> {
  // Mock API call
  console.log("Syncing lead update to server:", lead);
  // In a real app: await fetch(`/api/leads/${lead.id}`, { method: 'PUT', body: JSON.stringify(lead) });
}

async function syncLeadDelete(id: number): Promise<void> {
  // Mock API call
  console.log("Syncing lead deletion to server:", id);
  // In a real app: await fetch(`/api/leads/${id}`, { method: 'DELETE' });
}

function registerSyncLead(): void {
  // Register for background sync if supported
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      // Fixed: Use optional chaining to safely access sync property
      registration.sync?.register('sync-leads')
        .catch(err => console.error('Error registering sync:', err));
    });
  }
}

// Helper function to get the stage display name
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

// Helper function to get all available stages
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


import { useState, useEffect } from "react";
import { Lead } from "@/models/Lead";
import { getLeads } from "@/services/leadService";
import { useAuth } from "@/hooks/auth";

export const useLeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const { user, isAdmin } = useAuth();
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const adminStatus = await isAdmin();
        console.log("Admin check in useLeadManagement:", adminStatus);
        setIsAdminUser(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    
    checkAdminStatus();
  }, [user, isAdmin]);
  
  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching leads, admin status:", isAdminUser);
      const allLeads = await getLeads();
      
      // Sort by most recent update
      allLeads.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setLeads(allLeads);
      setFilteredLeads(allLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeads();
  }, [isAdminUser]); // Re-fetch when admin status changes
  
  useEffect(() => {
    // Filter leads based on search query
    if (searchQuery.trim() === "") {
      setFilteredLeads(leads);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = leads.filter(
        lead =>
          lead.name.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          (lead.email && lead.email.toLowerCase().includes(query)) ||
          (lead.phone && lead.phone.toLowerCase().includes(query))
      );
      setFilteredLeads(filtered);
    }
  }, [searchQuery, leads]);
  
  const handleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };
  
  const getStageBadgeVariant = (stage: string) => {
    switch (stage) {
      case "won": return "default";
      case "lost": return "destructive";
      case "negotiation": return "secondary";
      default: return "outline";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };
  
  return {
    leads,
    filteredLeads,
    searchQuery,
    setSearchQuery,
    selectedLeads,
    setSelectedLeads,
    isLoading,
    isAdminUser,
    fetchLeads,
    handleSelectLead,
    handleSelectAll,
    getStageBadgeVariant,
    formatDate
  };
};

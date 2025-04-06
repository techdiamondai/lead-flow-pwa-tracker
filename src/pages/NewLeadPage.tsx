
import React from "react";
import { LeadForm } from "@/components/LeadForm";

const NewLeadPage: React.FC = () => {
  return (
    <div className="container px-4 py-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Lead</h1>
      <LeadForm />
    </div>
  );
};

export default NewLeadPage;


export const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown Date";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric", 
      month: "short", 
      day: "numeric"
    }).format(date);
  } catch (e) {
    return "Unknown Date";
  }
};

export const getStageBadgeVariant = (stage: string) => {
  switch (stage) {
    case "new":
      return "default";
    case "contacted":
      return "secondary";
    case "qualified":
      return "outline";
    case "proposal":
      return "secondary";
    case "negotiation":
      return "default";
    case "won":
      return "success";
    case "lost":
      return "destructive";
    default:
      return "default";
  }
};

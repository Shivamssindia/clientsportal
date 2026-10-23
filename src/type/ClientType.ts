 type Client = {
  companyName: string;
  companyMobileNumber: string;
  companyEmail: string;
  orgType: "PRIVATE_LIMITED" | "PUBLIC_LIMITED" | "PARTNERSHIP" | "SOLE_PROPRIETORSHIP";
  clientType: "INDIVIDUAL" | "STARTUP" | "SMB" | "ENTERPRISE";
  clientWebsite: string;
};

export type { Client };
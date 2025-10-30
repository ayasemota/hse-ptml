export interface IncidentReport {
   id?: string;
   dateOfIncident: string;
   dateOfReport: string;
   caseNumber: string;
   incidentConsequences: string[];
   incidentLocation: string;
   typeOfFacility: string;
   typeOfEquipment: string;
   incidentCostDirect: string;
   incidentCostLostProfit: string;
   teamLeader: string;
   teamMembers: string;
   plc: string;
   plcJobTitle: string;
   summaryOfIncident: string;
   primaryCause: string;
   recommendations: string;
   actionItems: {
      description: string;
      ownership: string;
      date: string;
   }[];
   dateApproved: string;
   personInCharge: string;
   createdAt: string;
   createdBy: string;
}
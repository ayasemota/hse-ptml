"use client";

import { useState, useEffect } from 'react';
import { Plus, X, Printer, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

export default function NewFormPage() {
   const router = useRouter();
   const consequenceOptions = ['Near-miss', 'Fire/Explosion', 'Injury or Illness', 'Motor Vehicle', 'Fatality', 'Environmental Impact', 'Non-Conformity', 'Property/Equipment Damage or loss', 'Spill/Release', 'Others'];

   useEffect(() => {
      document.title = "HSE-PTML | New Incident Report";
   }, []);

   const [formData, setFormData] = useState({
      dateOfIncident: '', dateOfReport: new Date().toISOString().split('T')[0], caseNumber: '', consequences: [] as string[],
      incidentLocation: '', typeOfFacility: '', typeOfEquipment: '', incidentCost: '', lostProfit: '',
      teamLeader: '', picJobTitle: '', teamMembers: [''], summary: '', primaryCause: '', recommendations: '',
      dateApproved: '', personInCharge: ''
   });

   const [actionItems, setActionItems] = useState([
      { action: 'Incident alert, Investigation and Photograph', owner: 'HSE Department', date: '' },
      { action: 'Incident alert and Notification', owner: '', date: '' }
   ]);

   const [showDialog, setShowDialog] = useState(false);

   const handleInputChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

   const handleConsequenceToggle = (option: string) => {
      setFormData(prev => ({
         ...prev,
         consequences: prev.consequences.includes(option) ? prev.consequences.filter(c => c !== option) : [...prev.consequences, option]
      }));
   };

   const handleSave = async () => {
      if (!formData.caseNumber || !formData.dateOfIncident) {
         alert('Please fill in Case Number and Date of Incident');
         return;
      }
      const report = { id: `report_${Date.now()}`, ...formData, actionItems, createdAt: new Date().toISOString() };
      try {
         const result = await (window as any).storage.set(report.id, JSON.stringify(report));
         if (result) {
            setShowDialog(true);
         } else {
            alert('Failed to save report. Please try again.');
         }
      } catch (error) {
         console.error('Save error:', error);
         alert('Failed to save report. Please try again.');
      }
   };

   const resetForm = () => {
      setFormData({
         dateOfIncident: '', dateOfReport: new Date().toISOString().split('T')[0], caseNumber: '', consequences: [],
         incidentLocation: '', typeOfFacility: '', typeOfEquipment: '', incidentCost: '', lostProfit: '',
         teamLeader: '', picJobTitle: '', teamMembers: [''], summary: '', primaryCause: '', recommendations: '',
         dateApproved: '', personInCharge: ''
      });
      setActionItems([
         { action: 'Incident alert, Investigation and Photograph', owner: 'HSE Department', date: '' },
         { action: 'Incident alert and Notification', owner: '', date: '' }
      ]);
      setShowDialog(false);
   };

   return (
      <div className="min-h-screen bg-gray-50 print:bg-white font-poppins">
         <div className="print:hidden"><Header /></div>

         <div className="max-w-5xl mx-auto px-6 py-8">
            <Link href="/dashboard" className="flex items-center text-green-700 hover:text-green-800 mb-6 print:hidden">
               <ChevronLeft className="w-5 h-5" /><span className="ml-1">Back to Dashboard</span>
            </Link>

            <div id="report-content" className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
               <h2 className="text-3xl font-bold text-green-700 mb-8">INCIDENT REPORT FORM</h2>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                     { label: 'Date of Incident:', type: 'date', field: 'dateOfIncident' },
                     { label: 'Date of Report:', type: 'date', field: 'dateOfReport' },
                     { label: 'Case Number:', type: 'text', field: 'caseNumber', placeholder: 'HSE-2024-XXX' }
                  ].map(inp => (
                     <div key={inp.field}>
                        <label className="block text-sm font-semibold text-green-700 mb-2">{inp.label}</label>
                        <input type={inp.type} value={formData[inp.field as keyof typeof formData] as string} onChange={(e) => handleInputChange(inp.field, e.target.value)} placeholder={inp.placeholder || ''} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" />
                     </div>
                  ))}
               </div>

               <div className="mb-8">
                  <label className="block text-sm font-semibold text-green-700 mb-3">INCIDENT CONSEQUENCES (Kindly check all that apply)</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                     {consequenceOptions.map(opt => (
                        <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                           <input type="checkbox" checked={formData.consequences.includes(opt)} onChange={() => handleConsequenceToggle(opt)} className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                           <span className="text-sm">{opt}</span>
                        </label>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[
                     { label: 'INCIDENT LOCATION', field: 'incidentLocation', placeholder: 'Where did the incident take place?' },
                     { label: 'TYPE OF FACILITY', field: 'typeOfFacility', placeholder: 'State the facility type' }
                  ].map(inp => (
                     <div key={inp.field}>
                        <label className="block text-sm font-semibold text-green-700 mb-2">{inp.label}</label>
                        <input type="text" value={formData[inp.field as keyof typeof formData] as string} onChange={(e) => handleInputChange(inp.field, e.target.value)} placeholder={inp.placeholder} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" />
                     </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                     { label: 'TYPE OF EQUIPMENT', field: 'typeOfEquipment', type: 'text', placeholder: 'State the equipment type' },
                     { label: 'INCIDENT COST (USD) - Direct', field: 'incidentCost', type: 'number', placeholder: '0.00' },
                     { label: 'Lost Profit', field: 'lostProfit', type: 'number', placeholder: '0.00' }
                  ].map(inp => (
                     <div key={inp.field}>
                        <label className="block text-sm font-semibold text-green-700 mb-2">{inp.label}</label>
                        <input type={inp.type} value={formData[inp.field as keyof typeof formData] as string} onChange={(e) => handleInputChange(inp.field, e.target.value)} placeholder={inp.placeholder} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" />
                     </div>
                  ))}
               </div>

               <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                     {[
                        { label: 'TEAM LEADER', field: 'teamLeader', placeholder: 'HSE Manager' },
                        { label: 'P.I.C JOB TITLE', field: 'picJobTitle', placeholder: 'HSE Team' }
                     ].map(inp => (
                        <div key={inp.field}>
                           <label className="block text-sm font-semibold text-green-700 mb-2">{inp.label}</label>
                           <input type="text" value={formData[inp.field as keyof typeof formData] as string} onChange={(e) => handleInputChange(inp.field, e.target.value)} placeholder={inp.placeholder} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" />
                        </div>
                     ))}
                  </div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">TEAM MEMBERS (OPTIONAL)</label>
                  {formData.teamMembers.map((m, i) => (
                     <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={m} onChange={(e) => handleInputChange('teamMembers', formData.teamMembers.map((tm, idx) => idx === i ? e.target.value : tm))} placeholder="Team member name" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" />
                        {formData.teamMembers.length > 1 && (
                           <button onClick={() => handleInputChange('teamMembers', formData.teamMembers.filter((_, idx) => idx !== i))} className="text-red-600 hover:text-red-700 print:hidden"><X className="w-5 h-5" /></button>
                        )}
                     </div>
                  ))}
                  <button onClick={() => handleInputChange('teamMembers', [...formData.teamMembers, ''])} className="mt-2 flex items-center text-green-600 hover:text-green-700 print:hidden"><Plus className="w-4 h-4 mr-1" />Add Team Member</button>
               </div>

               {[
                  { label: 'SUMMARY OF INCIDENT', field: 'summary', rows: 6, placeholder: 'Give a detailed summary of the incident' },
                  { label: 'PRIMARY CAUSE(S) OF INCIDENT', field: 'primaryCause', rows: 3, placeholder: 'State the primary cause of the incident' },
                  { label: 'RECOMMENDATIONS', field: 'recommendations', rows: 3, placeholder: 'What do you recommend to prevent this incident in future?' }
               ].map(txt => (
                  <div key={txt.field} className="mb-8">
                     <label className="block text-sm font-semibold text-green-700 mb-2">{txt.label}</label>
                     <textarea value={formData[txt.field as keyof typeof formData] as string} onChange={(e) => handleInputChange(txt.field, e.target.value)} placeholder={txt.placeholder} rows={txt.rows} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" />
                  </div>
               ))}

               <div className="mb-8">
                  <label className="block text-sm font-semibold text-green-700 mb-3">ACTION ITEMS</label>
                  <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                     <table className="w-full border-collapse min-w-[640px]">
                        <thead>
                           <tr className="bg-gray-100">
                              {['#', 'Action', 'Ownership Assigned To', 'Date', ''].map((h, i) => (
                                 <th key={i} className={`border border-gray-300 px-4 py-2 text-left ${i === 4 ? 'print:hidden' : ''} ${i === 0 ? 'w-12' : i === 1 ? 'min-w-[200px]' : i === 2 ? 'min-w-[180px]' : i === 3 ? 'min-w-[140px]' : 'w-12'}`}>{h}</th>
                              ))}
                           </tr>
                        </thead>
                        <tbody>
                           {actionItems.map((item, i) => (
                              <tr key={i}>
                                 <td className="border border-gray-300 px-4 py-2">{i + 1}</td>
                                 <td className="border border-gray-300 px-4 py-2">
                                    <input type="text" value={item.action} onChange={(e) => setActionItems(actionItems.map((it, idx) => idx === i ? { ...it, action: e.target.value } : it))} className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-green-500 print:border-0 min-w-[180px]" placeholder="Action item" />
                                 </td>
                                 <td className="border border-gray-300 px-4 py-2">
                                    <input type="text" value={item.owner} onChange={(e) => setActionItems(actionItems.map((it, idx) => idx === i ? { ...it, owner: e.target.value } : it))} className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-green-500 print:border-0 min-w-40" placeholder="Owner" />
                                 </td>
                                 <td className="border border-gray-300 px-4 py-2">
                                    <input type="date" value={item.date} onChange={(e) => setActionItems(actionItems.map((it, idx) => idx === i ? { ...it, date: e.target.value } : it))} className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-green-500 print:border-0 min-w-[120px]" />
                                 </td>
                                 <td className="border border-gray-300 px-4 py-2 print:hidden">
                                    {actionItems.length > 1 && (
                                       <button onClick={() => setActionItems(actionItems.filter((_, idx) => idx !== i))} className="text-red-600 hover:text-red-700"><X className="w-4 h-4" /></button>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  <button onClick={() => setActionItems([...actionItems, { action: '', owner: '', date: '' }])} className="mt-3 flex items-center text-green-600 hover:text-green-700 print:hidden"><Plus className="w-4 h-4 mr-1" />Add Action Item</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[
                     { label: 'DATE APPROVED', field: 'dateApproved', type: 'date' },
                     { label: 'PERSON IN CHARGE', field: 'personInCharge', type: 'text' }
                  ].map(inp => (
                     <div key={inp.field}>
                        <label className="block text-sm font-semibold text-green-700 mb-2">{inp.label}</label>
                        <input type={inp.type} value={formData[inp.field as keyof typeof formData] as string} onChange={(e) => handleInputChange(inp.field, e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" />
                     </div>
                  ))}
               </div>

               <div className="flex flex-wrap gap-4 print:hidden">
                  <button onClick={() => window.print()} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors">
                     <Printer className="w-5 h-5 mr-2" />Print Report
                  </button>
                  <button onClick={handleSave} className="flex items-center bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg transition-colors">
                     Save Report
                  </button>
               </div>
            </div>
         </div>

         {showDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
               <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">Report Saved Successfully!</h3>
                  <p className="text-gray-600 mb-6">Your incident report has been saved. Would you like to fill another report?</p>
                  <div className="flex gap-4">
                     <button onClick={() => router.push('/dashboard')} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition-colors">
                        Back to Dashboard
                     </button>
                     <button onClick={resetForm} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors">
                        Fill Another Report
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
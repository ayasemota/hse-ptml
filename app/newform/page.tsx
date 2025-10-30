"use client";

import { useState, useEffect } from 'react';
import { Plus, X, Printer, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { auth } from '../../lib/firebase';
import { incidentService } from '../services/incidentService';

export default function NewFormPage() {
   const router = useRouter();
   const consequenceOptions = ['Near-miss', 'Fire/Explosion', 'Injury or Illness', 'Motor Vehicle', 'Fatality', 'Environmental Impact', 'Non-Conformity', 'Property/Equipment Damage or loss', 'Spill/Release', 'Others'];

   useEffect(() => {
      document.title = "HSE-PTML | New Incident Report";
   }, []);

   const [formData, setFormData] = useState({
      dateOfIncident: '', dateOfReport: new Date().toISOString().split('T')[0], caseNumber: 'HSE-', consequences: [] as string[],
      incidentLocation: '', typeOfFacility: '', typeOfEquipment: '', incidentCost: '', lostProfit: '',
      teamLeader: '', picJobTitle: '', teamMembers: [''], summary: '', primaryCause: '', recommendations: '',
      dateApproved: '', personInCharge: ''
   });

   const [actionItems, setActionItems] = useState([
      { action: 'Incident alert, Investigation and Photograph', owner: 'HSE Department', date: '' },
      { action: 'Incident alert and Notification', owner: '', date: '' }
   ]);

   const [showDialog, setShowDialog] = useState(false);
   const [uploadError, setUploadError] = useState('');

   const handleInputChange = (field: string, value: string | string[]) => setFormData(prev => ({ ...prev, [field]: value }));

   const handleCaseNumberChange = (value: string) => {
      let formatted = value.toUpperCase();
      
      if (!formatted.startsWith('HSE-')) {
         formatted = 'HSE-';
      }
      
      const afterPrefix = formatted.slice(4);
      
      const digitsOnly = afterPrefix.replace(/\D/g, '');
      
      if (digitsOnly.length <= 3) {
         formatted = `HSE-${digitsOnly}`;
      } else if (digitsOnly.length <= 6) {
         formatted = `HSE-${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
      } else {
         // Limit to 6 digits total
         formatted = `HSE-${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}`;
      }
      
      setFormData(prev => ({ ...prev, caseNumber: formatted }));
   };

   const handleConsequenceToggle = (option: string) => {
      setFormData(prev => ({
         ...prev,
         consequences: prev.consequences.includes(option) ? prev.consequences.filter(c => c !== option) : [...prev.consequences, option]
      }));
   };

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      setUploadError('');
      const maxSize = 1 * 1024 * 1024;

      for (let i = 0; i < files.length; i++) {
         if (files[i].size > maxSize) {
            setUploadError(`File "${files[i].name}" exceeds 1MB. Please upload smaller files.`);
            e.target.value = '';
            return;
         }
      }
   };

   const handleSave = async () => {
      if (!formData.caseNumber || formData.caseNumber === 'HSE-' || !formData.dateOfIncident) {
         alert('Please fill in Case Number and Date of Incident');
         return;
      }

      try {
         const user = auth.currentUser;
         if (!user) {
            alert('You must be logged in to submit a report');
            router.push('/onboarding');
            return;
         }

         await incidentService.createReport({
            dateOfIncident: formData.dateOfIncident,
            dateOfReport: formData.dateOfReport,
            caseNumber: formData.caseNumber,
            incidentConsequences: formData.consequences,
            incidentLocation: formData.incidentLocation,
            typeOfFacility: formData.typeOfFacility,
            typeOfEquipment: formData.typeOfEquipment,
            incidentCostDirect: formData.incidentCost,
            incidentCostLostProfit: formData.lostProfit,
            teamLeader: formData.teamLeader,
            teamMembers: formData.teamMembers.filter(m => m.trim()).join(', '),
            plc: '',
            plcJobTitle: formData.picJobTitle,
            summaryOfIncident: formData.summary,
            primaryCause: formData.primaryCause,
            recommendations: formData.recommendations,
            actionItems: actionItems.map(item => ({
               description: item.action,
               ownership: item.owner,
               date: item.date
            })),
            dateApproved: formData.dateApproved,
            personInCharge: formData.personInCharge,
            createdAt: new Date().toISOString(),
            createdBy: user.uid
         });

         setShowDialog(true);
      } catch (error) {
         console.error('Save error:', error);
         alert('Failed to save report. Please try again.');
      }
   };

   const resetForm = () => {
      setFormData({
         dateOfIncident: '', dateOfReport: new Date().toISOString().split('T')[0], caseNumber: 'HSE-', consequences: [],
         incidentLocation: '', typeOfFacility: '', typeOfEquipment: '', incidentCost: '', lostProfit: '',
         teamLeader: '', picJobTitle: '', teamMembers: [''], summary: '', primaryCause: '', recommendations: '',
         dateApproved: '', personInCharge: ''
      });
      setActionItems([
         { action: 'Incident alert, Investigation and Photograph', owner: 'HSE Department', date: '' },
         { action: 'Incident alert and Notification', owner: '', date: '' }
      ]);
      setUploadError('');
      setShowDialog(false);
   };

   return (
      <div className="min-h-screen bg-gray-50 print:bg-white font-poppins">
         <style jsx>{`
            body {
               overflow: ${showDialog ? 'hidden' : 'auto'};
            }
         `}</style>
         <div className="print:hidden"><Header /></div>
         <div className="max-w-5xl mx-auto px-6 py-8">
            <Link href="/dashboard" className="flex items-center text-green-700 hover:text-green-800 mb-6 print:hidden">
               <ChevronLeft className="w-5 h-5" /><span className="ml-1">Back to Dashboard</span>
            </Link>

            <div id="report-content" className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
               <h2 className="text-3xl font-bold text-green-700 mb-8">INCIDENT REPORT FORM</h2>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                     { label: 'Date of Incident:', type: 'date', field: 'dateOfIncident', required: true },
                     { label: 'Date of Report:', type: 'date', field: 'dateOfReport', required: true }
                  ].map(inp => (
                     <div key={inp.field}>
                        <label className="block text-sm font-semibold text-green-700 mb-2">{inp.label}{inp.required && <span className="text-red-600 ml-1">*</span>}</label>
                        <input type={inp.type} value={formData[inp.field as keyof typeof formData] as string} onChange={(e) => handleInputChange(inp.field, e.target.value)} required={inp.required} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" />
                     </div>
                  ))}
                  <div>
                     <label className="block text-sm font-semibold text-green-700 mb-2">Case Number:<span className="text-red-600 ml-1">*</span></label>
                     <input type="text" value={formData.caseNumber} onChange={(e) => handleCaseNumberChange(e.target.value)} placeholder="HSE-XXX-XXX" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" maxLength={11} />
                  </div>
               </div>

               <div className="mb-8">
                  <label className="block text-sm font-semibold text-green-700 mb-3">{"INCIDENT CONSEQUENCES (Kindly check all that apply)"}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
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
                     { label: 'INCIDENT LOCATION', field: 'incidentLocation', placeholder: 'Where did the incident take place?', required: true },
                     { label: 'TYPE OF FACILITY', field: 'typeOfFacility', placeholder: 'State the facility type', required: true }
                  ].map(inp => (
                     <div key={inp.field}>
                        <label className="block text-sm font-semibold text-green-700 mb-2">{inp.label}{inp.required && <span className="text-red-600 ml-1">*</span>}</label>
                        <input type="text" value={formData[inp.field as keyof typeof formData] as string} onChange={(e) => handleInputChange(inp.field, e.target.value)} placeholder={inp.placeholder} required={inp.required} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0" />
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
                        <input type="text" value={m} onChange={(e) => handleInputChange('teamMembers', formData.teamMembers.map((tm, idx) => idx === i ? e.target.value : tm))} placeholder="Team member name" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent print:border-0 w-full" />
                        {formData.teamMembers.length > 1 && (
                           <button onClick={() => handleInputChange('teamMembers', formData.teamMembers.filter((_, idx) => idx !== i))} className="text-red-600 hover:text-red-700 print:hidden cursor-pointer"><X className="w-5 h-5" /></button>
                        )}
                     </div>
                  ))}
                  <button onClick={() => handleInputChange('teamMembers', [...formData.teamMembers, ''])} className="mt-2 flex items-center text-green-600 hover:text-green-700 print:hidden cursor-pointer"><Plus className="w-4 h-4 mr-1" />Add Team Member</button>
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
                                       <button onClick={() => setActionItems(actionItems.filter((_, idx) => idx !== i))} className="text-red-600 hover:text-red-700 cursor-pointer"><X className="w-4 h-4" /></button>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  <button onClick={() => setActionItems([...actionItems, { action: '', owner: '', date: '' }])} className="mt-3 flex items-center text-green-600 hover:text-green-700 print:hidden cursor-pointer"><Plus className="w-4 h-4 mr-1" />Add Action Item</button>
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

               <div className="mb-8 print:hidden">
                  <label className="block text-sm font-semibold text-green-700 mb-2">ATTACHMENTS (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                     <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 mb-2">Kindly upload an attachment (images, videos or documents)</p>
                        <p className="text-sm text-gray-500 mb-3">Maximum file size: 1MB per file</p>
                        {uploadError && <p className="text-red-600 text-sm mb-3">{uploadError}</p>}
                        <input type="file" multiple className="hidden" id="file-upload" accept="image/*,video/*,.pdf,.doc,.docx" onChange={handleFileUpload} />
                        <label htmlFor="file-upload" className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                           Browse Document
                        </label>
                     </div>
                  </div>
               </div>

               <div className="flex flex-wrap gap-4 print:hidden">
                  <button onClick={() => window.print()} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors cursor-pointer">
                     <Printer className="w-5 h-5 mr-2" />Print Report
                  </button>
                  <button onClick={handleSave} className="flex items-center bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg transition-colors cursor-pointer">
                     Save Report
                  </button>
               </div>
            </div>
         </div>

         {showDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden overflow-hidden">
               <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">Report Saved Successfully!</h3>
                  <p className="text-gray-600 mb-6">Your incident report has been saved. Would you like to fill another report?</p>
                  <div className="flex flex-col gap-3">
                     <button onClick={resetForm} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors cursor-pointer">
                        Fill Another Report
                     </button>
                     <button onClick={() => router.push('/reports')} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors cursor-pointer">
                        View Reports
                     </button>
                     <button onClick={() => router.push('/dashboard')} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition-colors cursor-pointer">
                        Back to Dashboard
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
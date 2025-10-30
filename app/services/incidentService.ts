import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { IncidentReport } from "../types/incident";

const COLLECTION_NAME = "incidentReports";

export const incidentService = {
   async createReport(report: Omit<IncidentReport, "id">) {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
         ...report,
         createdAt: new Date().toISOString(),
      });
      return docRef.id;
   },

   async getAllReports(): Promise<IncidentReport[]> {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
      })) as IncidentReport[];
   },

   async getReportById(id: string): Promise<IncidentReport | null> {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
         return { id: docSnap.id, ...docSnap.data() } as IncidentReport;
      }
      return null;
   },

   async updateReport(id: string, report: Partial<IncidentReport>) {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, report);
   },

   async deleteReport(id: string) {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
   },

   async getReportsByUser(userId: string): Promise<IncidentReport[]> {
      const q = query(collection(db, COLLECTION_NAME), where("createdBy", "==", userId), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
      })) as IncidentReport[];
   },
};
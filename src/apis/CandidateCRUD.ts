import axios from "axios"
import { db } from "../FirebaseConf";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore/lite";
import type { CandidateResponse } from "../models/candidate-model";

const collectionRef = collection(db, "candidates");

// export const getCandidates = async (eventId:number) =>{
//     try {
//         const response = await axios.get(`http://localhost:3000/candidates/all/${eventId}`, {
            
//         });
//         return response.data; 
//     } catch (error) {
//         console.error("Error fetching candidates:", error); 
//         throw error; 
//     }
// }

export async function getCandidates(stringEventId: string) {
    try {
        // 1. Create the reference object. 
        // Note: Ensure "EVENTS" matches your actual collection name exactly.
        const eventDocRef = doc(db, "events", stringEventId);
        
        // 2. Query the 'candidates' collection for documents where 'eventId' 
        // matches that specific reference object.
        const q = query(
            collectionRef, 
            where("eventId", "==", eventDocRef)
        );

        const snap = await getDocs(q);
        
        if (snap.empty) {
            console.log("Query returned 0 docs for event:", stringEventId);
            return { data: [] };
        }

        const data = snap.docs.map(d => ({ 
            ...d.data(),
            id: d.id, 
            votes: d.data().totalVotes
        } as unknown as CandidateResponse));

        return { data: data };
    } catch (error) {
        console.error("Critical Firestore Error:", error);
        return { data: [] };
    }
}

export async function addCandidate(data: { name: string; [k: string]: any }) {
  const ref = await addDoc(collectionRef, data);
  return ref.id;
}

export async function getCandidateById(id: string) {
  const ref = doc(db, "candidates", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateCandidate(id: string, updates: any) {
  const ref = doc(db, "candidates", id);
  await updateDoc(ref, updates);
}

export async function deleteCandidate(id: string) {
  const ref = doc(db, "candidates", id);
  await deleteDoc(ref);
}

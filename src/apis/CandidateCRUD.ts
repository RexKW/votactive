import axios from "axios"
import { db, rtdb } from "../FirebaseConf";
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
import { ref, get, child } from "firebase/database";
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
    // 1. Fetch Candidates from Firestore (Static Data)
    const eventDocRef = doc(db, "events", stringEventId);
    const q = query(collectionRef, where("eventId", "==", eventDocRef));
    const snap = await getDocs(q);

    if (snap.empty) {
      return { data: [] };
    }

    // 2. Fetch Votes from Realtime Database (Dynamic Data)
    // We map over the Firestore results and create a request for each candidate's votes
    const candidatesWithVotes = await Promise.all(
      snap.docs.map(async (d) => {
        const candidateData = d.data();
        const candidateId = d.id;

        // Reference to: candidates/{candidateId}/votes
        // Based on your screenshot image_3f1b75.png
        const voteRef = ref(rtdb, `candidates/${candidateId}/votes`);
        
        let voteCount = 0;
        try {
          const voteSnap = await get(voteRef);
          if (voteSnap.exists()) {
            voteCount = voteSnap.val(); // Should return the number (e.g., 10)
          }
        } catch (err) {
          console.error(`Error fetching votes for ${candidateId}`, err);
        }

        return {
          id: candidateId,
          ...candidateData,
          totalVotes: voteCount, // Overwrites any stale 'totalVotes' from Firestore
        } as unknown as CandidateResponse;
      })
    );

    return { data: candidatesWithVotes };
  } catch (error) {
    console.error("Critical Error fetching candidates:", error);
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

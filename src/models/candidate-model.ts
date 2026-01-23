import type { DocumentReference } from "firebase/firestore/lite";
import type { VoteResponse } from "./vote-model"

export interface CreateUpdateCandidateRequest {
    name: string
    image?: string
    eventId: number
}



export interface CandidateResponse {
    id: string; // Document IDs in Firestore are always strings
    name: string;
    image: string | null; 
    eventId: DocumentReference; // This matches the Reference type in your screenshot
    votes?: any[]; // Optional, depending on if you fetch subcollections
    totalVotes: number;
}


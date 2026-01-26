import type { CandidateResponse, CreateUpdateCandidateRequest } from "./candidate-model"



export interface CreateUpdateEventRequest{
    name: string
    coverImage?: string
    location: string
    description: string
    price: number
    details: string
    startDate: Date
    endDate: Date
}

export interface EventFormData {
  name: string;
  coverImage?: string;
  location: string;
  description: string;
  price: number;
  details: string;
  startDate: string; // ✅ string for <input type="date" />
  endDate: string;   // ✅ string
}

export interface EventResponse{
    id: string
    coverImage?: string
    location: string
    description: string
    price: number
    name: string
    details: string
    startDate: Date
    endDate: Date

}

export interface EventWithCandidatesResponse extends EventResponse{
    candidates: CandidateResponse[]
}


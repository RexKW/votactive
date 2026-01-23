import axios from "axios"
import type { EventResponse } from "../models/event-model";
import { db } from "../FirebaseConf";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore/lite";

const collectionRef = collection(db, "events");

export async function getEvents() {
  const snap = await getDocs(collectionRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data(),
      startDate: d.data().startDate?.toDate ? d.data().startDate.toDate() : d.data().startDate,
        endDate: d.data().endDate?.toDate ? d.data().endDate.toDate() : d.data().endDate, } as any as EventResponse));
}

export async function getActiveEvents() {
  try {
    const snap = await getDocs(collectionRef);
    
    const data = snap.docs.map(d => ({ 
      id: d.id, 
      ...d.data(),
      startDate: d.data().startDate?.toDate ? d.data().startDate.toDate() : d.data().startDate,
        endDate: d.data().endDate?.toDate ? d.data().endDate.toDate() : d.data().endDate,
    } as any as EventResponse));

    // Returning it in the structure your Home.tsx expects (fetchedEvents.data)
    return { data: data }; 
  } catch (error) {
    console.error("Error fetching active events:", error);
    throw error;
  }
}

export async function getEventById(eventId: string) {
  try {
    // Create a reference to the specific document
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Return the data in the format your component expects
      return { data: { 
        id: docSnap.id, 
        ...docSnap.data() ,
             startDate: docSnap.data().startDate?.toDate ? docSnap.data().startDate.toDate() : docSnap.data().startDate,
        endDate: docSnap.data().endDate?.toDate ? docSnap.data().endDate.toDate() : docSnap.data().endDate,
    } as any as EventResponse };
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
}

export async function createEvent(eventData: any) {
  try {
    const createdRef = await addDoc(collectionRef, eventData);
    return { id: createdRef.id, data: eventData };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function updateEvent(eventId: string, eventData: any) {
  try {
    const docRef = doc(db, 'events', eventId);
    await updateDoc(docRef, eventData);
    return { id: eventId };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const docRef = doc(db, 'events', eventId);
    await deleteDoc(docRef);
    return { id: eventId };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}



// export const createEvent = async (eventData: any, token:string) =>{
//     try{
//         const form = new FormData();

//     // Append event fields
//     form.append("name", eventData.name);
//     form.append("price", String(eventData.price));
//     form.append("details", eventData.details);
//     form.append("startDate", eventData.startDate);
//     form.append("endDate", eventData.endDate);

//     // Optional
//     if (eventData.coverImage) {
//       form.append("coverImage", eventData.coverImage);
//     }

//     // Candidates (must be sent as string!)
//     form.append("candidates", JSON.stringify(eventData.candidates));
//         const response = await axios.post("http://localhost:3000/events", form, {
//             headers: { 'Content-Type': 'multipart/form-data', "X-API-TOKEN": token}
//         });
//         return response.data;
//     }catch(error){
//         console.error("Error creating event:", error);
//         throw error;
//     }
// }

// export const getEvents = async (token:string) =>{
//     try {
//         const response = await axios.get("http://localhost:3000/events", {
//             headers: { "Content-Type": "application/json", "X-API-TOKEN": token}
//         });
//         return response.data; 
//     } catch (error) {
//         console.error("Error fetching events:", error); 
//         throw error; 
//     }
// }

// export const getActiveEvents = async () =>{
//     try {
//         const response = await axios.get("http://localhost:3000/events/active", {
            
//         });
//         return response.data; 
//     } catch (error) {
//         console.error("Error fetching active events:", error); 
//         throw error; 
//     }
// }

// export const getEventById = async (eventId:number) =>{
//     try {
//         const response = await axios.get(`http://localhost:3000/events/${eventId}`, {   
//         });
//         return response.data; 
//     } catch (error) {
//         console.error("Error fetching event:", error); 
//         throw error; 
//     }
// }

// export const deleteEvent = async (eventId:number, token:string) =>{
//     try {
//         const response = await axios.delete(`http://localhost:3000/events/${eventId}`, {
//             headers: { "Content-Type": "application/json", "X-API-TOKEN": token}
//         });
//         return response.data; 
//     } catch (error) {
//         console.error("Error deleting event:", error); 
//         throw error; 
//     }       
// }

// export const updateEvent = async (eventId:number, eventData:any, token:string) =>{
//     try {
//         const response = await axios.put(`http://localhost:3000/events/${eventId}`, eventData, {    
//             headers: { 'Content-Type': 'multipart/form-data', "X-API-TOKEN": token}
//         });
//         return response.data; 
//     } catch (error) {
//         console.error("Error updating event:", error); 
//         throw error; 
//     }       
// }
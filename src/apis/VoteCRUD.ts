import axios from "axios"

export const vote = async (voteData: any, token:string) =>{
    try{
        const response = await axios.post("http://localhost:3000/votes", {
            voteData
        }, {
            headers: { 'Content-Type': 'multipart/form-data', "X-API-TOKEN": token}
        });
        return response.data;
    }catch(error){
        console.error("Error creating event:", error);
        throw error;
    }
}

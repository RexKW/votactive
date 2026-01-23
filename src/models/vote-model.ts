


export interface CreateUpdateVoteRequest{
    amount: number
    voterId: number
    candidateId: number
    paymentId: number
}

export interface VoteResponse{
    id: number
    amount: number
    voterId: number
    candidateId: number
    paymentId: number

}
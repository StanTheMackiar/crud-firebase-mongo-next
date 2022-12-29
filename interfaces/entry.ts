import { UploadResult } from "firebase/storage";



export interface Entry {
    _id: string,
    image?: string,
    description: string,
    createdAt: number,
    status: EntryStatus,
}




export type EntryStatus = 'pending' | 'in-progress' | 'finished';
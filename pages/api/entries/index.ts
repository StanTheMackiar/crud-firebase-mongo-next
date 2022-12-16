import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../firebase/firebase';
import { collection, getDocs, query, doc, getDoc, addDoc, deleteDoc, updateDoc, setDoc, where } from "firebase/firestore";
import { Entry } from '../../../interfaces';


type Data = 
    | { message: string }
    | Entry[]
    | Entry


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getEntries( res );

        case 'POST':
            return postEntry( req, res );

        case 'PUT':
            return postEntry( req, res );

            
        default:
            return  res.status(400).json({ message: 'Endpoint no existe' })
    }
}


const getEntries = async( res: NextApiResponse<Data>) => {

}

const postEntry = async( req: NextApiRequest, res: NextApiResponse<Data>) => {



}
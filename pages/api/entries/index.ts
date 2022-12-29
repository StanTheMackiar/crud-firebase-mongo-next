import type { NextApiRequest, NextApiResponse } from 'next'
import { db, storage } from '../../../firebase/firebase';
import { collection, getDocs, query, addDoc, QuerySnapshot, CollectionReference } from "firebase/firestore";
import { Entry } from '../../../interfaces';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

type Data = 
    | { message: string }
    | Entry[]
    | Entry


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getEntries( req, res );

        case 'POST':
            return postEntry( req, res );

        case 'PUT':
            return postEntry( req, res );

        default:
            return res.status(400).json({ message: 'Endpoint no existe' })
    }
}


const getEntries = async( req: NextApiRequest , res: NextApiResponse<Data>) => {

    const abort = setTimeout(()=> res.status(500).send({
        message: "Se agoto el tiempo de espera"
    }), 5000)
    
    try {
        const querySnapshot = await getDocs(query(collection(db, 'Entries'))) as QuerySnapshot<Entry>;

        clearTimeout(abort)
        
        const entries: Entry[] = [];

        querySnapshot.forEach( doc => 
            entries.push({
                ...doc.data(),
                _id: doc.id,
            })
        );

        return res.status(200).json(entries)

    } catch (err) {
        console.log(err)
        res.status(500).send({message: 'Error en el servidor'})
    }
}

const postEntry = async( req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { description = '', imageUrl = '' } = req.body as { description: string, imageUrl: string };

    const entry: Entry = {
        description,
        createdAt: Date.now(),
        status: 'pending',
        image: imageUrl,
        _id: "tempid"
    }
    
    const entryRef = collection(db, 'Entries') as CollectionReference<Entry>;
    
    try {
        const entryAdded = await addDoc(entryRef, entry)
        return res.status(200).send({
            ...entry,
            _id: entryAdded.id,
        })
    
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Firebase server error, check logs' });
    }
  


}
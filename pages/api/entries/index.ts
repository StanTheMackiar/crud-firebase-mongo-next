import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../firebase/firebase';
import { collection, getDocs, query, addDoc } from "firebase/firestore";
import { Entry } from '../../../interfaces';

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
    const querySnapshot = await getDocs(query(collection(db, 'Entries')));
    
    clearTimeout(abort)
    const entries = [] as Entry[];

    querySnapshot.forEach((doc) => 
        entries.push({
            ...doc.data(),
            _id: doc.id,
        } as any)
      );

    return res.status(200).json(entries)

    } catch (err) {
        console.log(err)
        res.status(500).send({message: 'Error en el servidor'})
    }
}

const postEntry = async( req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { description } = req.body;

    const entry: Entry = {
        description,
        createdAt: Date.now(),
        status: 'pending',
    }

    
    const entryRef = collection(db, 'Entries');
    const entryAdded = await addDoc(entryRef, entry)

    //! Agregar entry con id personalizado
    // await setDoc(doc(entryRef, 'ID1'), entry)

    return res.status(200).send({
        ...entry,
        _id: entryAdded.id
    } as any)

}
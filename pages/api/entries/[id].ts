import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../firebase/firebase';
import { doc, getDoc, deleteDoc, updateDoc, DocumentReference } from "firebase/firestore";
import { Entry } from '../../../interfaces';

type Data = 
  |  { message: string }
  |  Entry


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'PUT':
                return updateEntry( req, res );
        case 'GET':
                return getEntry( req, res )
        case 'DELETE':
                return deleteEntry( req, res )
        default:
            return res.status(400).json( { message: 'El metodo no existe ' + req.method } )

    }
}

const getEntry = async( req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query

    const docRef = doc(db, 'Entries', `${id}`) as DocumentReference<Entry>;
    const entry = await getDoc<Entry>(docRef)

    if ( !entry.exists() ) {
        return res.status(400).json({ message: 'The ID is not exist in the data base: ' + id })
    }

    return res.status(200).send({
        ...entry.data(), 
        _id: entry.id 
    })

}

const deleteEntry = async( req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query

    const docRef = doc(db, "Entries", `${id}`) as DocumentReference<Entry>;
    const entryToDelete = await getDoc<Entry>(docRef);

    if ( !entryToDelete.exists() ) {
        return res.status(400).json({ message: 'The ID is not exist in the data base: ' + id })
    }

    await deleteDoc(docRef)

    return res.status(200).send({
        ...entryToDelete.data(), 
        _id: entryToDelete.id 
    })

}



const updateEntry = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { id } = req.query;

    const entryRef = doc(db, 'Entries', `${id}`) as DocumentReference<Entry>
    const entry = await getDoc<Entry>(entryRef)
    
    if ( !entry.exists() ) {
        return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id })
    } 
    
    const entryToUpdate = entry.data();

    const {
        description = entryToUpdate.description, 
        status = entryToUpdate.status,
        image = entryToUpdate.image,
    } = req.body as Entry;

    try {
        await updateDoc(entryRef, {
            description,
            status,
            image,
        })

        const entryUpdated = await getDoc<Entry>(entryRef)

        return res.status(200).json({
            ...entryUpdated.data()!,
            _id: entryUpdated.id,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error en el servidor'});
    }
}
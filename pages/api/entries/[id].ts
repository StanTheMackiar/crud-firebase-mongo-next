import { EntryRes } from './../../../interfaces/entry';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../firebase/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
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

    const docRef = doc(db, 'Entries', `${id}`)
    const entry = await getDoc(docRef)

    if ( !entry.exists() ) {
        return res.status(400).json({ message: 'The ID is not exist in the data base: ' + id })
    }

    return res.status(200).send({
        ...entry.data(), 
        _id: entry.id 
    } as any)

}

const deleteEntry = async( req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query

    const docRef = doc(db, "Entries", `${id}`);
    const entryToDelete = await getDoc(docRef);

    if ( !entryToDelete.exists() ) {
        return res.status(400).json({ message: 'The ID is not exist in the data base: ' + id })
    }

    await deleteDoc(docRef)

    return res.status(200).send({
        ...entryToDelete.data(), 
        _id: entryToDelete.id 
    } as any)

}



const updateEntry = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { id } = req.query;

    const entryRef = doc(db, 'Entries', `${id}`)
    const entry = await getDoc(entryRef)
    
    if ( !entry.exists() ) {
        return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id })
    } 
    
    const entryToUpdate = entry.data();

    const {
        description = entryToUpdate.description, 
        status = entryToUpdate.status,
    } = req.body;

    try {
        await updateDoc(entryRef, {
            description,
            status
        })
        const entryUpdated = await getDoc(entryRef)

        return res.status(200).json( {
            ...entryUpdated.data(),
            _id: entryUpdated.id,
        } as any);

    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: error.errors.status.message});
    }

    //  OTRA MANERA DE HACERLO
    // entryToUpdate.description = description;
    // entryToUpdate.status = status;
    // await entryToUpdate.save();
}
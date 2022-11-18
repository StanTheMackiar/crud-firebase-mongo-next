import { isValidObjectId } from 'mongoose';
import { db } from '.';
import { Entry, IEntry } from '../models';


export const getEntryById = async( id: string ): Promise<IEntry | null> => {

    if ( !isValidObjectId ) return null;

    await db.connect();
    const entry = await Entry.findById(id).lean();
    await db.disconnect();

    return JSON.parse( JSON.stringify(entry) );


}
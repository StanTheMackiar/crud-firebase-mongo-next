import mongoose, { Model, Schema } from "mongoose";
import { Entry } from "../interfaces";

export interface IEntry extends Entry {}

const entryShema = new Schema({
    description: { type: String, required: true },
    createdAt: { type: Number },
    status: {
        type: String,
        enum: {
            values: ['pending', 'in-progress', 'finished'],
            message: '{VALUE} is not a allowed state '
        },
        default: 'pending',
    }
});


const EntryModel: Model<IEntry> = mongoose.models.Entry || mongoose.model('Entry', entryShema)



export default EntryModel;
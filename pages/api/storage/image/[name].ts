import { deleteObject, ref } from 'firebase/storage'
import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '../../../../firebase/firebase'

export type DeleteImageData = { message: string }


export default function handler(req:NextApiRequest, res: NextApiResponse) {

    if (req.method === "DELETE")
        return deleteImage( req, res )

    return res.status(400).json({ message: 'Bad request', url: '' })
}




const deleteImage = async(req: NextApiRequest, res: NextApiResponse<DeleteImageData>) => {

    const { name } = req.query as { name: string }

    const path = `Images/${name}`
    const storageRef = ref(storage, path)

    try {
        console.log('Deleting...');
        await deleteObject(storageRef);
        console.log('Delete OK');
   
        return res.status(200).send({
            message: "Deleted successfully",
        })

    } catch (err) {
        console.log(err);
        console.log('Operation failed');
        return res.status(500).send({ message: "Internal server error" });
    }

}
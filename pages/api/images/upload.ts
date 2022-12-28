import { ref, uploadString } from 'firebase/storage'
import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '../../../firebase/firebase'

type Data = {
   message: string
}

export default function handler(req:NextApiRequest, res: NextApiResponse<Data>) {

   switch ( req.method ) {

       case 'POST':
            return uploadImage( req, res )

       default:
           return res.status(400).json({ message:'Bad request'})
   }

}


const uploadImage = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { image } = req.body as { image: string };
    const storageRef = ref(storage, 'Images/' + Date.now())

    try {
        const uploadTask = await uploadString(storageRef, image, 'data_url')
        console.log({uploadTask})

        return res.status(200).send({
            message: "Upload successfully"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: "Internal server error"
        })
    }

}
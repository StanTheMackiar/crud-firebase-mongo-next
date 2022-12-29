import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '../../../firebase/firebase'

export type UploadImageData = 
| { message: string, url: string }

export default function handler(req:NextApiRequest, res: NextApiResponse<UploadImageData>) {

   switch ( req.method ) {

       case 'POST':
            return uploadImage( req, res )

       default:
           return res.status(400).json({ message: 'Bad request', url: '' })
   }

}


const uploadImage = async(req: NextApiRequest, res: NextApiResponse<UploadImageData>) => {

    const { image } = req.body as { image: string };
    const storageRef = ref(storage, 'Images/' + Date.now())

    try {
        console.log('Uploading...')
        const uploadTask = await uploadString(storageRef, image, 'data_url')
        console.log('Upload OK')
        const imageUrl = await getDownloadURL(uploadTask.ref)
   
        return res.status(200).send({
            message: "Upload successfully",
            url: imageUrl
        })

    } catch (err) {
        console.log(err)
        console.log('Upload failed')
        return res.status(500).send({ message: "Internal server error", url: '' })
    }

}
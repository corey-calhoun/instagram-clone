import React, { useState } from 'react'
import './ImageUpload.css'
import { Button, Input } from '@material-ui/core'

function ImageUpload() {
    const [image, setImage] = React.useState(null);
    const [progress, setProgress] = React.useState(0);
    const [caption, setCaption] = React.useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) { // get first file
            setImage(e.target.files[0]); // set image and state to file
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress bar function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            }
        )
    }

    return (
        <div className='image-upload'>
            {/* Caption Input Field */}
            {/* File picker/upload section */}
            {/* Post button */}

            <div>
               <Input type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.value)} value={caption}/> 
               <Input type="file" onChange={handleChange} />
               <Button onClick={handleUpload}>
                   Upload
               </Button>
            </div>
        </div>
    )
}

export default ImageUpload

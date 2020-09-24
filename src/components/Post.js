import React from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'

function Post({ username, caption, imageUrl }) {
    return (
        <div className="post">
            <div className="postHeader">
               <Avatar
                src="/assets/avatar.png"
                className="postAvatar"
                // alt="JohnDoe"
                />
                <h3>{username}</h3> 
            </div>
            <img 
            src={imageUrl}
            className="postImage" 
            alt="user" 
            />
            <h4 className="postText"><strong>{username}</strong> {caption}</h4>
        </div>
    )
}

export default Post

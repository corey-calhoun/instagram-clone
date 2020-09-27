import React, {useState, useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../firebase';

function Post({ postId, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                });
        }

        return () => {
            unsubscribe();
        }
    }, [postId]);

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
            
            <form>
                <input
                 className="post-input"
                 type="text"
                 placeholder="Add a comment..."
                 value={comments}
                 onChange={(e) => setComments(e.target.value)}
                />
            </form>

        </div>
    )
}

export default Post

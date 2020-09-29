import React, {useState, useEffect} from 'react'
import './Post.css'
import { Button, Avatar } from '@material-ui/core'
import { db } from '../firebase';
import firebase from 'firebase'

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                });
        }

        return () => {
            unsubscribe();
        }
    }, [postId]);


    const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

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

            <div className="post-comments">
                {comments.map((comment) => (
                    <p>
                        <b>{comment.username}</b> {comment.text}
                    </p>
                ))}
            </div>
            
            <form className="comment-box">
                <input
                 className="post-input"
                 type="text"
                 placeholder="Add a comment..."
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
                />
                <Button
                 variant="contained"
                 color="primary"
                 className="post-button"
                 type="submit"
                 onClick={postComment}
                >
                Post
                </Button>
            </form>
        </div>
    )
}

export default Post

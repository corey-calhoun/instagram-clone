import React, { useState, useEffect} from 'react';
import './App.css';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Post from './components/Post'
import { db, auth } from './firebase'
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';
import { TwitchPlayer } from 'react-twitch-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]); 
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user logged in 
        console.log(authUser);
        setUser(authUser);
      } else {
        //user logged out
        setUser(null);
      }
    })
    return () => {
      // cleanup action
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    // this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => { // puts most recent timestamp image first
      //every time a new post is added, this code runs
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password) //creates users
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message)); //catches errors and displays an alert

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
     .signInWithEmailAndPassword(email, password)
     .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal 
       open={open}
       onClose={() => setOpen(false)}
       >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-sign-up">
            <center>
            <img 
             className="app-header-image" 
             src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
             alt="Instagram Logo" 
            />
            </center>
            <Input 
             type="text"
             placeholder="username"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
             type="text"
             placeholder="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
             type="text"
             placeholder="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
             variant="contained"
             color="secondary"
             type="submit"
             onClick={signUp}>
             Sign Up
            </Button>       
          </form>
        </div>
      </Modal>
      
      <Modal 
       open={openSignIn}
       onClose={() => setOpenSignIn(false)}
       >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-sign-up">
            <center>
            <img 
             className="app-header-image" 
             src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
             alt="Instagram Logo" 
            />
            </center>
            <Input 
             type="text"
             placeholder="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
             type="text"
             placeholder="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
             variant="contained"
             color="secondary"
             type="submit"
             onClick={signIn}>
             Sign In
            </Button>       
          </form>
        </div>
      </Modal>

      <div className="app-header">
        <img 
        className="app-header-image" 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
        alt="" 
        />

        {user ? (
        <Button 
         variant="contained"
         color="primary"
         onClick={() => auth.signOut()}>Logout</Button>
        
      ): (
        <div className="login-container">
          <Button 
            variant="contained"
            color="primary"
            onClick={() => setOpenSignIn(true)}>Sign In
          </Button>

          <Button 
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}>Sign Up
          </Button>
        </div>
        
      )}
      
      </div>

      <div className="main-container">
        <div className="app-posts">
          <div className="posts-left">

          {user?.displayName ? (
            <ImageUpload username={user.displayName} />  // If user is logged in, SHOW UPLOAD MODAL
          ): (
            null // If user not logged in, DO NOT SHOW MODAL
          )}

            {
              posts.map(({id, post}) => (
                <Post 
                key={id}
                postId={id}
                user={user}
                username={post.username} 
                caption={post.caption} 
                imageUrl={post.imageUrl}
                />
              ))
            }
          </div>

          <div className="posts-right">
              <TwitchPlayer 
                channel_id="189224096"
                channel="black_ice573"
                game="just chatting"
                video_id="779913343"
                autoplay={true}
                disableAudio={false}
              />
            </div>

        </div>
      </div>

      

      
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Post from './components/Post'
import { db, auth } from './firebase'
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';


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
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = React.useState([]); 
  const [open, setOpen] = React.useState(false);
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const [username, setUsername] = React.useState(''); 
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
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

  React.useEffect(() => {
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
          <form className="appSignUp">
            <center>
            <img 
             className="appHeaderImage" 
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
          <form className="appSignUp">
            <center>
            <img 
             className="appHeaderImage" 
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

      <div className="appHeader">
        <img 
        className="appHeaderImage" 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
        alt="" 
        />

        {user ? (
        <Button 
         variant="contained"
         color="secondary"
         onClick={() => auth.signOut()}>Logout</Button>
        
      ): (
        <div className="loginContainer">
          <Button 
            variant="outlined"
            color="secondary"
            onClick={() => setOpenSignIn(true)}>Sign In
          </Button>

          <Button 
            variant="outlined"
            color="secondary"
            onClick={() => setOpen(true)}>Sign Up
          </Button>
        </div>
        
      )}
      
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ): (
        <h3>Please log in to upload</h3>
      )}
      

      {
        posts.map(({id, post}) => (
          <Post 
          key={id}
          username={post.username} 
          caption={post.caption} 
          imageUrl={post.imageUrl}
          />
        ))
      }
      
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Post from './components/Post'
import { db } from './firebase'
import { Button } from '@material-ui/core';


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

  React.useEffect(() => {
    // this is where the code runs
    db.collection('posts').onSnapshot(snapshot => { 
      //every time a new post is added, this code runs
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id ,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {

  }

  return (
    <div className="app">
      <Modal 
       open={open}
       onClose={() => setOpen(false)}
       >
        <div style={modalStyle} className={classes.paper}>
          <h2>This modal is working</h2>
        </div>
      </Modal>

      <div className="appHeader">
        <img 
        className="appHeaderImage" 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
        alt="Instagram Logo" 
        />
      </div>

      <Button onClick={() => setOpen(true)}>Sign Up</Button>

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

"use client";

import { useState } from 'react';
import styles from "./page.module.css";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorAlert, setErrorAlert] = useState(false);

  const handleErrorAlertClose = () => {
    setErrorAlert(false);
  };

  // Check whether token is already available in localStorage
  const handleClickOpen = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      router.push('/moderator');
    } else {
      setOpen(true);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  // Post credentials to /auth endpoint and get access token
  const handleAuthSubmit = async () => {
    try {
      const response = await fetch(`http://${process.env.moderator_service_url}moderator/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem('jwtToken', data.accessToken);
        router.push('/moderator');
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      setErrorAlert(true);
    }

    handleClose();
  };

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <a
          href="/submitJokes"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2>
            Submit Joke <span>-&gt;</span>
          </h2>
          <p>Submit a joke which you think funny</p>
        </a>

        <a
          href="/viewJokes"
          className={styles.card}
          rel="noopener noreferrer"
        >
          <h2>
            View Jokes <span>-&gt;</span>
          </h2>
          <p>Get a random joke based in the type</p>
        </a>

        <a
          href="#"
          className={styles.card}
          rel="noopener noreferrer"
          onClick={handleClickOpen}
        >
          <h2>
            Moderator <span>-&gt;</span>
          </h2>
          <p>Review the jokes submit by users</p>
        </a>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Login to moderator dashboard
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              label="Email Address"
              fullWidth
              variant="standard"
              onChange={(event) => { setEmail(event.target.value) }}
            />
            <TextField
              autoFocus
              required
              type='password'
              margin="dense"
              label="Password"
              fullWidth
              variant="standard"
              onChange={(event) => { setPassword(event.target.value) }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAuthSubmit}>Login</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={errorAlert} autoHideDuration={3000} onClose={handleErrorAlertClose}>
          <Alert
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Authentication failed
          </Alert>
        </Snackbar>
      </div>
    </main>
  );
}

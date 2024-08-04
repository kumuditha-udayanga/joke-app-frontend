"use client";

import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function SubmitJokes() {
    const [type, setType] = useState('');
    const [joke, setJoke] = useState('');
    const [jokeTypes, setJokeTypes] = useState([]);

    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);


    const handleChange = (event) => {
      setType(event.target.value);
    };

    const handleSuccessAlertClose = () => {
        setSuccessAlert(false);
    };

    const handleErrorAlertClose = () => {
        setErrorAlert(false);
    };

    // Get joke types 
    async function getJokeTypes() {
        const response = await fetch(`http://${process.env.deliver_service_url}deliver/joke-types`)

        if (!response.ok) {
          throw new Error('Failed to fetch joke types');
        };

        const data = await response.json();
        const jokeTypes = data.rows;

        setJokeTypes(jokeTypes);
    }

    // Submit joke 
    async function submitJoke() {
        try {
            const response = await fetch(`http://${process.env.submission_service_url}submission/jokes`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    joke_text: joke,
                    type_id: type
                })
            });

            if(response.status == 200) {
                setSuccessAlert(true);
            } else {
                setErrorAlert(true);
            }
        } catch (err) {
            setErrorAlert(true);
            throw err;
        }
    }

    useEffect(() => {
        getJokeTypes();
    }, []);
  
    return (
        <>
            <h3>Submit Joke</h3>
            <Stack
                component="form"
                sx={{
                    width: '25ch',
                }}
                spacing={2}
                noValidate
                autoComplete="off"
            >
                <InputLabel id="demo-simple-select-label">Joke</InputLabel>
                <TextField
                    id="standard-multiline-flexible"
                    multiline
                    maxRows={4}
                    variant="standard"
                    margin="dense"
                    onChange={(event) =>{setJoke(event.target.value)}}
                    required
                />
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Type"
                    required
                    onChange={handleChange}
                    margin="dense"
                >
                    {jokeTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>{type.type}</MenuItem>
                    ))}
                </Select>
                <Button variant="contained" color="success" onClick={submitJoke}>
                    Submit
                </Button>
            </Stack>
            <Snackbar open={successAlert} autoHideDuration={3000} onClose={handleSuccessAlertClose}>
                <Alert
                    onClose={handleSuccessAlertClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Joke saved successfully
                </Alert>
            </Snackbar>
            <Snackbar open={errorAlert} autoHideDuration={3000} onClose={handleErrorAlertClose}>
                <Alert
                    onClose={handleErrorAlertClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Failed to submit the joke
                </Alert>
            </Snackbar>
        </>
    );
}
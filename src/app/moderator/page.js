"use client";

import { useEffect, useState, useRef } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';

export default function ModeratorJokes() {
    const router = useRouter();
    const [jokeTypes, setJokeTypes] = useState([]);
    const [jokes, setJokes] = useState([]);
    const [newJokeType, setNewJokeType] = useState('');
    

    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState({});
    const selectRefs = useRef({}); 

    const handleSelectChange = (event, jokeId) => {
        setSelectedTypes(prev => ({ ...prev, [jokeId]: event.target.value }));
    };

    const handleSuccessAlertClose = () => {
        setSuccessAlert(false);
    };

    const handleErrorAlertClose = () => {
        setErrorAlert(false);
    };

    // Fetch joke types
    async function getJokeTypes() {
        const response = await fetch(`http://${process.env.deliver_service_url}deliver/joke-types`)

        if (!response.ok) {
          throw new Error('Failed to fetch joke tpyes');
        };

        const data = await response.json();
        const jokeTypes = data.rows;

        setJokeTypes(jokeTypes);
    }

    // Fetch jokes
    async function getJokes() {
        const response = await fetch(`http://${process.env.moderator_service_url}moderator/jokes/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch jokes');
        };

        if (response.status != 204) {
            const data = await response.json();
            setJokes(data);
        }  
    }

    // Submit joke 
    async function submitJoke(jokeId, jokeText) {
        try {
            const selectValue = selectRefs.current[jokeId]?.value || selectedTypes[jokeId];
            const response = await fetch(`http://${process.env.moderator_service_url}moderator/jokes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({
                    joke: jokeText,
                    type: selectValue
                })
            });

            if(response.ok) {
                deleteJoke(jokeId);
                setSuccessAlert(true);
            } else {
                setErrorAlert(true);
            }
        } catch (err) {
            setErrorAlert(true);
            throw err;
        }
    }

    // Delete joke 
    async function deleteJoke(jokeId) {
        try {
            const response = await fetch(`http://${process.env.moderator_service_url}moderator/jokes/${jokeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
    
            if (response.ok) {
                setSuccessAlert(true);
            } else {
                setErrorAlert(true);
            }
        } catch (err) {
            setErrorAlert(true);
            throw err;
        }
    }

    // Create joke 
    async function createJokeType() {
        try {
            const response = await fetch(`http://${process.env.moderator_service_url}moderator/jokes/type/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({
                    type: newJokeType,
                })
            });

            if(response.ok) {
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
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/');
        } else {
            getJokes();
            getJokeTypes();
        }
    }, [successAlert, errorAlert]);
  
    return (
        <>
            <h3>Review Submited Jokes</h3>
            <div style={{marginBottom:"30px"}}>
                <InputLabel id="demo-simple-select-label">Create new joke type</InputLabel>
                <TextField
                    id="standard-multiline-flexible"
                    multiline
                    maxRows={4}
                    variant="standard"
                    margin="dense"
                    onChange={(event) =>{setNewJokeType(event.target.value)}}
                    required
                />
                <Button variant="contained" size={'small'} color="success" onClick={() => createJokeType()} style={{marginLeft:"30px"}}>
                    Create
                </Button>
            </div>
            {jokes.length === 0 ? (
                <Typography>No data available</Typography>
            ) : (
                jokes.map((joke) => (
                    <Card sx={{ minWidth: 275 }} key={joke._id}>
                        <CardContent>
                            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
                                {joke.joke_text}
                            </Typography>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={joke.type_id}
                                label="Type"
                                required
                                onChange={(event) => handleSelectChange(event, joke._id)}
                                margin="dense"
                                inputRef={(ref) => (selectRefs.current[joke._id] = ref)}
                            >
                                {jokeTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>{type.type}</MenuItem>
                                ))};
                            </Select>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" color="success" onClick={() => submitJoke(joke._id, joke.joke_text)}>
                                Approve
                            </Button>
                            <Button variant="contained" color="error" onClick={() => deleteJoke(joke._id)}>
                                Reject
                            </Button>
                        </CardActions>
                    </Card>
                ))
            )}
            <Snackbar open={successAlert} autoHideDuration={3000} onClose={handleSuccessAlertClose}>
                <Alert
                    onClose={handleSuccessAlertClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Success
                </Alert>
            </Snackbar>
            <Snackbar open={errorAlert} autoHideDuration={3000} onClose={handleErrorAlertClose}>
                <Alert
                    onClose={handleErrorAlertClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Failed
                </Alert>
            </Snackbar>
        </>
    );
}
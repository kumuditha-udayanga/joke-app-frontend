"use client";

import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function ViewJokes() {
    const [type, setType] = useState('');
    const [jokeTypes, setJokeTypes] = useState([]);
    const [jokes, setJokes] = useState([]);

    const handleChange = (event) => {
      setType(event.target.value);
    };

    async function getJokeTypes() {
        const response = await fetch(`http://${process.env.deliver_service_url}deliver/joke-types`)

        if (!response.ok) {
          throw new Error('Failed to fetch joke types');
        };

        const data = await response.json();
        const jokeTypes = data.rows;

        setJokeTypes(jokeTypes);
    }

    async function getRadmonJokes(type_id) {
        const response = await fetch(`http://${process.env.deliver_service_url}deliver/jokes/${type_id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch jokes');
        };

        if(response.status != 204) {
            const data = await response.json();
            const jokes= data.rows;
            setJokes(jokes);
        }
    }

    useEffect(() => {
        getJokeTypes();
    }, []);
  
    return (
        <>
            <h3>View Jokes</h3>
            <div style={{margin: '20px'}}>
                <Stack
                    component="form"
                    sx={{
                        width: '25ch',
                    }}
                    spacing={2}
                    noValidate
                    autoComplete="off"
                >
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
                    <Button variant="contained" color="success" onClick={() => getRadmonJokes(type)}>
                        Get Random Joke
                    </Button>
                </Stack>
            </div>
            {jokes.length === 0 ? (
                <Typography>No data available</Typography>
            ) : (
            jokes.map((joke) => (
                <Card sx={{ minWidth: 275 }} key={joke.id}>
                    <CardContent>
                        <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
                            Joke: {joke.joke_text}
                        </Typography>
                    </CardContent>
                </Card>
            )))}
        </>
    );
}
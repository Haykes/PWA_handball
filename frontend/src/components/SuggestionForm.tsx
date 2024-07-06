import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface SuggestionFormProps {
    onNewSuggestion: (suggestion: Suggestion) => void;
}

interface Suggestion {
    id: number;
    title: string;
    description: string;
    author: string;
    votes: number;
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({ onNewSuggestion }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newSuggestion = { title, description, author };

        try {
            const response = await fetch('http://localhost:5000/api/suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSuggestion),
            });

            if (!response.ok) {
                throw new Error('La réponse du réseau n\'était pas correcte');
            }

            const suggestion = await response.json();
            onNewSuggestion(suggestion);
            setTitle('');
            setDescription('');
            setAuthor('');
        } catch (error) {
            console.error('Erreur lors de la soumission de la suggestion:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="title"
                label="Titre"
                name="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                autoFocus
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="description"
                label="Description"
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                multiline
                rows={4}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="author"
                label="Auteur"
                id="author"
                value={author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
                Soumettre
            </Button>
        </Box>
    );
};

export default SuggestionForm;

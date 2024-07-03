import React, { useState } from 'react';

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
                throw new Error('Network response was not ok');
            }

            const suggestion = await response.json();
            onNewSuggestion(suggestion);
            setTitle('');
            setDescription('');
            setAuthor('');
        } catch (error) {
            console.error('Error submitting suggestion:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default SuggestionForm;

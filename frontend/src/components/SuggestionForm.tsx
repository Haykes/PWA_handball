import React, { useState, ChangeEvent, FormEvent } from 'react';

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        fetch('/api/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, author })
        })
            .then(response => response.json())
            .then(data => {
                onNewSuggestion(data);
                setTitle('');
                setDescription('');
                setAuthor('');
            });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'title') setTitle(value);
        if (name === 'description') setDescription(value);
        if (name === 'author') setAuthor(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="Description"
                value={description}
                onChange={handleChange}
                required
            ></textarea>
            <input
                type="text"
                name="author"
                placeholder="Your Name"
                value={author}
                onChange={handleChange}
                required
            />
            <button type="submit">Add Suggestion</button>
        </form>
    );
};

export default SuggestionForm;

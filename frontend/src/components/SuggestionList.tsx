import React from 'react';

interface Suggestion {
    id: number;
    title: string;
    description: string;
    author: string;
    votes: number;
}

interface SuggestionListProps {
    suggestions: Suggestion[];
    onVote: (id: number, vote: number) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, onVote }) => {
    return (
        <ul>
            {suggestions.map(suggestion => (
                <li key={suggestion.id}>
                    <h3>{suggestion.title}</h3>
                    <p>{suggestion.description}</p>
                    <p>By: {suggestion.author}</p>
                    <p>Votes: {suggestion.votes}</p>
                    <button onClick={() => onVote(suggestion.id, 1)}>Upvote</button>
                    <button onClick={() => onVote(suggestion.id, -1)}>Downvote</button>
                </li>
            ))}
        </ul>
    );
};

export default SuggestionList;

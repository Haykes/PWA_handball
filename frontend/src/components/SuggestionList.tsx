import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

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
        <List>
            {suggestions.map(suggestion => (
                <ListItem key={suggestion.id} alignItems="flex-start">
                    <ListItemText
                        primary={<Typography variant="h6">{suggestion.title}</Typography>}
                        secondary={
                            <>
                                <Typography component="span" variant="body2" color="textPrimary">
                                    {suggestion.description}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="textSecondary">
                                    By: {suggestion.author}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="textPrimary">
                                    Votes: {suggestion.votes}
                                </Typography>
                            </>
                        }
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => onVote(suggestion.id, 1)}>
                            <ThumbUp />
                        </IconButton>
                        <IconButton edge="end" onClick={() => onVote(suggestion.id, -1)}>
                            <ThumbDown />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};

export default SuggestionList;

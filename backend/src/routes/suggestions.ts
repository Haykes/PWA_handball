import { Router, Request, Response } from 'express';
import { Suggestion } from '../models/Suggestion';

const router = Router();

let suggestions: Suggestion[] = [];

router.get('/', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(suggestions);
});

router.post('/', (req: Request, res: Response) => {
    const { title, description, author } = req.body;
    const newSuggestion = { id: suggestions.length + 1, title, description, author, votes: 0 };
    suggestions.push(newSuggestion);
    res.status(201).json(newSuggestion);
});

router.post('/:id/vote', (req: Request, res: Response) => {
    const { id } = req.params;
    const { vote } = req.body;
    const suggestion = suggestions.find(s => s.id === parseInt(id));
    if (suggestion) {
        suggestion.votes += vote;
        res.json(suggestion);
    } else {
        res.status(404).json({ message: 'Suggestion not found' });
    }
});

export default router;

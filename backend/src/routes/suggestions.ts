import { Router } from 'express';
import { Suggestion } from '../models/Suggestion';
import webPush from '../web-push';

const router = Router();

let suggestions: Suggestion[] = [];
let subscriptions: webPush.PushSubscription[] = []; // Stocke les abonnements

router.get('/', (req, res) => {
    res.json(suggestions);
});

router.post('/', (req, res) => {
    const { title, description, author } = req.body;
    const newSuggestion = { id: suggestions.length + 1, title, description, author, votes: 0 };
    suggestions.push(newSuggestion);

    const notificationPayload = {
        title: 'New Suggestion Added',
        body: `${author} added a new suggestion: ${title}`
    };

    subscriptions.forEach(subscription => {
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
            .catch((error: any) => console.error('Error sending notification, reason: ', error));
    });

    res.status(201).json(newSuggestion);
});

router.post('/:id/vote', (req, res) => {
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

router.post('/subscribe', (req, res) => {
    const subscription: webPush.PushSubscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

export default router;

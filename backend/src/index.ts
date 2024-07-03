import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import suggestionRoutes from './routes/suggestions';
import webPush from './web-push'; // Assurez-vous d'importer webPush correctement

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/suggestions', suggestionRoutes);

let subscriptions: webPush.PushSubscription[] = []; // Déclaration de la variable subscriptions

app.post('/api/subscribe', (req: Request, res: Response) => {
    const subscription: webPush.PushSubscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

// Middleware de gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

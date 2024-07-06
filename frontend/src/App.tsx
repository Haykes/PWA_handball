import React, { useEffect, useState } from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import SuggestionList from './components/SuggestionList';
import SuggestionForm from './components/SuggestionForm';

interface Suggestion {
    id: number;
    title: string;
    description: string;
    author: string;
    votes: number;
}

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const publicVapidKey = 'BDzOIRA-PK1Y7lNneXet9nR4xkIMUMn2jr8t3eHTlljN4rtKM4TxbHNJbIrbAzoMLpAoca1D2aGtShNAhSctFWA';
const applicationServerKey = urlBase64ToUint8Array(publicVapidKey);

const App: React.FC = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/suggestions');
                if (!response.ok) {
                    throw new Error('La réponse du réseau n\'était pas correcte');
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError('La réponse reçue n\'est pas au format JSON');
                }
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des suggestions:', error);
            }
        };
        fetchSuggestions();
    }, []);

    const handleNewSuggestion = (suggestion: Suggestion) => {
        setSuggestions([...suggestions, suggestion]);
    };

    const handleVote = (id: number, vote: number) => {
        fetch(`http://localhost:5000/api/suggestions/${id}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vote })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La réponse du réseau n\'était pas correcte');
                }
                return response.json();
            })
            .then(updatedSuggestion => {
                setSuggestions(suggestions.map(s => (s.id === id ? updatedSuggestion : s)));
            })
            .catch(error => console.error('Erreur lors du vote:', error));
    };

    const subscribeUser = async () => {
        try {
            const swRegistration = await navigator.serviceWorker.ready;
            const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            });
            console.log('L\'utilisateur est abonné:', subscription);

            const response = await fetch('http://localhost:5000/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscription)
            });

            if (!response.ok) {
                throw new Error('Échec de l\'abonnement de l\'utilisateur');
            }
        } catch (error) {
            console.error('Échec de l\'abonnement de l\'utilisateur:', error);
        }
    };

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(() => {
                    subscribeUser();
                })
                .catch(error => {
                    console.error('L\'enregistrement du service worker a échoué:', error);
                });
        }
    }, []);

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Typography variant="h2" component="h1" gutterBottom>
                Boîte à Idées Handball
            </Typography>
            <SuggestionForm onNewSuggestion={handleNewSuggestion} />
            <SuggestionList suggestions={suggestions} onVote={handleVote} />
        </Container>
    );
};

export default App;

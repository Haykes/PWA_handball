import React, { useEffect, useState } from 'react';
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
                    throw new Error('Network response was not ok');
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError('Received response is not JSON');
                }
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
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
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedSuggestion => {
                setSuggestions(suggestions.map(s => (s.id === id ? updatedSuggestion : s)));
            })
            .catch(error => console.error('Error voting:', error));
    };

    const subscribeUser = async () => {
        try {
            const swRegistration = await navigator.serviceWorker.ready;
            const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            });
            console.log('User is subscribed:', subscription);
            const response = await fetch('http://localhost:5000/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscription)
            });
            if (!response.ok) {
                throw new Error('Failed to subscribe the user');
            }
        } catch (error) {
            console.error('Failed to subscribe the user:', error);
        }
    };

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js').then(() => {
                subscribeUser();
            });
        }
    }, []);

    return (
        <div>
            <h1>Handball Idea Box</h1>
            <SuggestionForm onNewSuggestion={handleNewSuggestion} />
            <SuggestionList suggestions={suggestions} onVote={handleVote} />
        </div>
    );
};

export default App;

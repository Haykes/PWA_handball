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

const App: React.FC = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    useEffect(() => {
        fetch('/api/suggestions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setSuggestions(data))
            .catch(error => console.error('Error fetching suggestions:', error));
    }, []);

    const handleNewSuggestion = (suggestion: Suggestion) => {
        setSuggestions([...suggestions, suggestion]);
    };

    const handleVote = (id: number, vote: number) => {
        fetch(`/api/suggestions/${id}/vote`, {
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
        const swRegistration = await navigator.serviceWorker.ready;
        const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY'
        });
        await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });
    };

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            subscribeUser();
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

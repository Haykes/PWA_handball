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
        const fetchSuggestions = async () => {
            try {
                const response = await fetch('/api/suggestions');
                console.log('Response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const contentType = response.headers.get('content-type');
                console.log('Content-Type:', contentType);
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError('Received response is not JSON');
                }
                const text = await response.text();
                console.log('Response Text:', text);
                const data = JSON.parse(text);
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

    const handleVote = async (id: number, vote: number) => {
        try {
            const response = await fetch(`/api/suggestions/${id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vote })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedSuggestion = await response.json();
            setSuggestions(suggestions.map(s => (s.id === id ? updatedSuggestion : s)));
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const subscribeUser = async () => {
        try {
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
        } catch (error) {
            console.error('Failed to subscribe the user:', error);
        }
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

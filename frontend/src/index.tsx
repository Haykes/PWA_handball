import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            navigator.serviceWorker.ready.then(registration => {
                if (registration.pushManager) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: 'BDzOIRA-PK1Y7lNneXet9nR4xkIMUMn2jr8t3eHTlljN4rtKM4TxbHNJbIrbAzoMLpAoca1D2aGtShNAhSctFWA'
                    }).then(subscription => {
                        console.log('User is subscribed:', subscription);
                    }).catch(err => {
                        console.log('Failed to subscribe the user: ', err);
                    });
                }
            });
        }
    });
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

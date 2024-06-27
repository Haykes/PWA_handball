# PWA Handball Idea Box

Cette application est une boîte à idées pour un club de handball sous forme de Progressive Web App (PWA). L'application permet de visualiser l'ensemble des suggestions, de voter pour ou contre chaque suggestion, et d'ajouter une nouvelle suggestion. L'utilisateur peut installer l'application et activer les notifications pour recevoir des alertes à chaque nouvelle publication de suggestion. L'application peut également être utilisée hors ligne ou avec une connexion dégradée.

## Fonctionnalités

- Visualiser l'ensemble des suggestions
- Voter pour ou contre chaque suggestion
- Ajouter une suggestion (titre, description, prénom/nom)
- Possibilité d'installer l'application
- Activer les notifications pour chaque nouvelle suggestion
- Utilisation hors ligne ou avec une connexion dégradée

## Prérequis

- Docker
- Docker Compose

## Installation

1. Clonez le dépôt :

    ```bash
    git clone https://github.com/votre-utilisateur/PWA_handball.git
    cd PWA_handball
    ```

2. Générez les clés VAPID pour les notifications push et mettez-les à jour dans `backend/src/web-push.ts` :

    ```bash
    npx web-push generate-vapid-keys
    ```

   Mettez à jour les clés VAPID dans `backend/src/web-push.ts` :

    ```typescript
    import webPush from 'web-push';

    const publicVapidKey = 'VOTRE_CLE_PUBLIQUE';
    const privateVapidKey = 'VOTRE_CLE_PRIVEE';

    webPush.setVapidDetails(
        'mailto:your-email@example.com',
        publicVapidKey,
        privateVapidKey
    );

    export default webPush;
    ```

## Lancer l'application

1. Assurez-vous que Docker et Docker Compose sont installés sur votre machine.

2. Lancez les services Docker :

    ```bash
    docker-compose up --build -d
    ```

   Cette commande va construire les conteneurs Docker pour le frontend, le backend et la base de données, puis démarrer les services.

## Utilisation

1. Ouvrez votre navigateur et accédez à l'URL suivante pour le frontend :

    ```
    http://localhost:3000
    ```

2. Le serveur backend est accessible à l'URL suivante :

    ```
    http://localhost:5000
    ```

## Structure du projet

- **frontend** : Contient le code source du frontend de l'application (React).
- **backend** : Contient le code source du backend de l'application (Express avec TypeScript).
- **docker-compose.yml** : Fichier de configuration pour Docker Compose.
- **Dockerfile** : Fichier de configuration pour construire l'image Docker pour le frontend et le backend.

## Auteurs

- Haykes - [Mon Profil Github](https://github.com/Haykes)

## License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

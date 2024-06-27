import webPush from 'web-push';

const publicVapidKey = 'BDzOIRA-PK1Y7lNneXet9nR4xkIMUMn2jr8t3eHTlljN4rtKM4TxbHNJbIrbAzoMLpAoca1D2aGtShNAhSctFWA';
const privateVapidKey = 'poSKCVvBlvHdwEl3b7KBRyXaDUPxf2r6SeWbb802R9Q';

webPush.setVapidDetails(
    'mailto:your-email@example.com',
    publicVapidKey,
    privateVapidKey
);

export default webPush;

import express from 'express';
import cors from 'cors';
import suggestionRoutes from './routes/suggestions';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/suggestions', suggestionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

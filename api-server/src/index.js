import express from 'express';
import containerRoutes from './routes/entry.js';

const app = express();

app.use(express.json());

// Use the container routes
app.use('/api/containers', containerRoutes);
    
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

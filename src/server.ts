import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

// Load environment variables 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.listen(Number(PORT), '127.0.0.1', () => {
    console.log(`🚀 Server running securely at http://127.0.0.1:${PORT}`);
});

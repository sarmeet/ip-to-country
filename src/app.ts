import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import config from './config/config';

const app = express();

// Apply security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Trust the X-Forwarded-For header from reverse proxies
app.set('trust proxy', true);

// Apply API routes
app.use('/api', routes);

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;
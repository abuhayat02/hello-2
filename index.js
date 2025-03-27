import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectMongoDB from './config.js';
import userRouter from './routes/routeForUser.js';
import courseRouter from './routes/routeForCours.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();

const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://gyanflow-ca428.web.app',
      'https://gyanflow-ca428.firebaseapp.com',
    ],
    credentials: true,

  })
);
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: '174a1913c25d024e89b90eb29ddbe4ec01ac920c37b2487a7660c9af8c35e999790f4b644852ebce4039ce717c0ccffd2803ed3f28ba45a6019bf2e426bd9524', // নিচে বিস্তারিত ব্যাখ্যা করা হয়েছে
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,  // HTTPS ব্যবহার করলে true রাখুন
    sameSite: 'none',  // Cross-Origin কুকিজের জন্য
  },
}));

connectMongoDB();

app.use('/gyanflow/user', userRouter);
app.use('/gyanflow/cours', courseRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));

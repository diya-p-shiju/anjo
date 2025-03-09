import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './config';
import errorHandler from './middleware/errorHandler';
import fourOhFour from './middleware/fourOhFour';
import root from './routes/root';

import menu from './routes/menu';
import user from './routes/user';
import order from './routes/order';
import review from './routes/review';
import striperouter from './controllers/stripeController';
import inventory from './routes/inventory';


import mongoose from 'mongoose';



import stripeRoutes from './routes/stripeRoutes';
// ... other imports remain the same




const app = express()

// Apply most middleware first
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    optionsSuccessStatus: 200
}))

mongoose.connect("mongodb+srv://diyapshiju:diyapshiju@cluster0.1hwl9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log('DB Connected'))




app.use(helmet())
app.use(morgan('tiny'))

// Apply routes before error handling
app.use('/', root)
app.use('/order', order)
app.use('/menu', menu)
app.use('/user', user)
app.use('/review', review)
app.use('/inventory',inventory)


app.post('/create-checkout-session', striperouter);
// Update the stripe route registration
app.use('/api', stripeRoutes);
    

// Apply error handling last
app.use(fourOhFour)
app.use(errorHandler)



export default app
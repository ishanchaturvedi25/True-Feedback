const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./utils/db');
const userRoutes = require('./routes/user.routes');
const contextRoutes = require('./routes/context.routes');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_APP_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ status: 200, message: "Server is up" });
})

app.use('/api/users', userRoutes);
app.use('/api/contexts', contextRoutes);

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`Server is listening at http://localhost:${PORT}`);
    })
}

startServer();
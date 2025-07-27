const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { connectDB } = require('./utils/db');
const userRoutes = require('./routes/user.routes')

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_APP_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send({ status: 200, message: "Server is up" });
})

app.use('/api/users', userRoutes);

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`Server is listening at http://localhost:${PORT}`);
    })
}

startServer();
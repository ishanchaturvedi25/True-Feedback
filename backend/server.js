const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const http = require('http');

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

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log("Server is listening on port : ", PORT);
})
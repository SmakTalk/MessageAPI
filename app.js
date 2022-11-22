import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import db from './firebase/admin.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/random', async (req, res) => {
    const messageRef = db.collection('messages').doc('message');
    const allMessages = await messageRef.get();
    const count = Object.keys(allMessages.data()).length;
    const random = Math.floor(Math.random() * count);
    const message = Object.values(allMessages.data())[random];
    res.send(message);
});

app.post('/add', async (req, res) => {
    const messageRef = db.collection('messages').doc('message');
    const allMessages = await messageRef.get();
    const messagesJson = allMessages.data();
    const count = Object.keys(messagesJson).length;
    messagesJson[count] = req.body.message;
    const newMessagesJson = await messageRef.set(messagesJson);
    res.send(newMessagesJson);
});

app.listen(port, () => {
    console.log('RESTful API server started on: ' + port);
});
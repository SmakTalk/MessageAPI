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
    res.send('Sending out an SOS...');
});

app.get('/random', async (req, res) => {
    const messages = await getMessages('messages', 'message');
    const messagesArr = messages['MessagesArr'];
    const count = messagesArr.length;
    const random = Math.floor(Math.random() * count);
    const message = messagesArr[random];
    res.send(message);
});

app.post('/add', async (req, res) => {
    const messagesArr = await getMessages('messages', 'message');
    messagesArr['MessagesArr'].push(req.body.message);
    const newMessagesArr = await sendMessage('messages', 'message', messagesArr);
    res.send(newMessagesArr);
});

app.listen(port, () => {
    console.log('RESTful API server started on: ' + port);
});

const getMessages = async (collectionName, docName) => {
    const dataRef = db.collection(collectionName).doc(docName);
    const rawData = await dataRef.get();
    return rawData.data();
}

const sendMessage = async (collectionName, docName, data) => {
    const dataRef = db.collection(collectionName).doc(docName);
    const rawData = await dataRef.set(data);
    return rawData;
}
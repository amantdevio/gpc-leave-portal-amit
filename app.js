const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let leaveRequests = [];

// Navigation Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin-panel', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));

// API Routes
app.get('/get-requests', (req, res) => res.json(leaveRequests));

app.post('/submit', (req, res) => {
    const newReq = { id: Date.now(), ...req.body, status: "Pending" };
    leaveRequests.push(newReq);
    res.send(`
        <div style="text-align:center; padding:50px; font-family:sans-serif;">
            <h2 style="color:#2563eb;">Submission Successful!</h2>
            <p>Your HOD will review it shortly.</p>
            <a href="/">Back to Home</a>
        </div>
    `);
});

app.post('/update', (req, res) => {
    const { id, status } = req.body;
    let record = leaveRequests.find(r => r.id == id);
    if (record) record.status = status;
    res.redirect('/admin-panel');
});

const PORT = process.env.PORT||3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
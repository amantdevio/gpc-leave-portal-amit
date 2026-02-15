const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let leaveRequests = [];

// API Routes
app.get('/.netlify/functions/api/get-requests', (req, res) => res.json(leaveRequests));

app.post('/.netlify/functions/api/submit', (req, res) => {
    const newReq = { id: Date.now(), ...req.body, status: "Pending" };
    leaveRequests.push(newReq);
    res.send(`
        <div style="text-align:center; padding:50px; font-family:sans-serif;">
            <h2 style="color:#2563eb;">Submission Successful!</h2>
            <a href="/">Back to Home</a>
        </div>
    `);
});

app.post('/.netlify/functions/api/update', (req, res) => {
    const { id, status } = req.body;
    let record = leaveRequests.find(r => r.id == id);
    if (record) record.status = status;
    res.redirect('/admin-panel');
});

module.exports.handler = serverless(app);
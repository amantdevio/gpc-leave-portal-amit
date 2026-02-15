const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Note: In-memory storage resets when the function goes "cold"
let leaveRequests = [];

// API Routes (Prefixed via the router)
router.get('/get-requests', (req, res) => {
    res.json(leaveRequests);
});

router.post('/submit', (req, res) => {
    const newReq = { id: Date.now(), ...req.body, status: "Pending" };
    leaveRequests.push(newReq);
    res.send(`
        <div style="text-align:center; padding:50px; font-family:sans-serif;">
            <h2 style="color:#2563eb;">Submission Successful!</h2>
            <p>Your application has been received.</p>
            <a href="/" style="color:#2563eb; font-weight:bold; text-decoration:none;">Back to Form</a>
            <br><br>
            <a href="/admin" style="color:#2563eb; font-weight:bold; text-decoration:none;">Sign-in as Admin</a>
        </div>
    `);
});

router.post('/update', (req, res) => {
    const { id, status } = req.body;
    let record = leaveRequests.find(r => r.id == id);
    if (record) record.status = status;
    // On Netlify, we redirect to the absolute root
    res.redirect('/admin-panel');
});

// Connect router to the path Netlify expects
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
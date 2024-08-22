const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sharathnvmca@gmail.com',
        pass: 'pgkz nhat tswr gwnp'
    }
});

let resignationRequests = {}; // Use a database in a real application

// Route to send interview emails
app.post('/send-email', async (req, res) => {
    const { to, subject, applicant, date, time, link } = req.body;

    const mailContent = `
Dear ${applicant},

Your interview is scheduled for ${date} at ${time}.

Please join the meeting using the following link: ${link}

About Sylicon Software Pvt Ltd:
Sylicon Software Pvt Ltd is a leading provider of cutting-edge technology solutions that empower businesses to reach their full potential. We are committed to innovation, quality, and customer satisfaction.

Thank you, and we look forward to your interview.

Best regards,
HR, Sylicon Software Pvt Ltd
BTM Layout, Kuvepu Nagara,
Prabhavathi Bhaiva
    `;

    const mailOptions = {
        from: 'sharathnvmca@gmail.com',
        to: to,
        subject: subject,
        text: mailContent
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});

// Route to handle resignation
app.post('/send-resignation', async (req, res) => {
    const { name, id, domain, reason, managerEmail } = req.body;

    const approvalToken = crypto.randomBytes(16).toString('hex');
    resignationRequests[approvalToken] = { name, id, domain, reason, status: 'pending', token: approvalToken };

    const mailOptions = {
        from: 'sharathnvmca@gmail.com',
        to: managerEmail,
        subject: 'Resignation Submission',
        html: `
      <p>Employee ${name}</p>
      <p>(ID: ${id})</p>
      <p>Reason: ${reason}</p>
      <p>has submitted their resignation.</p>
      <p>
        <a href="http://localhost:5000/approve-resignation?token=${approvalToken}" style="color:green; font-size:20px;">✔ Approve</a>
        <a href="http://localhost:5000/cancel-resignation?token=${approvalToken}" style="color:red; font-size:20px; margin-left: 30%;">✘ Cancel</a>
      </p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email.');
    }
});

// Route to handle discussion notifications
app.post('/send-discussion-notification', async (req, res) => {
    const { name, id, managerEmail } = req.body;

    const mailOptions = {
        from: 'sharathnvmca@gmail.com',
        to: managerEmail,
        subject: 'Discussion Notification',
        html: `
      <p>Employee ${name}</p>
      <p>(ID: ${id})</p>
      <p>has requested to discuss their resignation.</p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Notification sent successfully.');
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send('Failed to send notification.');
    }
});

// Route to check resignation status
app.get('/check-status', (req, res) => {
    const { id } = req.query;
    const status = Object.values(resignationRequests).find(req => req.id === id)?.status || 'pending';
    res.json({ status });
});

// Route to approve resignation
app.get('/approve-resignation', (req, res) => {
    const { token } = req.query;
    if (resignationRequests[token]) {
        resignationRequests[token].status = 'resignation_approved';
        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resignation Approved</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .message { font-size: 20px; color: green; }
        </style>
      </head>
      <body>
        <p class="message">Resignation Approved Successfully!</p>
      </body>
      </html>
    `);
    } else {
        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .message { font-size: 20px; color: red; }
        </style>
      </head>
      <body>
        <p class="message">Error: Invalid or Expired Token.</p>
      </body>
      </html>
    `);
    }
});

// Route to cancel resignation
app.get('/cancel-resignation', (req, res) => {
    const { token } = req.query;
    if (resignationRequests[token]) {
        resignationRequests[token].status = 'cancelled';
        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resignation Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .message { font-size: 20px; color: red; }
        </style>
      </head>
      <body>
        <p class="message">Resignation Cancelled Successfully!</p>
      </body>
      </html>
    `);
    } else {
        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .message { font-size: 20px; color: red; }
        </style>
      </head>
      <body>
        <p class="message">Error: Invalid or Expired Token.</p>
      </body>
      </html>
    `);
    }
});

// Route to send multiple emails
app.post('/send-bulk-emails', async (req, res) => {
    const { recipients, subject, body } = req.body;

    const mailOptions = {
        from: 'sharathnvmca@gmail.com',
        to: recipients.join(','),
        subject: subject,
        html: body,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ error: 'Failed to send emails' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

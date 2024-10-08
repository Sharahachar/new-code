const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sharathnvmca@gmail.com',
    pass: 'pgkz nhat tswr gwnp' // Replace with your email password or app-specific password
  }
});

// Resignation management
let resignationRequests = {}; // Use a database in a real application

app.post('/send-resignation', (req, res) => {
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Failed to send email.');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully.');
    }
  });
});

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

app.post('/send-discussion-notification', (req, res) => {
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending notification:', error);
      res.status(500).send('Failed to send notification.');
    } else {
      console.log('Notification sent:', info.response);
      res.status(200).send('Notification sent successfully.');
    }
  });
});

app.get('/check-status', (req, res) => {
  const { id } = req.query;
  const status = Object.values(resignationRequests).find(req => req.id === id)?.status || 'pending';
  res.json({ status });
});

// General email sending
app.post('/send-email', (req, res) => {
  const { recipients, subject, body } = req.body;

  const mailOptions = {
    from: 'sharathnvmca@gmail.com',
    to: recipients,
    subject: subject,
    html: body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

// Interview notification
app.post('/send-interview-notification', (req, res) => {
  const { to, subject, applicant, date, time, link } = req.body;

  const mailContent = `
    Dear ${applicant},

    Your interview is scheduled for ${date} at ${time}.

    Please join the meeting using the following link: ${link}

    About Syliqon Software Pvt Ltd:
    Sylicon Software Pvt Ltd is a leading provider of cutting-edge technology solutions that empower businesses to reach their full potential. We are committed to innovation, quality, and customer satisfaction.

    Thank you, and we look forward to your interview.

    Best regards,
    HR, Syliqon Software Pvt Ltd
    BTM Layout, Kuvepu Nagara,
    Prabhavathi Bhaiva
  `;

  const mailOptions = {
    from: 'sharathnvmca@gmail.com',
    to: to,
    subject: subject,
    text: mailContent
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to send email');
    }
    res.status(200).send('Email sent successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

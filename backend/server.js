const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    service: String,
    message: String,
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

app.get("/", (req, res) => {
  res.send("Portfolio backend is running");
});

app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact - ${contact.name}`,
      replyTo: contact.email,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone}</p>
        <p><strong>Service:</strong> ${contact.service}</p>
        <p><strong>Message:</strong> ${contact.message}</p>
      `,
    });

    console.log("Saved:", contact);
    console.log("Email sent:", info.messageId);

    res.json({
      success: true,
      message: "Message saved successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      success: false,
      message: "Database or email error",
    });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contacts",
    });
  }
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
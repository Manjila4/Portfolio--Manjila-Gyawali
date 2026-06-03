const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Email Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact Schema
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

// Home Route
app.get("/", (req, res) => {
  res.send("Portfolio backend is running");
});

// Contact Form Route
app.post("/api/contact", async (req, res) => {
  try {
    // Save to MongoDB first
    const contact = new Contact(req.body);
    await contact.save();

    console.log("Saved:", contact);

    // Send response immediately
    res.json({
      success: true,
      message: "Message submitted successfully",
    });

    // Send email in background
    transporter
      .sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact - ${contact.name}`,
        replyTo: contact.email,
        html: `
          <h2>New Contact Message</h2>

          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone}</p>
          <p><strong>Service:</strong> ${contact.service}</p>
          <p><strong>Message:</strong></p>
          <p>${contact.message}</p>

          <hr>

          <p>
            Submitted at:
            ${new Date().toLocaleString()}
          </p>
        `,
      })
      .then((info) => {
        console.log("Email sent:", info.messageId);
      })
      .catch((emailError) => {
        console.log("Email Error:", emailError);
      });
  } catch (error) {
    console.log("Error:", error);

    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

// Admin Route
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.json(contacts);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch contacts",
    });
  }
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import nodemailer from "nodemailer";

const clean = (value) => String(value || "").trim();
const cleanAppPassword = (value) => clean(value).replace(/\s+/g, "");

const buildTransport = () => {
  const smtpHost = clean(process.env.SMTP_HOST);
  const smtpUser = clean(process.env.SMTP_USER);
  const smtpPass = clean(process.env.SMTP_PASS);
  const mailUser = clean(process.env.MAIL_USER);
  const mailPass = cleanAppPassword(process.env.MAIL_PASS);

  if (smtpHost) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined
    });
  }

  if (mailUser && mailPass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailUser,
        pass: mailPass
      }
    });
  }

  return null;
};

export const submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Name, email, phone, and message are required" });
    }

    const transporter = buildTransport();
    if (!transporter) {
      return res.status(500).json({
        message: "Mail service is not configured. Add SMTP_* or MAIL_USER/MAIL_PASS in server .env"
      });
    }

    const recipient = clean(process.env.CONTACT_RECEIVER) || clean(process.env.MOBEEN_AGENT_EMAIL);
    if (!recipient) {
      return res.status(500).json({ message: "Contact receiver email is missing in server .env" });
    }

    const sender = clean(process.env.MAIL_FROM) || clean(process.env.SMTP_USER) || clean(process.env.MAIL_USER) || recipient;

    await transporter.sendMail({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: `New Website Inquiry from ${name}`,
      text: [
        "New contact form submission",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        "Message:",
        message
      ].join("\n"),
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br/>")}</p>
      `
    });

    res.status(201).json({ message: "Inquiry sent successfully" });
  } catch (error) {
    next(error);
  }
};

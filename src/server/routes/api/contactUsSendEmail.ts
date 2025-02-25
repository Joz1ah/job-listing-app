import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const contactUsSendEmail = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, emailAddress, userType, message, subject } = req.body;
  const text = message;
  const _userType =
    userType === "Job Hunter" ? "Job Hunter" : userType === "Employer" ? "Employer" : "Prefer not to say";
  const html = `<div>Role : ${_userType}</div><div>Message : ${message}</div><div>Email : <u>${emailAddress}</u></div>`;

  const missingFields = [];
  if (!firstName) missingFields.push("firstName");
  if (!lastName) missingFields.push("lastName");
  if (!emailAddress) missingFields.push("emailAddress");
  if (!userType) missingFields.push("userType");
  if (!message) missingFields.push("message");
  if (!subject) missingFields.push("subject");

  if (missingFields.length > 0) {
    res.status(400).json({
      error: "Missing required fields",
      missingFields,
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NOREPLY_EMAIL_USERNAME,
        pass: process.env.NOREPLY_EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${emailAddress}>`,
      to: process.env.INTERCOM_SUPPORT_EMAIL,
      subject,
      text,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
    res.status(200).json({
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error(`Error sending email: ${error.message}`);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
};
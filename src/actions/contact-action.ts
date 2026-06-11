"use server";
import transporter from "@/config/email";
import { emailBodyToOwner, emailBodyTouser, securityCodeEmailTemplate } from "@/templates/email-template";


export async function sendMessageAction(data: FormData) {
  if (!data) {
    return { success: false, message: "Invalid form data" };
  }
  const fullName = data.get("fullName") as string;
  const email = data.get("email") as string;
  const subject = data.get("subject") as string;
  const message = data.get("message") as string;

  if (!fullName || !email || !subject || !message) {
    return { success: false, message: "Invalid form data" };
  }

  try {
    //to owner
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Sending to the owner's email
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: emailBodyToOwner(subject, fullName, email, message),
    });
    //to user
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `Portfolio Contact: ${subject}`,
      text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: emailBodyTouser(fullName, "http://localhost:3000"),
    });

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}

export async function sendAuthCode(code: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Auth Code",
      text: `Auth Code: ${code}`,
      html: securityCodeEmailTemplate(code),
    });
    return { success: true, message: "Auth Code sent successfully!" };
  } catch (error) {
    console.error("Error sending auth code:", error);
    return { success: false, message: "Failed to send auth code. Please try again later." };
  }

}

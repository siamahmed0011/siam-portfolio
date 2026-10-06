"use server";

import prisma from "@/lib/prisma";

export interface ContactActionResult {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
}

export async function submitContactAction(
  prevState: ContactActionResult | null,
  formData: FormData
): Promise<ContactActionResult> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim();

  const errors: ContactActionResult["errors"] = {};

  if (!name) {
    errors.name = "Name is required";
  } else if (name.length > 255) {
    errors.name = "Name cannot exceed 255 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Please enter a valid email address";
  } else if (email.length > 255) {
    errors.email = "Email cannot exceed 255 characters";
  }

  if (subject && subject.length > 255) {
    errors.subject = "Subject cannot exceed 255 characters";
  }

  if (!message) {
    errors.message = "Message content is required";
  } else if (message.length < 5) {
    errors.message = "Message must be at least 5 characters long";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted errors.",
      errors,
    };
  }

  try {
    await prisma.message.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return {
      success: true,
      message: "Your message has been sent successfully! Thank you for reaching out.",
    };
  } catch (err: unknown) {
    console.error("Error saving contact message:", err);
    return {
      success: false,
      message: "An unexpected error occurred while sending your message. Please try again later.",
    };
  }
}

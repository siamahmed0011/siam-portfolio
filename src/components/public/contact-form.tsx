"use client";

import { useActionState } from "react";
import { submitContactAction, type ContactActionResult } from "@/actions/contact-action";

const initialState: ContactActionResult = {
  success: false,
  message: "",
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactAction,
    initialState
  );

  return (
    <div className="contact-card" style={{ margin: 0 }}>
      <h2 className="section-title contact-title">Send a Message</h2>

      {state.message && (
        <div className={`alert ${state.success ? "alert-success" : "alert-danger"}`}>
          {state.message}
        </div>
      )}

      <form action={formAction}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-control"
            placeholder="Your Name"
            required
            disabled={isPending}
          />
          {state.errors?.name && (
            <span className="error-text">{state.errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            placeholder="your.email@example.com"
            required
            disabled={isPending}
          />
          {state.errors?.email && (
            <span className="error-text">{state.errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            name="subject"
            id="subject"
            className="form-control"
            placeholder="Message Subject"
            disabled={isPending}
          />
          {state.errors?.subject && (
            <span className="error-text">{state.errors.subject}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            className="form-control"
            rows={5}
            placeholder="How can I help you?"
            required
            disabled={isPending}
          />
          {state.errors?.message && (
            <span className="error-text">{state.errors.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary"
          style={{ marginTop: "0.5rem", width: "100%" }}
        >
          {isPending ? "Sending Message..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { submitContactInquiry } from "../services/contactService";

const WHATSAPP_NUMBER = "923295399439";

const buildWhatsAppUrl = ({ name, email, phone, message }) => {
  const text = [
    "New inquiry from website",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    "",
    "Message:",
    message
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      await submitContactInquiry(form);

      const whatsappUrl = buildWhatsAppUrl(form);
      const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      if (!whatsappWindow) {
        alert("Inquiry sent by email. Please allow popups to also open WhatsApp.");
      } else {
        alert("Inquiry sent by email and WhatsApp message opened.");
      }

      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to send inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-luxe">
      <h1 className="text-4xl">Contact Agent</h1>
      <p className="mt-2 text-slate">
        Buy/Sell Residential Plots, Houses, Apartments and Shops. Send your inquiry and get a quick response.
      </p>

      <div className="mt-4 rounded-2xl bg-sand p-4 text-sm text-slate">
        <p className="font-semibold text-ink">Phone: 0329-5399439 | 0345-9394111</p>
        <p className="mt-1">Location: Peshawar, Pakistan</p>
        <a
          href="https://www.facebook.com/p/Mobeen-Real-Estate-Consultant-100064058564598/"
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block font-semibold text-ink hover:text-accent"
        >
          Facebook: Mobeen Real Estate Consultant
        </a>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          placeholder="Your Name"
          value={form.name}
          onChange={(event) => setForm((p) => ({ ...p, name: event.target.value }))}
          className="w-full rounded-xl border border-mist px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((p) => ({ ...p, email: event.target.value }))}
          className="w-full rounded-xl border border-mist px-3 py-2"
        />
        <input
          placeholder="Contact Number"
          value={form.phone}
          onChange={(event) => setForm((p) => ({ ...p, phone: event.target.value }))}
          className="w-full rounded-xl border border-mist px-3 py-2"
        />
        <textarea
          placeholder="Tell us what kind of property you need"
          value={form.message}
          onChange={(event) => setForm((p) => ({ ...p, message: event.target.value }))}
          rows={5}
          className="w-full rounded-xl border border-mist px-3 py-2"
        />
        <button disabled={submitting} className="rounded-full bg-ink px-6 py-3 font-semibold text-white disabled:opacity-60">
          {submitting ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </section>
  );
}

export default Contact;

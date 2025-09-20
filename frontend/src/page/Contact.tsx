import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSuccess("Your message has been sent!"); // demo success

    // TODO: send form data to backend API
    // await fetch("/api/contact", { method: "POST", body: JSON.stringify(form) });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-lg bg-white shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Name"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          placeholder="Your Email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        {/* Replace Input with textarea for message */}
        <div className="flex flex-col">
          <label htmlFor="message" className="mb-1 font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Your message..."
            value={form.message}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <Button type="submit" variant="primary">
          Send Message
        </Button>
      </form>
    </div>
  );
}

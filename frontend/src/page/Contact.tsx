import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Contact us</h1>
      <form className="flex flex-col gap-4">
        <Input label="Name" placeholder="Your Name" />
        <Input label="Email" placeholder="Your Email" type="email" />
        <Input label="message" placeholder="Your message" />
        <Button variant="primary">Send Message</Button>
      </form>
    </div>
  );
}

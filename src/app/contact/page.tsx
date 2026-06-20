import ContactSection from "../../components/ContactSection";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <ContactSection />
      <div className="px-6 md:px-16">
        <Footer />
      </div>
    </div>
  );
}

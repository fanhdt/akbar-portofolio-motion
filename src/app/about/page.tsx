// src/app/contact/page.tsx
import AboutSection from "@/components/AboutMe";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AboutSection />
      <div className="px-6 md:px-16">
        <Footer />
      </div>
    </div>
  );
}

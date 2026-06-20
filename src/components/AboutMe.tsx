// src/components/AboutMe.tsx
import Image from "next/image";

interface AboutMeData {
  name: string;
  role: string;
  year: string;
  paragraphs: string[];
  photoUrl: string;
  photoBgColor?: string;
  clients: string[];
  skills: string[];
  softwares: string[];
  links: { label: string; href: string }[];
}

// Data sementara - nanti bisa dipindah ke Sanity (schema "about" / singleton document)
const aboutData: AboutMeData = {
  name: "Muhammad Akbar Robbani",
  role: "Motion Designer",
  year: "2026",
  paragraphs: [
    "Graphic and Motion designer based in Indonesia.Specializing in motion graphics and visual storytelling using After Effects and Blender.",
    "Focused on creating clean, engaging, and brand-driven motion visuals for digital content, branding, and creative campaigns.",
  ],
  photoUrl: "/images/profile.webp",
  photoBgColor: "bg-orange-500",
  clients: ["Education University of Indonesia", "Kolio Motion", "Aphrodi-Tech"],
  skills: ["Animation", "Motion Design", "Graphic Design", "Illustrations", "Advertising", "Branding", "3D"],
  softwares: ["After Effects", "Blender", "Illustrator", "Figma", "Millanote"],
  links: [
    { label: "DEMO Festival 2025", href: "#" },
    { label: "Adobe Creative Cloud Twitter", href: "#" },
    { label: "Behance Twitter", href: "#" },
    { label: "Behance Instagram", href: "#" },
    { label: "Milano Graphic Festival 2022", href: "#" },
    { label: "Graphic Days Torino 2022", href: "#" },
    { label: "Graphic Days Torino 2021", href: "#" },
  ],
};

export default function AboutMe() {
  const { name, role, year, paragraphs, photoUrl, photoBgColor, clients, skills, softwares } = aboutData;

  return (
    <section className="w-full bg-white text-neutral-900 font-sans px-6 md:px-16 py-10 md:py-16">
      {/* Bagian atas: Foto + Info */}
      <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-10 md:gap-20">
        {/* Foto */}
        <div className={`relative w-full aspect-[4/5] md:aspect-[9/11] overflow-hidden ${photoBgColor ?? "bg-neutral-200"}`}>
          <Image src={photoUrl} alt={name} fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover" priority />
        </div>

        {/* Info: nama, role, tahun, deskripsi */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
            {name}
            <br />
            {role}
          </h1>

          <div className="mt-12 md:mt-20 max-w-2xl space-y-5 text-sm md:text-base leading-relaxed">
            <p className="text-neutral-900">{year}</p>
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-neutral-800">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Garis pembatas */}
      <hr className="border-t border-neutral-900 mt-12 md:mt-16 mb-10 md:mb-12" />

      {/* Bagian bawah: 3 kolom Clients / Skills / Awards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 text-sm md:text-base">
        {/* Clients */}
        <div>
          <p className="font-semibold mb-4">Clients</p>
          <p className="text-neutral-800 leading-relaxed">{clients.join(", ")}</p>
        </div>

        {/* Skills */}
        <div>
          <p className="font-semibold mb-4">Skills</p>
          <p className="text-neutral-800 leading-relaxed">{skills.join(", ")}</p>
        </div>

        {/* Awards + Links */}
        <div>
          <p className="font-semibold mb-4">Software</p>
          <div className="text-neutral-800 leading-relaxed space-y-0.5 mb-6">
            {softwares.map((software) => (
              <p key={software}>{software}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

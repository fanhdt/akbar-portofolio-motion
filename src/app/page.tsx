// src/app/page.tsx
import { client } from "../sanity/lib/client";
import Hero from "@/components/Hero";
import ProjectGallery from "@/components/ProjectGallery";
import Footer from "@/components/Footer";

async function getAllProjects() {
  const query = `*[_type == "project"] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    category,
    videoUrl
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function HomePage() {
  const projects = await getAllProjects();

  return (
    <div className="min-h-screen bg-white text-black px-8 md:px-16 pt-20 flex flex-col justify-between">
      <div>
        <Hero />

        {/* Section 2: Gallery & Kategori Filter */}
        <ProjectGallery initialProjects={projects} />
      </div>

      {/* Section 3: Footer */}
      <Footer />
    </div>
  );
}

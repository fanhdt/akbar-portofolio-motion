
import { client } from "@/sanity/lib/client";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectVideoSection from "@/components/ProjectVideoSection";
import StyleframesSection from "@/components/StyleframeSection";
import Footer from "@/components/Footer";

interface ProjectProps {
  params: Promise<{ slug: string }>;
}

async function getProjectDetail(slug: string) {
  const query = `*[_type == "project" && slug.current == $slug][0] {
    title,
    clientName,
    director,
    motionDesign,
    videoUrl,
    description,
    category,
    "slug": slug.current,
    "styleframes": styleframes[] {
      "url": asset->url,
      caption
    },
    "highlightClips": highlightClips[] {
      "url": asset->url,
      caption
    }
  }`;
  return await client.fetch(query, { slug });
}

export default async function ProjectDetailPage({ params }: ProjectProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const project = await getProjectDetail(slug);

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-neutral-900 font-sans">Project tidak ditemukan atau belum di-publish.</div>;
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <main className="px-6 md:px-16 pt-8 md:pt-12">
        {/* Section 1: Info (Judul, Meta Tim, Deskripsi) */}
        <ProjectHeader project={project} />
      </main>

      {/* Section 2: Pemutar Video Utama */}
      <ProjectVideoSection videoUrl={project.videoUrl} />

      <main className="px-6 md:px-16">
        {/* Section 3: Styleframes - video clip manual / gambar manual / auto-loop YouTube */}
        <StyleframesSection styleframes={project.styleframes} highlightClips={project.highlightClips} videoUrl={project.videoUrl} />

        <Footer />
      </main>
    </div>
  );
}

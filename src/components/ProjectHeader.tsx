interface ProjectHeaderProps {
  project: {
    title?: string;
    clientName?: string;
    director?: string;
    motionDesign?: string;
    description?: string;
  };
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const { title, clientName, director, motionDesign, description } = project;

  return (
    <section className="grid grid-cols-1 md:grid-cols-[auto_auto_1fr] gap-x-6 md:gap-x-8 gap-y-6 mb-10 items-start font-sans bg-white">
      {/* Kolom 1: Judul Utama */}
      <div>
        <h1 className="text-3xl md:text-6xl font-bold tracking-tight text-neutral-900">{title}</h1>
      </div>

      {/* Kolom 2: Metadata Klien & Tim - dipaksa 1 baris pakai whitespace-nowrap */}
      <div className="md:ml-8 space-y-3 text-sm md:text-base overflow-x-auto">
        {clientName && (
          <p className="whitespace-nowrap">
            <span className="font-semibold text-neutral-900">Client : </span> <br />
            <span className="text-neutral-900">{clientName}</span>
          </p>
        )}
        {director && (
          <p className="whitespace-nowrap">
            <span className="font-semibold text-neutral-900">Director : </span> <br />
            <span className="text-neutral-900">{director}</span>
          </p>
        )}
        {motionDesign && (
          <p className="whitespace-nowrap">
            <span className="font-semibold text-neutral-900">Motion Design : </span>
            <span className="text-neutral-900">
              <br />
              {motionDesign}
            </span>
          </p>
        )}
      </div>

      {/* Kolom 3: Teks Deskripsi - lebih lebar dan agak ke kiri (dekat kolom metadata) */}
      <div className="text-sm md:text-base text-neutral-900 leading-relaxed max-w-3xl whitespace-pre-line md:ml-4 lg:ml-8">{description || "No description available for this project."}</div>
    </section>
  );
}

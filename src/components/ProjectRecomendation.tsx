/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectRecommendations({ projects }: { projects: any[] }) {
  return (
    <section className="mb-16">
      <h2 className="text-lg font-semibold text-white mb-6">Other Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((item: any) => (
          <Link key={item.slug} href={`/project/${item.slug}`} className="group block">
            <div className="aspect-[4/3] w-full bg-neutral-900 rounded-md overflow-hidden mb-3 border border-neutral-900 group-hover:border-neutral-800 transition-all flex items-center justify-center text-neutral-700">
              <span className="text-xs">View ⚡</span>
            </div>
            <h3 className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{item.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

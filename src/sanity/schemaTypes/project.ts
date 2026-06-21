/* eslint-disable @typescript-eslint/no-explicit-any */
export default {
  name: "project",
  title: "Project Motion",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Judul Project",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug (URL Unik)",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "clientName",
      title: "Nama Client / Universitas",
      type: "string",
    },
    {
      name: "director",
      title: "Director",
      type: "string",
    },
    {
      name: "motionDesign",
      title: "Motion Design By",
      type: "string",
    },
    {
      name: "videoUrl",
      title: "Link Video (YouTube/Vimeo)",
      type: "url",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Deskripsi Project",
      type: "text",
    },
    {
      name: "category",
      title: "Kategori Project",
      type: "string",
      options: {
        list: [
          { title: "Client Project", value: "clients" },
          { title: "Personal Project", value: "personal" },
        ],
        layout: "radio",
      },
      validation: (Rule: any) => Rule.required(),
    },
    // ➕ TAMBAHAN: Styleframes (gambar still-frame, fallback ke video di bawah)
    {
      name: "styleframes",
      title: "Styleframes (gambar)",
      description: "Upload beberapa gambar still-frame. Kosongkan kalau mau pakai video loop otomatis/manual di bawah.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "caption", title: "Caption (opsional)", type: "string" }],
        },
      ],
    },
    // ➕ TAMBAHAN: Highlight video loop pendek (override manual untuk auto-loop dari YouTube)
    {
      name: "highlightClips",
      title: "Highlight Clips (video loop pendek)",
      description: "Upload beberapa video pendek (mp4, idealnya 2-5 detik, tanpa suara) untuk ditampilkan sebagai highlight loop. Kalau dikosongkan, sistem otomatis bikin loop dari video utama (YouTube) di beberapa timestamp.",
      type: "array",
      of: [
        {
          type: "file",
          options: { accept: "video/*" },
          fields: [{ name: "caption", title: "Caption (opsional)", type: "string" }],
        },
      ],
    },
  ],
};

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
    // ➕ TAMBAHAN BARU SESUAI GAMBAR MOCKUP
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
    // ------------------------------------
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
  ],
};

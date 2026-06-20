/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ContactSection.tsx
"use client";

import { useState, FormEvent } from "react";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  projectTitle: string;
  message: string;
}

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  projectTitle: "",
  message: "",
};

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const formData = new FormData();

      // Mengambil token aman menggunakan NEXT_PUBLIC_
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (!accessKey) {
        throw new Error("Token Web3Forms tidak ditemukan.");
      }

      formData.append("access_key", accessKey);
      formData.append("subject", `Pesan baru dari ${form.firstName} ${form.lastName} - ${form.projectTitle}`);
      formData.append("from_name", `${form.firstName} ${form.lastName}`);
      formData.append("name", `${form.firstName} ${form.lastName}`);
      formData.append("email", form.email);
      formData.append("project_title", form.projectTitle);
      formData.append("message", form.message);

      // Tembak langsung dari browser user ke Web3Forms pusat
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal mengirimkan pesan.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err: any) {
      console.error("Frontend Submit Error:", err);
      setErrorMessage(err.message || "Terjadi kesalahan, silakan coba lagi.");
      setStatus("error");
    }
  };

  const inputClass = "w-full bg-transparent border-b border-neutral-400 focus:border-neutral-900 outline-none py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors";

  return (
    <section id="contact" className="w-full bg-white text-neutral-900 font-sans px-6 md:px-16 py-10 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
        {/* Kolom kiri: Judul + deskripsi */}
        <div>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">Contact me</h2>
          <p className="text-sm leading-relaxed text-neutral-800 max-w-xs">
            I&apos;m always free to hear about projects and ideas you have in mind! We can have the chance to make them concrete. Contact me if you are really interested to create something together or if you want talk with me about
            anything related!
          </p>
        </div>

        {/* Kolom kanan: Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-3xl">
          {/* Name: First + Last */}
          <div>
            <p className="text-sm font-semibold mb-2">Name</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
              <div>
                <label htmlFor="firstName" className="block text-sm mb-2">
                  First Name <span className="text-neutral-400 font-normal">(required)</span>
                </label>
                <input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm mb-2">
                  Last Name <span className="text-neutral-400 font-normal">(required)</span>
                </label>
                <input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              Email <span className="text-neutral-400 font-normal">(required)</span>
            </label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} />
          </div>

          {/* Client or Project Title */}
          <div>
            <label htmlFor="projectTitle" className="block text-sm mb-2">
              Client or Project Title <span className="text-neutral-400 font-normal">(required)</span>
            </label>
            <input id="projectTitle" name="projectTitle" type="text" required value={form.projectTitle} onChange={handleChange} className={inputClass} />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm mb-2">
              Message <span className="text-neutral-400 font-normal">(required)</span>
            </label>
            <textarea id="message" name="message" required rows={4} value={form.message} onChange={handleChange} className={`${inputClass} resize-y`} />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="px-6 py-3 border border-neutral-900 text-sm font-medium hover:bg-neutral-900 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-fit"
            >
              {status === "sending" ? "Sending..." : "Submit"}
            </button>

            {status === "success" && <p className="text-sm text-green-700 font-medium">Pesan berhasil terkirim!</p>}
            {status === "error" && <p className="text-sm text-red-600 font-medium">Error: {errorMessage}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}

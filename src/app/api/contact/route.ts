/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const TARGET_HOST = "api.web3forms";
const SUBMIT_ENDPOINT = `https://${TARGET_HOST}.com/submit`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, projectTitle, message } = body;

    // 1. Validasi input dasar
    if (!firstName || !lastName || !email || !projectTitle || !message) {
      return NextResponse.json({ success: false, error: "Semua field wajib diisi." }, { status: 400 });
    }

    // 2. Ambil token dari environment variable
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error("Error: Variabel WEB3FORMS_ACCESS_KEY tidak ditemukan di .env.local");
      return NextResponse.json({ success: false, error: "Token akses server belum dikonfigurasi." }, { status: 500 });
    }

    // 3. Gunakan URLSearchParams
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append("access_key", accessKey);
    urlEncodedData.append("subject", `Pesan baru dari ${firstName} ${lastName} - ${projectTitle}`);
    urlEncodedData.append("from_name", `${firstName} ${lastName}`);
    urlEncodedData.append("name", `${firstName} ${lastName}`);
    urlEncodedData.append("email", email);
    urlEncodedData.append("project_title", projectTitle);
    urlEncodedData.append("message", message);

    // 4. Kirim data dengan MENYATAKAN CONTENT-TYPE SECARA TEGAS
    const response = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // WAJIB di sisi server Node.js
        Accept: "application/json",
      },
      body: urlEncodedData.toString(), // Diubah menjadi string murni url-encoded
    });

    // 5. Amankan pembacaan response
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const rawText = await response.text();
      console.error("Web3Forms menolak permintaan dan mengembalikan HTML. Isinya:", rawText);
      return NextResponse.json(
        {
          success: false,
          error: "Token Web3Forms tidak cocok atau ditolak oleh server pusat. Pastikan isi .env.local sudah benar.",
        },
        { status: 502 },
      );
    }

    const data = await response.json();

    if (!data.success) {
      console.error("Web3Forms mengembalikan status gagal:", data);
      return NextResponse.json({ success: false, error: data.message || "Pesan ditolak oleh sistem Web3Forms." }, { status: 502 });
    }

    // Sukses total!
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Fatal Error pada Proxy API Kontak:", err);
    return NextResponse.json({ success: false, error: "Gagal menghubungkan ke server pengirim pesan." }, { status: 500 });
  }
}

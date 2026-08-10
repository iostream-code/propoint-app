"use server";

import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function addGuest(formData: FormData) {
  const namaPic = formData.get("namaPic") as string;
  const namaTravel = formData.get("namaTravel") as string;
  const noHp = formData.get("noHp") as string;
  const kota = formData.get("kota") as string;
  const alamat = formData.get("alamat") as string;
  const status = formData.get("status") as string;

  try {
    await prisma.guest.create({
      data: {
        namaPic,
        namaTravel,
        noHp,
        kota,
        alamat,
        status,
      },
    });

    // Refresh halaman utama dan halaman pengunjung
    revalidatePath("/");
    revalidatePath("/pengunjung");

    return { success: true };
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    return { success: false, error: "Gagal menyimpan data tamu." };
  }
}

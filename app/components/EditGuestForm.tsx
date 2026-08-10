'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateGuest } from '../actions'

type GuestData = {
    id: number
    namaPic: string
    namaTravel: string
    noHp: string
    kota: string
    alamat: string | null
    status: string
}

export default function EditGuestForm({ guest }: { guest: GuestData }) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsSaving(true)
        setError(null)

        const result = await updateGuest(guest.id, formData)

        if (result.success) {
            router.push(`/pengunjung/${guest.id}`)
            router.refresh()
        } else {
            setIsSaving(false)
            setError(result.error ?? 'Gagal menyimpan perubahan.')
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md border border-gray-100">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Edit Data Pengunjung</h2>
                <p className="text-gray-500 text-sm mt-1">Perbarui data yang perlu diubah.</p>
            </div>

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama PIC *</label>
                    <input
                        type="text"
                        name="namaPic"
                        required
                        defaultValue={guest.namaPic}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Travel *</label>
                    <input
                        type="text"
                        name="namaTravel"
                        required
                        defaultValue={guest.namaTravel}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp *</label>
                    <input
                        type="tel"
                        name="noHp"
                        required
                        defaultValue={guest.noHp}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten Asal *</label>
                    <input
                        type="text"
                        name="kota"
                        required
                        defaultValue={guest.kota}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                    <textarea
                        name="alamat"
                        rows={2}
                        defaultValue={guest.alamat ?? ''}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900"
                        placeholder="Opsional"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Tingkat Ketertarikan *</label>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border cursor-pointer hover:bg-gray-100">
                            <input
                                type="radio"
                                name="status"
                                value="Leads"
                                required
                                defaultChecked={guest.status === 'Leads'}
                                className="w-5 h-5 text-orange-600"
                            />
                            <span className="text-gray-700 font-medium">Leads (Baru Cari Info)</span>
                        </label>
                        <label className="flex items-center space-x-3 bg-orange-50 p-3 rounded-lg border border-orange-100 cursor-pointer hover:bg-orange-100">
                            <input
                                type="radio"
                                name="status"
                                value="Prospek"
                                required
                                defaultChecked={guest.status === 'Prospek'}
                                className="w-5 h-5 text-orange-600"
                            />
                            <span className="text-orange-800 font-medium">Prospek (Tertarik)</span>
                        </label>
                        <label className="flex items-center space-x-3 bg-green-50 p-3 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100">
                            <input
                                type="radio"
                                name="status"
                                value="Hot Prospek"
                                required
                                defaultChecked={guest.status === 'Hot Prospek'}
                                className="w-5 h-5 text-green-600"
                            />
                            <span className="text-green-800 font-bold">Hot Prospek (Potensi SPK 🔥)</span>
                        </label>
                    </div>
                </div>

                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 font-bold py-3.5 rounded-xl transition bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 font-bold py-3.5 rounded-xl transition shadow-md active:scale-95 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-60"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    )
}

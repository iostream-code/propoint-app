'use client'

import { useEffect, useMemo, useState } from 'react'
import { addGuest } from '../actions'

// Sumber data wilayah Indonesia (provinsi & kabupaten/kota), data resmi Kemendagri
// https://github.com/emsifa/api-wilayah-indonesia
const WILAYAH_API_BASE = 'https://www.emsifa.com/api-wilayah-indonesia/api'

type Wilayah = {
    id: string
    name: string
}

// Merapikan "KOTA SURABAYA" -> "Kota Surabaya" agar enak dibaca
function toTitleCase(text: string) {
    return text
        .toLowerCase()
        .replace(/(^|\s)\S/g, (char) => char.toUpperCase())
}

export default function GuestForm() {
    const [namaPic, setNamaPic] = useState('')
    const [namaTravel, setNamaTravel] = useState('')
    const [noHp, setNoHp] = useState('')

    const [provinces, setProvinces] = useState<Wilayah[]>([])
    const [regencies, setRegencies] = useState<Wilayah[]>([])
    const [provinceId, setProvinceId] = useState('')
    const [kota, setKota] = useState('')
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(true)
    const [isLoadingRegencies, setIsLoadingRegencies] = useState(false)

    // Ambil daftar provinsi sekali saat form dimuat
    useEffect(() => {
        let isCancelled = false

        async function loadProvinces() {
            try {
                const res = await fetch(`${WILAYAH_API_BASE}/provinces.json`)
                const data: Wilayah[] = await res.json()
                if (!isCancelled) {
                    setProvinces(data)
                }
            } catch (error) {
                console.error('Gagal memuat daftar provinsi:', error)
            } finally {
                if (!isCancelled) setIsLoadingProvinces(false)
            }
        }

        loadProvinces()
        return () => {
            isCancelled = true
        }
    }, [])

    // Ambil daftar kabupaten/kota setiap kali provinsi berubah
    useEffect(() => {
        if (!provinceId) {
            setRegencies([])
            return
        }

        let isCancelled = false
        setIsLoadingRegencies(true)
        setKota('')

        async function loadRegencies() {
            try {
                const res = await fetch(`${WILAYAH_API_BASE}/regencies/${provinceId}.json`)
                const data: Wilayah[] = await res.json()
                if (!isCancelled) {
                    setRegencies(data)
                }
            } catch (error) {
                console.error('Gagal memuat daftar kabupaten/kota:', error)
            } finally {
                if (!isCancelled) setIsLoadingRegencies(false)
            }
        }

        loadRegencies()
        return () => {
            isCancelled = true
        }
    }, [provinceId])

    // Pilihan Leads / Prospek / Hot Prospek baru muncul setelah data inti terisi
    const isBaseDataComplete = useMemo(
        () =>
            namaPic.trim() !== '' &&
            namaTravel.trim() !== '' &&
            noHp.trim() !== '' &&
            kota.trim() !== '',
        [namaPic, namaTravel, noHp, kota],
    )

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md border border-gray-100">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Form Pengunjung Booth</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Lengkapi data di bawah untuk mencatat kunjungan.
                </p>
            </div>

            <form action={addGuest} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama PIC *</label>
                    <input
                        type="text"
                        name="namaPic"
                        required
                        value={namaPic}
                        onChange={(e) => setNamaPic(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900"
                        placeholder="Cth: Budi Santoso"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Travel *</label>
                    <input
                        type="text"
                        name="namaTravel"
                        required
                        value={namaTravel}
                        onChange={(e) => setNamaTravel(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900"
                        placeholder="Cth: PT Wisata Bahagia"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp *</label>
                    <input
                        type="tel"
                        name="noHp"
                        required
                        value={noHp}
                        onChange={(e) => setNoHp(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900"
                        placeholder="Cth: 08123456789"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi Asal *</label>
                    <select
                        required
                        value={provinceId}
                        onChange={(e) => setProvinceId(e.target.value)}
                        disabled={isLoadingProvinces}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        <option value="">
                            {isLoadingProvinces ? 'Memuat provinsi...' : 'Pilih Provinsi'}
                        </option>
                        {provinces.map((province) => (
                            <option key={province.id} value={province.id}>
                                {toTitleCase(province.name)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten Asal *</label>
                    <select
                        name="kota"
                        required
                        value={kota}
                        onChange={(e) => setKota(e.target.value)}
                        disabled={!provinceId || isLoadingRegencies}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        <option value="">
                            {!provinceId
                                ? 'Pilih provinsi dahulu'
                                : isLoadingRegencies
                                    ? 'Memuat kota/kabupaten...'
                                    : 'Pilih Kota/Kabupaten'}
                        </option>
                        {regencies.map((regency) => (
                            <option key={regency.id} value={toTitleCase(regency.name)}>
                                {toTitleCase(regency.name)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                    <textarea
                        name="alamat"
                        rows={2}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900"
                        placeholder="Opsional"
                    />
                </div>

                {isBaseDataComplete ? (
                    <div className="pt-2 border-t border-gray-100 mt-4 animate-[fadeIn_0.3s_ease]">
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                            Tingkat Ketertarikan *
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border cursor-pointer hover:bg-gray-100">
                                <input type="radio" name="status" value="Leads" required className="w-5 h-5 text-orange-600" />
                                <span className="text-gray-700 font-medium">Leads (Baru Cari Info)</span>
                            </label>
                            <label className="flex items-center space-x-3 bg-orange-50 p-3 rounded-lg border border-orange-100 cursor-pointer hover:bg-orange-100">
                                <input type="radio" name="status" value="Prospek" required className="w-5 h-5 text-orange-600" />
                                <span className="text-orange-800 font-medium">Prospek (Tertarik)</span>
                            </label>
                            <label className="flex items-center space-x-3 bg-green-50 p-3 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100">
                                <input type="radio" name="status" value="Hot Prospek" required className="w-5 h-5 text-green-600" />
                                <span className="text-green-800 font-bold">Hot Prospek (Potensi SPK 🔥)</span>
                            </label>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100 mt-4">
                        Lengkapi Nama PIC, Nama Travel, No. WhatsApp &amp; Provinsi/Kota Asal dulu untuk memilih tingkat ketertarikan.
                    </p>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={!isBaseDataComplete}
                        className={`w-full font-bold py-3.5 rounded-xl transition shadow-md active:scale-95 ${isBaseDataComplete
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed active:scale-100'
                            }`}
                    >
                        Simpan Data Customer
                    </button>
                </div>
            </form>
        </div>
    )
}
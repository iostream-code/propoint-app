import prisma from '../../lib/prisma'
import TabNav from '../components/TabNav'

// Menonaktifkan caching agar tabel selalu menampilkan data terbaru
export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
    'Hot Prospek': 'bg-green-100 text-green-800',
    Prospek: 'bg-orange-100 text-orange-800',
    Leads: 'bg-gray-100 text-gray-800',
}

export default async function PengunjungPage() {
    // Mengambil semua data dari database, diurutkan dari yang terbaru
    const guests = await prisma.guest.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <main className="min-h-screen bg-gray-50 pb-10">
            <TabNav />

            <div className="max-w-5xl mx-auto px-4 mt-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Daftar Pengunjung Booth</h2>
                        <span className="shrink-0 text-xs sm:text-sm font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                            {guests.length} pengunjung
                        </span>
                    </div>

                    {guests.length === 0 ? (
                        <p className="p-8 text-center text-gray-500 text-sm">Belum ada data pengunjung.</p>
                    ) : (
                        <>
                            {/* Mobile: daftar kartu */}
                            <ul className="space-y-3 md:hidden">
                                {guests.map((guest) => (
                                    <li
                                        key={guest.id}
                                        className="border border-gray-100 rounded-xl p-4 bg-gray-50/60"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-800 truncate">{guest.namaPic}</p>
                                                <p className="text-sm text-gray-600 truncate">{guest.namaTravel}</p>
                                            </div>
                                            <span
                                                className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[guest.status] ?? 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {guest.status}
                                            </span>
                                        </div>

                                        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
                                            <div>
                                                <dt className="text-xs text-gray-400">Kota</dt>
                                                <dd className="text-gray-700">{guest.kota}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs text-gray-400">No HP</dt>
                                                <dd className="text-gray-700">{guest.noHp}</dd>
                                            </div>
                                            <div className="col-span-2">
                                                <dt className="text-xs text-gray-400">Tanggal</dt>
                                                <dd className="text-gray-700">
                                                    {new Date(guest.createdAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </dd>
                                            </div>
                                        </dl>
                                    </li>
                                ))}
                            </ul>

                            {/* Desktop/tablet: tabel */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                                            <th className="p-4 text-sm font-semibold text-gray-600">Tanggal</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Nama PIC</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Travel &amp; Kota</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">No HP</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {guests.map((guest) => (
                                            <tr key={guest.id} className="border-b hover:bg-orange-50/50 transition">
                                                <td className="p-4 text-sm text-gray-600">
                                                    {new Date(guest.createdAt).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="p-4 font-medium text-gray-800">{guest.namaPic}</td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    <span className="font-semibold block">{guest.namaTravel}</span>
                                                    {guest.kota}
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">{guest.noHp}</td>
                                                <td className="p-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[guest.status] ?? 'bg-gray-100 text-gray-800'
                                                            }`}
                                                    >
                                                        {guest.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}
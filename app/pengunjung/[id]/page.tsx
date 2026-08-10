import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '../../../lib/prisma'
import TabNav from '../../components/TabNav'
import DeleteGuestButton from '../../components/DeleteGuestButton'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
    'Hot Prospek': 'bg-green-100 text-green-800',
    Prospek: 'bg-orange-100 text-orange-800',
    Leads: 'bg-gray-100 text-gray-800',
}

export default async function GuestDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const guestId = Number(id)

    if (Number.isNaN(guestId)) notFound()

    const guest = await prisma.guest.findUnique({ where: { id: guestId } })

    if (!guest) notFound()

    return (
        <main className="min-h-screen bg-gray-50 pb-10">
            <TabNav />

            <div className="max-w-md mx-auto px-4 mt-4">
                <Link
                    href="/pengunjung"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-3"
                >
                    &larr; Kembali ke daftar
                </Link>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-gray-800 truncate">{guest.namaTravel}</h2>
                            <p className="text-sm text-gray-500 truncate">{guest.namaPic}</p>
                        </div>
                        <span
                            className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[guest.status] ?? 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            {guest.status}
                        </span>
                    </div>

                    <dl className="space-y-3 text-sm">
                        <div>
                            <dt className="text-xs text-gray-400">Nomor WhatsApp</dt>
                            <dd className="text-gray-800">{guest.noHp}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-400">Kota/Kabupaten Asal</dt>
                            <dd className="text-gray-800">{guest.kota}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-400">Alamat Lengkap</dt>
                            <dd className="text-gray-800">{guest.alamat || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-400">Tanggal Kunjungan</dt>
                            <dd className="text-gray-800">
                                {new Date(guest.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </dd>
                        </div>
                    </dl>

                    <div className="flex gap-3 pt-5 mt-5 border-t border-gray-100">
                        <Link
                            href={`/pengunjung/${guest.id}/edit`}
                            className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition"
                        >
                            Edit
                        </Link>
                        <DeleteGuestButton id={guest.id} namaTravel={guest.namaTravel} redirectTo="/pengunjung" />
                    </div>
                </div>
            </div>
        </main>
    )
}

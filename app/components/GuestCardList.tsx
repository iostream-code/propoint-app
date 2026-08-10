'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteGuest } from '../actions'

type GuestSummary = {
    id: number
    namaPic: string
    namaTravel: string
    status: string
}

const STATUS_STYLES: Record<string, string> = {
    'Hot Prospek': 'bg-green-100 text-green-800',
    Prospek: 'bg-orange-100 text-orange-800',
    Leads: 'bg-gray-100 text-gray-800',
}

// Lebar panel aksi (Edit + Hapus) yang muncul saat card digeser ke kiri
const ACTIONS_WIDTH = 160
const SWIPE_THRESHOLD = 60

export default function GuestCardList({ guests }: { guests: GuestSummary[] }) {
    const router = useRouter()
    const [openId, setOpenId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const dragStartX = useRef(0)
    const dragDeltaX = useRef(0)
    const draggingId = useRef<number | null>(null)

    function handleTouchStart(id: number, e: React.TouchEvent) {
        draggingId.current = id
        dragStartX.current = e.touches[0].clientX
        dragDeltaX.current = 0
    }

    function handleTouchMove(id: number, e: React.TouchEvent) {
        if (draggingId.current !== id) return
        dragDeltaX.current = e.touches[0].clientX - dragStartX.current
    }

    function handleTouchEnd(id: number) {
        if (draggingId.current !== id) return
        if (dragDeltaX.current < -SWIPE_THRESHOLD) {
            setOpenId(id)
        } else if (dragDeltaX.current > SWIPE_THRESHOLD) {
            setOpenId((current) => (current === id ? null : current))
        }
        draggingId.current = null
        dragDeltaX.current = 0
    }

    function openDetail(id: number) {
        // Klik dua kali pada card yang sedang digeser terbuka hanya menutupnya
        if (openId === id) {
            setOpenId(null)
            return
        }
        router.push(`/pengunjung/${id}`)
    }

    async function handleDelete(id: number, namaTravel: string) {
        const confirmed = window.confirm(`Hapus data "${namaTravel}"? Tindakan ini tidak bisa dibatalkan.`)
        if (!confirmed) return

        setDeletingId(id)
        const result = await deleteGuest(id)
        setDeletingId(null)

        if (!result.success) {
            window.alert(result.error ?? 'Gagal menghapus data.')
            return
        }

        setOpenId(null)
        router.refresh()
    }

    if (guests.length === 0) {
        return <p className="p-8 text-center text-gray-500 text-sm">Belum ada data pengunjung.</p>
    }

    return (
        <ul className="space-y-3 md:hidden">
            {guests.map((guest) => {
                const isOpen = openId === guest.id
                const isDeleting = deletingId === guest.id

                return (
                    <li key={guest.id} className="relative overflow-hidden rounded-xl border border-gray-100">
                        {/* Panel aksi di belakang, terungkap saat card digeser ke kiri */}
                        <div className="absolute inset-y-0 right-0 flex" style={{ width: ACTIONS_WIDTH }}>
                            <button
                                type="button"
                                onClick={() => router.push(`/pengunjung/${guest.id}/edit`)}
                                className="flex-1 bg-blue-500 active:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(guest.id, guest.namaTravel)}
                                disabled={isDeleting}
                                className="flex-1 bg-red-500 active:bg-red-600 text-white text-xs font-semibold flex items-center justify-center disabled:opacity-60"
                            >
                                {isDeleting ? '...' : 'Hapus'}
                            </button>
                        </div>

                        {/* Konten card: bisa digeser (mobile) & diklik dua kali untuk lihat detail */}
                        <div
                            onTouchStart={(e) => handleTouchStart(guest.id, e)}
                            onTouchMove={(e) => handleTouchMove(guest.id, e)}
                            onTouchEnd={() => handleTouchEnd(guest.id)}
                            onDoubleClick={() => openDetail(guest.id)}
                            className="relative bg-gray-50/60 p-4 transition-transform duration-200 ease-out select-none cursor-pointer"
                            style={{ transform: `translateX(${isOpen ? -ACTIONS_WIDTH : 0}px)` }}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-800 truncate">{guest.namaTravel}</p>
                                    <p className="text-sm text-gray-600 truncate">{guest.namaPic}</p>
                                </div>
                                <span
                                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[guest.status] ?? 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {guest.status}
                                </span>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

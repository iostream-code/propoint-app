'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteGuest } from '../actions'

export default function DeleteGuestButton({
    id,
    namaTravel,
    redirectTo,
}: {
    id: number
    namaTravel: string
    redirectTo: string
}) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        const confirmed = window.confirm(`Hapus data "${namaTravel}"? Tindakan ini tidak bisa dibatalkan.`)
        if (!confirmed) return

        setIsDeleting(true)
        const result = await deleteGuest(id)

        if (!result.success) {
            setIsDeleting(false)
            window.alert(result.error ?? 'Gagal menghapus data.')
            return
        }

        router.push(redirectTo)
        router.refresh()
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 text-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
        >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
        </button>
    )
}

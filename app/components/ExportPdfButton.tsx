'use client'

import { useState } from 'react'

type GuestExport = {
    namaPic: string
    namaTravel: string
    noHp: string
    kota: string
    status: string
    createdAt: Date | string
}

export default function ExportPdfButton({ guests }: { guests: GuestExport[] }) {
    const [isExporting, setIsExporting] = useState(false)

    async function handleExport() {
        setIsExporting(true)
        try {
            const { default: jsPDF } = await import('jspdf')
            const { default: autoTable } = await import('jspdf-autotable')

            const doc = new jsPDF()
            const exportedAt = new Date()

            doc.setFontSize(14)
            doc.setTextColor(234, 88, 12) // orange-600
            doc.text('Koper Indonesia', 14, 16)

            doc.setFontSize(11)
            doc.setTextColor(55, 65, 81) // gray-700
            doc.text('Daftar Pengunjung Booth', 14, 23)

            doc.setFontSize(9)
            doc.setTextColor(107, 114, 128) // gray-500
            doc.text(
                `Diekspor pada ${exportedAt.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })} • Total ${guests.length} pengunjung`,
                14,
                29,
            )

            autoTable(doc, {
                startY: 34,
                head: [['Tanggal', 'Nama PIC', 'Nama Travel', 'Kota/Kabupaten', 'No HP', 'Status']],
                body: guests.map((guest) => [
                    new Date(guest.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    }),
                    guest.namaPic,
                    guest.namaTravel,
                    guest.kota,
                    guest.noHp,
                    guest.status,
                ]),
                styles: { fontSize: 9, cellPadding: 3 },
                headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [249, 250, 251] },
            })

            const fileDate = exportedAt.toISOString().slice(0, 10)
            doc.save(`daftar-pengunjung-koper-indonesia-${fileDate}.pdf`)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || guests.length === 0}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 px-3 py-1.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
            >
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
            </svg>
            {isExporting ? 'Membuat PDF...' : 'Export PDF'}
        </button>
    )
}

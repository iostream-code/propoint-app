'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
    { href: '/pengunjung', label: 'Pengunjung' },
    { href: '/', label: 'Point' },
]

export default function TabNav() {
    const pathname = usePathname()

    function isActive(href: string) {
        if (href === '/') return pathname === '/'
        return pathname === href || pathname.startsWith(`${href}/`)
    }

    return (
        <header className="w-full bg-gradient-to-b from-orange-50 to-transparent">
            <div className="max-w-4xl mx-auto flex flex-col items-center pt-8 pb-5 px-4">
                <Image
                    src="/logo.png"
                    alt="Koper Indonesia"
                    width={72}
                    height={72}
                    priority
                    className="rounded-full shadow-md ring-4 ring-white"
                />
                <h1 className="mt-3 text-xl font-extrabold tracking-tight text-gray-900">
                    KOPER <span className="text-orange-600">INDONESIA</span>
                </h1>
                <p className="text-xs text-gray-500 -mt-0.5">Booth Digital Guest Book</p>
            </div>

            <nav className="max-w-md mx-auto px-4 pb-2">
                <div className="flex bg-white/70 backdrop-blur rounded-xl p-1 gap-1 shadow-sm border border-orange-100">
                    {TABS.map((tab) => {
                        const active = isActive(tab.href)
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex-1 text-center text-sm font-semibold py-2.5 rounded-lg transition ${active
                                    ? 'bg-orange-600 text-white shadow'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </header>
    )
}
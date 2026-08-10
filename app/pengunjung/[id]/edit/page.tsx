import { notFound } from 'next/navigation'
import prisma from '../../../../lib/prisma'
import TabNav from '../../../components/TabNav'
import EditGuestForm from '../../../components/EditGuestForm'

export const dynamic = 'force-dynamic'

export default async function EditGuestPage({
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
        <main className="min-h-screen bg-gray-50 flex flex-col items-center pb-10">
            <TabNav />

            <div className="w-full flex justify-center px-4 mt-4">
                <EditGuestForm guest={guest} />
            </div>
        </main>
    )
}

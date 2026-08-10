import TabNav from './components/TabNav'
import GuestForm from './components/GuestForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center pb-10">
      <TabNav />

      <div className="w-full flex justify-center px-4 mt-4">
        <GuestForm />
      </div>
    </main>
  )
}
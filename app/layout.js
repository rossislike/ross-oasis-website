import { Suspense } from "react"
import Logo from "@/app/_components/Logo"
import Navigation from "@/app/_components/Navigation"
import Loading from "@/app/loading"
import "@/app/_styles/globals.css"
import { Josefin_Sans } from "next/font/google"
import Header from "./_components/Header"

const josefinSans = Josefin_Sans({ subsets: ["latin"], display: "swap" })
export const metadata = {
  title: {
    template: "%s / Ross Oasis",
    default: "Welcome / Ross Oasis",
  },
  description:
    "Luxurious cabin hotel, located in the heart of the Itallian Dolomites, surronded by beautiful mountains and dark forests",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefinSans.className} bg-primary-950 text-primary-100 min-h-screen flex flex-col antialiased`}
      >
        <Header />
        <div className="flex-1 px-8 py-12">
          <main className="max-w-7xl mx-auto">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
        </div>
      </body>
    </html>
  )
}

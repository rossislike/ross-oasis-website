import { Suspense } from "react"
import Logo from "@/app/_components/Logo"
import Navigation from "@/app/_components/Navigation"
import Loading from "@/app/loading"
import "@/app/_styles/globals.css"
import { Josefin_Sans } from "next/font/google"

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
        className={`${josefinSans.className} bg-primary-950 text-primary-100 min-h-screen`}
      >
        <header>
          <Logo />
        </header>
        <Navigation />

        <main>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
        <footer>Copyright by Ross Oasis </footer>
      </body>
    </html>
  )
}

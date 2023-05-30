import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"

const Sidebar = ({ children }) => {
    //routing de next
    const router = useRouter()

    return (
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <>
                <p className="text-2xl font-black">Votaciones</p>
            </>
            <nav className="mt-5 list-none">
                <li className={router.pathname === "/home" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/home" className="text-white block">
                        Inicio
                    </Link>
                </li>
                <li className={router.pathname === "/1" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/" className="text-white block">
                        Verificar votante
                    </Link>
                </li>
                <li className={router.pathname === "/2" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/" className="text-white block">
                        Verificar votante
                    </Link>
                </li>
            </nav>
        </aside>
    )
}

export default Sidebar
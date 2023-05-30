import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"

const Sidebar = ({ children }) => {
    //routing de next
    const router = useRouter()

    return (
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/6 sm:min-h-screen p-5">
            <>
                <p className="text-2xl font-black text-white">Votaciones</p>
            </>
            <nav className="mt-5 list-none">
                <li className={router.pathname === "/home" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/home" className="text-white block mx-5">
                        Inicio
                    </Link>
                </li>
                <li className={router.pathname === "/1" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/" className="text-white block mx-5">
                        Verificar votante
                    </Link>
                </li>
                <li className={router.pathname === "/2" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/" className="text-white block mx-5">
                        Verificar votante
                    </Link>
                </li>
            </nav>
        </aside>
    )
}

export default Sidebar
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
                <li className={router.pathname === "/verificarvotante" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/verificarvotante" className="text-white block mx-5">
                        Verificar votante
                    </Link>
                </li>
                <li className={router.pathname === "/mesasvotacion" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/mesasvotacion" className="text-white block mx-5">
                        Ver mesas de votación
                    </Link>
                </li>
                <li className={router.pathname === "/ciudadanos" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/ciudadanos" className="text-white block mx-5">
                        Ver ciudadanos
                    </Link>
                </li>
                <li className={router.pathname === "/autoridadmesa" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/autoridadmesa" className="text-white block mx-5">
                        Ver autoridades de mesas
                    </Link>
                </li>
                <li className={router.pathname === "/candidatos" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/candidatos" className="text-white block mx-5">
                        Ver candidatos
                    </Link>
                </li>
                <li className={router.pathname === "/actasmesas" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/actasmesas" className="text-white block mx-5">
                        Ver actas de mesas
                    </Link>
                </li>
                <li className={router.pathname === "/iniciareleccion" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/iniciareleccion" className="text-white block mx-5">
                        Iniciar elección
                    </Link>
                </li>
                <li className={router.pathname === "/nuevocandidato" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/nuevocandidato" className="text-white block mx-5">
                        Ingresar candidato
                    </Link>
                </li>
                <li className={router.pathname === "/nuevaautoridad" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/nuevaautoridad" className="text-white block mx-5">
                        Ingresar autoridad de mesa
                    </Link>
                </li>
                <li className={router.pathname === "/nuevociudadano" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/nuevociudadano" className="text-white block mx-5">
                        Registrar ciudadano
                    </Link>
                </li>
                <li className={router.pathname === "/nuevamesavotacion" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/nuevamesavotacion" className="text-white block mx-5">
                        Nueva mesa de votacion
                    </Link>
                </li>
                <li className={router.pathname === "/generaractamesa" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/generaractamesa" className="text-white block mx-5">
                        Generar acta de mesa
                    </Link>
                </li>
                <li className={router.pathname === "/votar" ? "bg-blue-800 p-2 rounded-full" : "p-2"}>
                    <Link href="/votar" className="text-white block mx-5">
                        Votar
                    </Link>
                </li>
            </nav>
        </aside>
    )
}

export default Sidebar
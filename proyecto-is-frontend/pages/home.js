import React, { useEffect } from "react"
import Layout from "@/components/Layout"
import { useRouter } from "next/router"

const Home = () => {

    //Routing
    const router = useRouter()

    return (
        <>
            <Layout>
                <h1 className="text-3xl font-bold text-blue-900 mx-20 my-5">¡Bienvenido!</h1>

                {/* Progreso */}
                <div className="flex justify-center mx-40 bg-gray-800 overflow-hidden rounded-lg border border-gray-100">
                    <a
                        
                        className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 flex-grow"
                    >
                        <span
                            className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"
                        ></span>

                        <div className="flex justify-between gap-4 w-full">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 sm:text-xl text-white">
                                    Progreso de Votaciones
                                </h3>

                                <p className="mt-1 text-xs font-medium text-gray-200">2023</p>

                                {/* Barra */}
                                <div>
                                    <span id="ProgressLabel" className="sr-only">Loading</span>

                                    <span
                                        role="progressbar"
                                        aria-labelledby="ProgressLabel"
                                        aria-valuenow="50"
                                        className="block rounded-full bg-gray-200"
                                    >
                                        <span
                                            className="block h-4 rounded-full bg-indigo-600 text-center text-[10px]/4"
                                            style={{width: '80%'}}
                                        >
                                            <span class="font-bold text-white"> 80% </span>
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div className="hidden sm:block sm:shrink-0">
                                <img
                                    alt="votaciones"
                                    src="https://conecta.tec.mx/sites/default/files/styles/header_full/public/2021-06/expertos-del-tec-campus-cuernavaca-te-dicen-que-debes-saber-antes-de-las-votaciones1.jpg?itok=Afb1HAUk"
                                    className="h-32 w-32 rounded-lg object-cover shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-4 w-full ">
                            <p className="text-sm text-gray-300">
                                Progreso apróximado de votos esperados dentro de esta elección
                            </p>
                        </div>

                        <dl className="mt-6 flex gap-4 sm:gap-6">
                            <div class="flex flex-col-reverse">
                                <dt className="text-sm font-medium text-gray-300">Actualidad</dt>
                                <dd className="text-xs text-gray-200">2 de Junio, 2023</dd>
                            </div>

                            <div className="flex flex-col-reverse">
                                <dt className="text-sm font-medium text-gray-300">País</dt>
                                <dd className="text-xs text-gray-200">Guatemala</dd>
                            </div>
                        </dl>
                    </a>
                </div>
            </Layout>
        </>
    )
}

export default Home
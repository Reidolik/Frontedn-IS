import React from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const OBTENER_AUTORIDADES_MESAS = gql`
    query obtenerAutoridades {
        obtenerAutoridadesMesas {
            id
            nombre
            apellido
            dpi
            puesto
        }
    }
`

const AutoridadMesa = () => {
    //Query mesas
    const { data, loading, error } = useQuery(OBTENER_AUTORIDADES_MESAS)

    if (loading) {
        return null
    }

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl font-light">Autoridades de mesas</h1>
                <div className="mx-auto max-w-4xl mt-10">
                    <table className="table-auto shadow-md mt-10 w-full">
                        <thead className="bg-gray-800">
                            <tr className="text-white">
                                <th className="w-1/5 py-2 rounded-t-lg">Nombre</th>
                                <th className="w-1/5 py-2 rounded-t-lg">DPI</th>
                                <th className="w-1/5 py-2 rounded-t-lg">Puesto</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {data.obtenerAutoridadesMesas.map(autoridad => (
                                <tr key={autoridad.id}>
                                    <td className="border px-4 py-2 rounded">{autoridad.nombre} {autoridad.apellido}</td>
                                    <td className="border px-4 py-2 rounded">{autoridad.dpi}</td>
                                    <td className="border px-4 py-2 rounded">{autoridad.puesto}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 
                </div>
            </Layout >
        </>
    )
}

export default AutoridadMesa
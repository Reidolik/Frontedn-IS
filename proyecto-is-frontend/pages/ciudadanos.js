import React from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const OBTENER_CIUDADANOS = gql`
    query obtenerCiudadanos {
        obtenerCiudadanos {
            id
            nombre
            apellido
            edad
            dpi
        }
    }
`

const Ciudadanos = () => {
    //Query mesas
    const { data, loading, error } = useQuery(OBTENER_CIUDADANOS)

    if (loading) {
        return null
    }

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl font-light">Ciudadanos</h1>
                <div className="mx-auto max-w-4xl mt-10">
                    <table className="table-auto shadow-md mt-10 w-full">
                        <thead className="bg-gray-800">
                            <tr className="text-white">
                                <th className="w-1/5 py-2">Nombre</th>
                                <th className="w-1/5 py-2">Edad</th>
                                <th className="w-1/5 py-2">DPI</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {data.obtenerCiudadanos.map(ciudadano => (
                                <tr key={ciudadano.id}>
                                    <td className="border px-4 py-2">{ciudadano.nombre} {ciudadano.apellido}</td>
                                    <td className="border px-4 py-2">{ciudadano.edad}</td>
                                    <td className="border px-4 py-2">{ciudadano.dpi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout >
        </>
    )
}

export default Ciudadanos
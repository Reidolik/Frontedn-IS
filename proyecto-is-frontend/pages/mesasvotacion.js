import React from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const OBTENER_MESAS_VOTACION = gql`
    query obtenerMesasDeVotaciones {
        obtenerMesasVotacion {
            id
            ciudadano_voluntario_id
            departamento
            municipio
            ubicacion
            numero_mesa
        }
    }
`

const MesasVotacion = () => {
    //Query mesas
    const { data, loading, error } = useQuery(OBTENER_MESAS_VOTACION)

    if (loading) {
        return null
    }

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl font-light">Mesas de votación</h1>
                <div className="mx-auto max-w-4xl mt-10">
                    <table className="table-auto shadow-md mt-10 w-full">
                        <thead className="bg-gray-800">
                            <tr className="text-white">
                                <th className="w-1/5 py-2">Numero de mesa</th>
                                <th className="w-1/5 py-2">Departamento</th>
                                <th className="w-1/5 py-2">Municipio</th>
                                <th className="w-1/5 py-2">Ubicación</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {data.obtenerMesasVotacion.map(mesa => (
                                <tr key={mesa.id}>
                                    <td className="border px-4 py-2">{mesa.numero_mesa}</td>
                                    <td className="border px-4 py-2">{mesa.departamento}</td>
                                    <td className="border px-4 py-2">{mesa.municipio}</td>
                                    <td className="border px-4 py-2">{mesa.ubicacion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout >
        </>
    )
}

export default MesasVotacion
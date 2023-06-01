import React from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const OBTENER_CANDIDATOS = gql`
    query obtenerCandidatos{
        obtenerCandidatos {
            nombre
            apellido
            planilla
            puesto
        }
    }
`

const Candidatos = () => {
    //Query mesas
    const { data, loading, error } = useQuery(OBTENER_CANDIDATOS)

    if (loading) {
        return null
    }

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl font-light">Candidatos</h1>
                <div className="mx-auto max-w-4xl mt-10">
                    <table className="table-auto shadow-md mt-10 w-full">
                        <thead className="bg-gray-800">
                            <tr className="text-white">
                                <th className="w-1/5 py-2 rounded-t-lg">Nombre</th>
                                <th className="w-1/5 py-2 rounded-t-lg">Puesto</th>
                                <th className="w-1/5 py-2 rounded-t-lg">Planilla</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {data.obtenerCandidatos.map(candidato => (
                                <tr key={candidato.id}>
                                    <td className="border px-4 py-2 rounded">{candidato.nombre} {candidato.apellido}</td>
                                    <td className="border px-4 py-2 rounded">{candidato.puesto}</td>
                                    <td className="border px-4 py-2 rounded">{candidato.planilla}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 
                </div>
            </Layout >
        </>
    )
}

export default Candidatos
import React from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const OBTENER_DATOS = gql`
    query obtenerDatos{
        obtenerActasMesas {
            id
            eleccion_id
            mesa_votacion_id
            firma_presidente_mesa
            firma_vicepresidente_mesa
            fecha_acta
        }
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

const ActasMesas = () => {
    //Query actas
    const { data, loading, error } = useQuery(OBTENER_DATOS)

    if (loading) {
        return null
    }

    console.log(data)

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl font-light">Actas de mesas</h1>
                <div className="mx-auto max-w-4xl mt-10">
                    <table className="table-auto shadow-md mt-10 w-full">
                        <thead className="bg-gray-800">
                            <tr className="text-white">
                                <th className="w-1/5 py-2">Numero de mesa</th>
                                <th className="w-1/5 py-2">Ubicación</th>
                                <th className="w-1/5 py-2">Firma de presindente de mesa</th>
                                <th className="w-1/5 py-2">Firma de vicepresidente de mesa</th>
                                <th className="w-1/5 py-2">Fecha de acta</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {data.obtenerActasMesas.map(acta => (
                                <tr key={acta.id}>
                                    <td className="border px-4 py-2">{(data.obtenerMesasVotacion.find(mesa => mesa.id === acta.mesa_votacion_id)).numero_mesa}</td>
                                    <td className="border px-4 py-2">{(data.obtenerMesasVotacion.find(mesa => mesa.id === acta.mesa_votacion_id)).ubicacion}</td>
                                    <td className="border px-4 py-2">{acta.firma_presidente_mesa ? 'Firmado' : 'No firmado'}</td>
                                    <td className="border px-4 py-2">{acta.firma_vicepresidente_mesa ? 'Firmado' : 'No firmado'}</td>
                                    <td className="border px-4 py-2">{`${new Date(parseInt(acta.fecha_acta)).toLocaleString('en-US')}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout >
        </>
    )
}

export default ActasMesas
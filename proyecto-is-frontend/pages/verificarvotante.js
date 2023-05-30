import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useMutation, gql } from "@apollo/client"


const OBTENER_CIUDADANO = gql`
    mutation verificaCiudadano($dpi: String!){
        autenticarCiudadano(dpi: $dpi) {
            id
            dpi
            nombre
            apellido
        }
    }
`


const VerificarVotante = () => {

    //Routing
    const router = useRouter()

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null)

    //Mutation para ciudadano
    const [autenticarCiudadano] = useMutation(OBTENER_CIUDADANO)

    //validacion del formulario
    const formik = useFormik({
        initialValues: {
            dpi: ''
        },
        validationSchema: Yup.object({
            dpi: Yup.string().min(13,'El DPI debe de ser de almenos 13 carácteres de largo').required('El DPI es obligatorio')
        }),
        onSubmit: async valores => {
            const { dpi } = valores

            try {
                const { data } = await autenticarCiudadano({
                    variables: {
                        dpi: dpi
                    }
                })

                const { nombre, apellido } = data.autenticarCiudadano

                guardarMensaje(`Autenticando...`)
                setTimeout(() => {
                    guardarMensaje(`¡Autenticado con éxito! ${nombre} ${apellido}`)
                    setTimeout(() => {
                        guardarMensaje(null)
                    }, 2000);
                }, 2000);

            } catch (error) {
                guardarMensaje(error.message.replace('ApolloError: ', ''))
                setTimeout(() => {
                    guardarMensaje(null)
                }, 2000);
            }
        }
    })

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto text-green-600 rounded-lg shadow-md outline-hidden">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <>
            <Layout>
                <h1 className="text-3xl font-bold text-blue-900 mx-20 my-5">¡Verifica al votante!</h1>
                {mensaje && mostrarMensaje()}
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded-lg shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dpi">
                                    DPI
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="dpi"
                                    type="text"
                                    placeholder="Ingresa el DPI del votante"
                                    value={formik.values.dpi}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.dpi && formik.errors.dpi ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.dpi}</p>
                                </div>
                            ) : null}

                            <input
                                type="submit"
                                className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Verificar"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )

}

export default VerificarVotante
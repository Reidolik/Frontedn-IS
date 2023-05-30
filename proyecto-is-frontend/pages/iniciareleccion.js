import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useMutation, gql } from "@apollo/client"

const INICIAR_ELECCION = gql`
    mutation crearEleccion($input: EleccionInput!) {
        nuevaEleccion(input: $input) {
            anio_eleccion
            fecha_inicio_eleccion
            fecha_fin_eleccion
            cantidad_partidos_activos
        }
    }
`

const IniciarEleccion = () => {

    //Routing
    const router = useRouter()

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null)

    //Mutation para ciudadano
    const [nuevaEleccion] = useMutation(INICIAR_ELECCION)

    //validacion del formulario
    const formik = useFormik({
        initialValues: {
            anio_eleccion: (new Date(Date.now()).getFullYear()),
            fecha_inicio_eleccion: '',
            fecha_fin_eleccion: '',
            cantidad_partidos_activos: ''
        },
        validationSchema: Yup.object({
            anio_eleccion: Yup.number().min(4, 'El año debe de ser de almenos 4 carácteres de largo').required('El año es obligatorio'),
            fecha_inicio_eleccion: Yup.date().required('La fecha es obligatoria'),
            fecha_fin_eleccion: Yup.date().required('La fecha es obligatoria'),
            cantidad_partidos_activos: Yup.number().required('La cantidad es obligatoria')
        }),
        onSubmit: async valores => {
            const { anio_eleccion, fecha_inicio_eleccion, fecha_fin_eleccion, cantidad_partidos_activos } = valores

            try {
                const { data } = await nuevaEleccion({
                    variables: {
                        input: {
                            anio_eleccion,
                            fecha_inicio_eleccion,
                            fecha_fin_eleccion,
                            cantidad_partidos_activos
                        }
                    }
                })

                guardarMensaje(`Iniciando...`)
                setTimeout(() => {
                    guardarMensaje(`¡Iniciado con éxito!`)
                    setTimeout(() => {
                        guardarMensaje(null)
                        router.push('/home')
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
                <h1 className="text-center text-2xl font-light">Iniciar elección</h1>
                {mensaje && mostrarMensaje()}
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="anio_eleccion">
                                    Año
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="anio_eleccion"
                                    type="number"
                                    placeholder="Ingresa el año de la elección"
                                    value={formik.values.anio_eleccion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.anio_eleccion && formik.errors.anio_eleccion ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.anio_eleccion}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_inicio_eleccion">
                                    Fecha de inicio
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="fecha_inicio_eleccion"
                                    type="date"
                                    placeholder="Ingresa la fecha de inicio"
                                    value={formik.values.fecha_inicio_eleccion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.fecha_inicio_eleccion && formik.errors.fecha_inicio_eleccion ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.fecha_inicio_eleccion}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_fin_eleccion">
                                    Fecha de fin
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="fecha_fin_eleccion"
                                    type="date"
                                    placeholder="Ingresa la fecha de fin"
                                    value={formik.values.fecha_fin_eleccion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.fecha_fin_eleccion && formik.errors.fecha_fin_eleccion ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.fecha_fin_eleccion}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantidad_partidos_activos">
                                    Cantidad de partidos activos
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cantidad_partidos_activos"
                                    type="number"
                                    placeholder="Ingresa la cantidad de partidos activos"
                                    value={formik.values.cantidad_partidos_activos}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.cantidad_partidos_activos && formik.errors.cantidad_partidos_activos ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.cantidad_partidos_activos}</p>
                                </div>
                            ) : null}

                            <input
                                type="submit"
                                className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Iniciar Sesión"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default IniciarEleccion
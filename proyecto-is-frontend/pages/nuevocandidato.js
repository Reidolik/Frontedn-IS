import React, { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const CREAR_CANDIDATO = gql`
    mutation nuevoCandidato($input: CandidatoInput!){
        nuevoCandidato(input: $input) {
            nombre
            apellido
            planilla
            puesto
        }
    }
`

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

const NuevoCandidato = () => {

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null)

    //Mutation para candidato
    const [nuevoCandidato] = useMutation(CREAR_CANDIDATO, {
        update(cache, { data: { nuevoCandidato } }) {
            //Obtener el objeto de cache que deseamos actualizar
            const { obtenerCandidatos } = cache.readQuery({
                query: OBTENER_CANDIDATOS
            })

            //Reescribimos el cache (NUNCA se debe modificar - SI reescribir)
            cache.writeQuery({
                query: OBTENER_CANDIDATOS,
                data: {
                    obtenerCandidatos: [...obtenerCandidatos, nuevoCandidato]
                }
            })
        }
    })

    //Routing
    const router = useRouter()

    //validacion del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            puesto: '',
            planilla: '',
            dpi: '',
            cv: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            puesto: Yup.string().required('El puesto es obligatorio'),
            planilla: Yup.string().required('La planilla es obligatorio'),
            dpi: Yup.string().min(13, 'El DPI debe de ser de almenos 13 carácteres de largo').required('El DPI es obligatorio'),
            cv: Yup.string().required('El cv es obligatorio')
        }),
        onSubmit: async valores => {
            const { nombre, apellido, puesto, planilla, dpi, cv } = valores

            try {
                const { data } = await nuevoCandidato({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            puesto,
                            planilla,
                            dpi,
                            cv
                        }
                    }
                })

                guardarMensaje(`¡Guardado éxitoso!`)
                setTimeout(() => {
                    guardarMensaje(null)
                    //redirigir al usuario
                    router.push('/home')
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
                <h1 className="text-center text-2xl font-light">Nuevo candidato</h1>
                {mensaje && mostrarMensaje()}
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Ingresa el nombre"
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apellido
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type="text"
                                    placeholder="Ingresa el apellido"
                                    value={formik.values.apellido}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.apellido && formik.errors.apellido ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.apellido}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="puesto">
                                    Puesto
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="puesto"
                                    type="text"
                                    placeholder="Ingresa el puesto"
                                    value={formik.values.puesto}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.puesto && formik.errors.puesto ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.puesto}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="planilla">
                                    Planilla
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="planilla"
                                    type="text"
                                    placeholder="Ingresa la planilla"
                                    value={formik.values.planilla}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.planilla && formik.errors.planilla ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.planilla}</p>
                                </div>
                            ) : null}

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

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cv">
                                    CV
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cv"
                                    type="text"
                                    placeholder="Ingresa el cv"
                                    value={formik.values.cv}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.cv && formik.errors.cv ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.cv}</p>
                                </div>
                            ) : null}

                            <input
                                type="submit"
                                className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Registrar candidato"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default NuevoCandidato
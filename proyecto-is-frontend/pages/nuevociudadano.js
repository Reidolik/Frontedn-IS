import React, { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const CREAR_CIUDADANO = gql`
    mutation nuevoCiudadano ($input: CiudadanoInput!) {
        nuevoCiudadano(input: $input) {
            id
            nombre
            apellido
            edad
            dpi
        }
    }
`

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

const NuevoCiudadano = () => {

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null)

    //Mutation para candidato
    const [nuevoCiudadano] = useMutation(CREAR_CIUDADANO, {
        update(cache, { data: { nuevoCiudadano } }) {
            //Obtener el objeto de cache que deseamos actualizar
            const { obtenerCiudadanos } = cache.readQuery({
                query: OBTENER_CIUDADANOS
            })

            //Reescribimos el cache (NUNCA se debe modificar - SI reescribir)
            cache.writeQuery({
                query: OBTENER_CIUDADANOS,
                data: {
                    obtenerCiudadanos: [...obtenerCiudadanos, nuevoCiudadano]
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
            edad: '',
            dpi: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            edad: Yup.number().min(2, 'Debe ser mayor de edad').required('La edad es obligatoria'),
            dpi: Yup.string().min(13, 'El DPI debe de ser de almenos 13 carácteres de largo').required('El DPI es obligatorio')
        }),
        onSubmit: async valores => {
            const { nombre, apellido, edad, dpi } = valores

            try {
                const { data } = await nuevoCiudadano({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            edad,
                            dpi
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
                <h1 className="text-center text-2xl font-light">Nuevo ciudadano</h1>
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edad">
                                    Edad
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="edad"
                                    type="text"
                                    placeholder="Ingresa la edad"
                                    value={formik.values.edad}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.edad && formik.errors.edad ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.edad}</p>
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

                            <input
                                type="submit"
                                className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Registrar ciudadano"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default NuevoCiudadano
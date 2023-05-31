import React, { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const CREAR_MESA_VOTACION = gql`
    mutation crearMesaVotacion($dpi: ID!, $anio: Int!, $input: MesaVotacionInput!) {
        nuevaMesaVotacionVotante(dpi: $dpi, anio: $anio, input: $input) {
            id
            ciudadano_voluntario_id
            eleccion_id
            departamento
            municipio
            fecha_acta
            creado
        }
    }
`

const OBTENER_MESAS_VOTACION = gql`
    query obtenerMesasDeVotaciones {
        obtenerMesasVotacion {
            id
            ciudadano_voluntario_id
            departamento
            municipio
            ubicacion
        }
    }
`

const OBTENER_ELECCION = gql`
    query obtenerDatosEleccionActual($anio: Int!){
        obtenerEleccion(anio: $anio) {
            id
            anio_eleccion
            cantidad_partidos_activos
        }
    }
`

const NuevaMesaVotacion = () => {

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null)

    //Routing
    const router = useRouter()

    //validacion del formulario
    const formik = useFormik({
        initialValues: {
            numero_mesa: 1,
            departamento: '',
            municipio: '',
            ubicacion: '',
            fecha_acta: '',
            dpi: '',
            anio: ''
        },
        validationSchema: Yup.object({
            numero_mesa: Yup.number().min(1, 'Debe ser mayor a 1').required('El numero de mesa es obligatorio'),
            departamento: Yup.string().required('El departamento es obligatorio'),
            municipio: Yup.string().required('El municipio es obligatorio'),
            ubicacion: Yup.string().required('La ubicación es obligatoria'),
            fecha_acta: Yup.date().required('La fecha es obligatoria'),
            dpi: Yup.string().min(13, 'El DPI debe de ser de almenos 13 carácteres de largo').required('El DPI es obligatorio'),
            anio: Yup.number().min(4, 'El año debe de ser de almenos 4 carácteres de largo').required('El año es obligatorio'),
        }),
        onSubmit: async valores => {
            const { dpi, anio, numero_mesa, departamento, municipio, ubicacion, fecha_acta } = valores

            try {
                const { data } = await nuevaMesaVotacionVotante({
                    variables: {
                        dpi,
                        anio,
                        input: {
                            numero_mesa,
                            departamento,
                            municipio,
                            ubicacion,
                            fecha_acta
                        }
                    }
                })

                guardarMensaje(`¡Guardado éxitoso!`)
                setTimeout(() => {
                    guardarMensaje(null)
                    //redirigir al usuario
                    router.push('/mesasvotacion')
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

    //Query usuario
    const eleccionObtenida = useQuery(OBTENER_ELECCION, {
        variables: {
            anio: (new Date(Date.now()).getFullYear())
        }
    })

    //Mutation para candidato
    const [nuevaMesaVotacionVotante] = useMutation(CREAR_MESA_VOTACION, {
        update(cache, { data: { nuevaMesaVotacionVotante } }) {
            //Obtener el objeto de cache que deseamos actualizar
            const { obtenerMesasVotacion } = cache.readQuery({
                query: OBTENER_MESAS_VOTACION
            })

            //Reescribimos el cache (NUNCA se debe modificar - SI reescribir)
            cache.writeQuery({
                query: OBTENER_MESAS_VOTACION,
                data: {
                    obtenerMesasVotacion: [...obtenerMesasVotacion, nuevaMesaVotacionVotante]
                }
            })
        }
    })

    //Proteger que no accedamos a data antes de tener los resultados
    if (eleccionObtenida.loading) {
        return null
    }

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl font-light">Nueva mesa</h1>
                {mensaje && mostrarMensaje()}
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero_mesa">
                                    Numero mesa
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="numero_mesa"
                                    type="text"
                                    placeholder="Ingresa el nombre"
                                    value={formik.values.numero_mesa}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.numero_mesa && formik.errors.numero_mesa ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.numero_mesa}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departamento">
                                    Departamento
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="departamento"
                                    type="text"
                                    placeholder="Ingresa el apellido"
                                    value={formik.values.departamento}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.departamento && formik.errors.departamento ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.departamento}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="municipio">
                                    Municipio
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="municipio"
                                    type="text"
                                    placeholder="Ingresa la edad"
                                    value={formik.values.municipio}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.municipio && formik.errors.municipio ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.municipio}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ubicacion">
                                    Ubicación
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="ubicacion"
                                    type="text"
                                    placeholder="Ingresa el DPI del votante"
                                    value={formik.values.ubicacion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.ubicacion && formik.errors.ubicacion ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.ubicacion}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_acta">
                                    Fecha del acta
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="fecha_acta"
                                    type="date"
                                    placeholder="Ingresa la fecha de inicio"
                                    value={formik.values.fecha_acta}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.fecha_acta && formik.errors.fecha_acta ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.fecha_acta}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dpi">
                                    DPI de voluntario
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="dpi"
                                    type="text"
                                    placeholder="Ingresa el DPI del voluntario"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="anio">
                                    Año
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="anio"
                                    type="number"
                                    placeholder="Ingresa el año de la elección"
                                    value={formik.values.anio}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.anio && formik.errors.anio ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.anio}</p>
                                </div>
                            ) : null}

                            <input
                                type="submit"
                                className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Registrar mesa de votación"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default NuevaMesaVotacion
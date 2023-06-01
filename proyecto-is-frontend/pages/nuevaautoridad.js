import React, { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const CREAR_AUTORIDAD = gql`
    mutation nuevaAutoridad($input: AutoridadMesaInput!) {
        nuevaAutoridadMesa(input: $input) {
            id
            mesa_votacion_id
            nombre
            apellido
            dpi
            creado
        }
    }
`

const OBTENER_AUTORIDADES = gql`
    query obtenerAutoridades {
        obtenerAutoridadesMesas {
            id
            nombre
            apellido
            dpi
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
            numero_mesa
        }
    }
`

const NuevaAutoridad = () => {

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null)

    //Routing
    const router = useRouter()

    //validacion del formulario
    const formik = useFormik({
        initialValues: {
            mesa_votacion_id: '',
            nombre: '',
            apellido: '',
            dpi: '',
            puesto: ''
        },
        validationSchema: Yup.object({
            mesa_votacion_id: Yup.string().required('La mesa es obligatoria'),
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            dpi: Yup.string().min(13, 'El DPI debe de ser de almenos 13 carácteres de largo').required('El DPI es obligatorio'),
            puesto: Yup.string().required('El puesto es obligatorio')
        }),
        onSubmit: async valores => {
            const { mesa_votacion_id, nombre, apellido, dpi, puesto } = valores

            try {
                const { data } = await nuevaAutoridadMesa({
                    variables: {
                        input: {
                            mesa_votacion_id,
                            nombre,
                            apellido,
                            dpi,
                            puesto
                        }
                    }
                })

                guardarMensaje(`¡Guardado éxitoso!`)
                setTimeout(() => {
                    guardarMensaje(null)
                    //redirigir al usuario
                    router.push('/autoridadmesa')
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

    //Query mesas
    const { data, loading, error } = useQuery(OBTENER_MESAS_VOTACION)

    //Mutation para candidato
    const [nuevaAutoridadMesa] = useMutation(CREAR_AUTORIDAD, {
        update(cache, { data: { nuevaAutoridadMesa } }) {
            //Obtener el objeto de cache que deseamos actualizar
            const { obtenerAutoridadesMesas } = cache.readQuery({
                query: OBTENER_AUTORIDADES
            })

            //Reescribimos el cache (NUNCA se debe modificar - SI reescribir)
            cache.writeQuery({
                query: OBTENER_AUTORIDADES,
                data: {
                    obtenerAutoridadesMesas: [...obtenerAutoridadesMesas, nuevaAutoridadMesa]
                }
            })
        }
    })

    //Proteger que no accedamos a data antes de tener los resultados
    if (loading) {
        return null
    }

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl font-light">Nueva autoridad de mesa</h1>
                {mensaje && mostrarMensaje()}
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label id="mesa_votacion_id">Mesa</label>
                                <select
                                    id="mesa_votacion_id"
                                    value={formik.mesa_votacion_id}
                                    label="Voto de presidente"
                                    onChange={formik.handleChange}
                                    className='bg-white rounded-lg shadow-md px-8 pt-6 pb-6 mb-4 border border-black-300 border-solid w-full'
                                >
                                    <option key="10101012" label={``} value={``} />
                                    {data.obtenerMesasVotacion.map((mesa) => (
                                        <option key={mesa.id} label={`${mesa.numero_mesa} - ${mesa.departamento} - ${mesa.municipio} - ${mesa.ubicacion}`} value={mesa.id} />
                                    ))}
                                </select>
                            </div>

                            {formik.touched.presidente_voto && formik.errors.presidente_voto ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.presidente_voto}</p>
                                </div>
                            ) : null}

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

                            <input
                                type="submit"
                                className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Registrar autoridad"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default NuevaAutoridad
import React, { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useQuery, useMutation, gql } from "@apollo/client"
import { useRouter } from "next/router"

const CREAR_ACTA = gql`
    mutation crearActa($anio: Int!, $input: ActasMesaInput!) {
        nuevaActaMesa(anio: $anio, input: $input) {
            id
            eleccion_id
            mesa_votacion_id
            firma_presidente_mesa
            firma_vicepresidente_mesa
            fecha_acta
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

const OBTENER_ACTAS_MESAS = gql`
    query obtenerActas{
        obtenerActasMesas {
            id
            eleccion_id
            mesa_votacion_id
            firma_presidente_mesa
            firma_vicepresidente_mesa
        }
    }
`

const NuevaActaMesa = () => {

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null)

    //Routing
    const router = useRouter()

    //validacion del formulario
    const formik = useFormik({
        initialValues: {
            mesa_votacion_id: '',
            firma_presidente_mesa: false,
            firma_vicepresidente_mesa: false,
            fecha_acta: ''
        },
        validationSchema: Yup.object({
            mesa_votacion_id: Yup.string().required('La mesa es obligatoria'),
            firma_presidente_mesa: Yup.bool().required('La firma de presindente es obligatoria'),
            firma_vicepresidente_mesa: Yup.bool().required('La firma de vicepresindente es obligatoria'),
            fecha_acta: Yup.date().required('La fecha es obligatoria')
        }),
        onSubmit: async valores => {
            const { mesa_votacion_id, firma_presidente_mesa, firma_vicepresidente_mesa, fecha_acta } = valores

            try {
                const { data } = await nuevaActaMesa({
                    variables: {
                        anio: 2023,
                        input: {
                            mesa_votacion_id,
                            firma_presidente_mesa,
                            firma_vicepresidente_mesa,
                            fecha_acta
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
    const [nuevaActaMesa] = useMutation(CREAR_ACTA, {
        update(cache, { data: { nuevaActaMesa } }) {
            //Obtener el objeto de cache que deseamos actualizar
            const { obtenerActasMesas } = cache.readQuery({
                query: OBTENER_ACTAS_MESAS
            })

            //Reescribimos el cache (NUNCA se debe modificar - SI reescribir)
            cache.writeQuery({
                query: OBTENER_ACTAS_MESAS,
                data: {
                    obtenerActasMesas: [...obtenerActasMesas, nuevaActaMesa]
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
                <h1 className="text-center text-2xl font-light">Generar acta de mesa</h1>
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

                            {formik.touched.mesa_votacion_id && formik.errors.mesa_votacion_id ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.mesa_votacion_id}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label id="mesa_votacion_id">Firma del presidente de mesa</label>
                                <select
                                    id="firma_presidente_mesa"
                                    value={formik.firma_presidente_mesa}
                                    label="Firma de presidente de mesa"
                                    onChange={formik.handleChange}
                                    className='bg-white rounded-lg shadow-md px-8 pt-6 pb-6 mb-4 border border-black-300 border-solid w-full'
                                >
                                    <option key="10101011" label={``} value={``} />
                                    <option key="10101012" label={`Ya firmo`} value={true} />
                                    <option key="10101013" label={`No firmo`} value={false} />
                                </select>
                            </div>

                            {formik.touched.firma_presidente_mesa && formik.errors.firma_presidente_mesa ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.firma_presidente_mesa}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label id="mesa_votacion_id">Firma del vicepresidente de mesa</label>
                                <select
                                    id="firma_vicepresidente_mesa"
                                    value={formik.firma_vicepresidente_mesa}
                                    label="Firma de vicepresidente de mesa"
                                    onChange={formik.handleChange}
                                    className='bg-white rounded-lg shadow-md px-8 pt-6 pb-6 mb-4 border border-black-300 border-solid w-full'
                                >
                                    <option key="10101011" label={``} value={``} />
                                    <option key="10101012" label={`Ya firmo`} value={true} />
                                    <option key="10101013" label={`No firmo`} value={false} />
                                </select>
                            </div>

                            {formik.touched.firma_vicepresidente_mesa && formik.errors.firma_vicepresidente_mesa ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.firma_vicepresidente_mesa}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_acta">
                                    Fecha de acta
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="fecha_acta"
                                    type="date"
                                    placeholder="Ingresa la fecha del acta"
                                    value={formik.values.fecha_inicio_eleccion}
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

                            <input
                                type="submit"
                                className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Generar acta"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default NuevaActaMesa
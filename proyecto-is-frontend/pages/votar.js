import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useMutation, useQuery, gql } from "@apollo/client"

const OBTENER_ELECCION = gql`
    query obtenerDatosEleccionActual($anio: Int!){
        obtenerEleccion(anio: $anio) {
            id
            anio_eleccion
            cantidad_partidos_activos
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


const CREAR_VOTO = gql`
    mutation crearVoto($input: VotoInput!) {
        nuevoVoto(input: $input) {
            id
            ciudadano_id
            eleccion_id
            presidente_voto
            alcalde_voto
            fecha_voto
        }
    }
`

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

const VerificarDPI = ({ ciudadanoData, aprobado, actualizarAprobado, actualizarCiudadano, autenticarCiudadano }) => {

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null)

    //validacion del formulario de verificación DPI
    const formik = useFormik({
        initialValues: {
            dpi: ''
        },
        validationSchema: Yup.object({
            dpi: Yup.string().min(13, 'El DPI debe de ser de almenos 13 carácteres de largo').required('El DPI es obligatorio')
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
                actualizarCiudadano(data.autenticarCiudadano)

                guardarMensaje(`Autenticando...`)
                setTimeout(() => {
                    guardarMensaje(`¡Autenticado con éxito! ${nombre} ${apellido}`)
                    setTimeout(() => {
                        actualizarAprobado(true)
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
        <Layout>
            <h1 className="flex justify-center text-3xl text-white font-bold text-blue-900 mx-20 my-5">¡Bienvenido votante!</h1>
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
    )
}

const RealizarVoto = ({ ciudadanoData, eleccionObtenida, candidatosObtenidos, nuevoVoto }) => {

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null)

    //Routing
    const router = useRouter()

    //validacion del formulario de verificación DPI
    const formik2 = useFormik({
        initialValues: {
            presidente_voto: '',
            alcalde_voto: ''
        },
        validationSchema: Yup.object({
            presidente_voto: Yup.string().required('El voto de presidente es obligatorio'),
            alcalde_voto: Yup.string().required('El voto de alcalde es obligatorio')
        }),
        onSubmit: async valores => {
            const { presidente_voto, alcalde_voto } = valores

            try {
                const { data } = await nuevoVoto({
                    variables: {
                        input: {
                            ciudadano_id: ciudadanoData.id,
                            eleccion_id: eleccionObtenida.data.obtenerEleccion.id,
                            presidente_voto: presidente_voto,
                            alcalde_voto: alcalde_voto,
                            fecha_voto: new Date(Date.now())
                        }
                    }
                })

                const { nombre, apellido } = ciudadanoData

                guardarMensaje(`Guardando...`)
                setTimeout(() => {
                    guardarMensaje(`Guardado con éxito! ${nombre} ${apellido}`)
                    setTimeout(() => {
                        guardarMensaje(null)
                        router.push('/')
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
        <Layout>
            <h1 className="flex justify-center text-3xl text-white font-bold text-blue-900 mx-20 my-5">¡Ingresa tus votos!</h1>
            {mensaje && mostrarMensaje()}
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form className="bg-white rounded-lg shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik2.handleSubmit}>
                        <div className="mb-4">
                            <label id="presidente_voto">Voto de presidente</label>
                            <select
                                id="presidente_voto"
                                value={formik2.presidente_voto}
                                label="Voto de presidente"
                                onChange={formik2.handleChange}
                                className='bg-white rounded-lg shadow-md px-8 pt-6 pb-6 mb-4 border border-black-300 border-solid w-full'
                            >
                                <option key="10101012" label={``} value={``} />
                                {candidatosObtenidos.data.obtenerCandidatos.filter(candidato => candidato.puesto === "Presidente").map((candidato) => (
                                    <option key={candidato.id} label={`${candidato.nombre} ${candidato.apellido} - ${candidato.planilla}`} value={candidato.planilla} />
                                ))}
                                <option key="10101011" label={`Voto nulo`} value={`Voto nulo`} />
                            </select>
                        </div>

                        {formik2.touched.presidente_voto && formik2.errors.presidente_voto ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                <p className="font-bold">Error</p>
                                <p>{formik2.errors.presidente_voto}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label id="alcalde_voto">Voto de alcalde</label>
                            <select
                                id="alcalde_voto"
                                value={formik2.alcalde_voto}
                                label="Voto de alcalde"
                                onChange={formik2.handleChange}
                                className='bg-white rounded-lg shadow-md px-8 pt-6 pb-6 mb-4 border border-black-300 border-solid w-full'
                            >
                                <option key="10101012" label={``} value={``} />
                                {candidatosObtenidos.data.obtenerCandidatos.filter(candidato => candidato.puesto === "Alcalde").map((candidato) => (
                                    <option key={candidato.id} label={`${candidato.nombre} ${candidato.apellido} - ${candidato.planilla}`} value={candidato.planilla} />
                                ))}
                                <option key="10101011" label={`Voto nulo`} value={`Voto nulo`} />
                            </select>
                        </div>

                        {formik2.touched.alcalde_voto && formik2.errors.alcalde_voto ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded">
                                <p className="font-bold">Error</p>
                                <p>{formik2.errors.alcalde_voto}</p>
                            </div>
                        ) : null}

                        <input
                            type="submit"
                            className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                            value="¡Votar!"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}


const Votar = () => {

    const [aprobado, setAprobado] = useState(false)
    const [ciudadanoData, setCiudadanoData] = useState({})

    const handleCiudadanoActualizado = (nuevoValor) => {
        setCiudadanoData(nuevoValor);
    };

    const handleAprobadoActualizado = (nuevoValor) => {
        setAprobado(nuevoValor);
    };

    //Query usuario
    const eleccionObtenida = useQuery(OBTENER_ELECCION, {
        variables: {
            anio: (new Date(Date.now()).getFullYear())
        }
    })

    //Query usuario
    const candidatosObtenidos = useQuery(OBTENER_CANDIDATOS)

    //Mutation para ciudadano
    const [autenticarCiudadano] = useMutation(OBTENER_CIUDADANO)

    //Mutation para el voto
    const [nuevoVoto] = useMutation(CREAR_VOTO)

    //Proteger que no accedamos a data antes de tener los resultados
    if (eleccionObtenida.loading && candidatosObtenidos.loading) {
        return null
    }

    return (
        <>
            {!aprobado ?
                <VerificarDPI
                    ciudadanoData={ciudadanoData}
                    aprobado={aprobado}
                    actualizarAprobado={handleAprobadoActualizado}
                    actualizarCiudadano={handleCiudadanoActualizado}
                    autenticarCiudadano={autenticarCiudadano}
                />
                :
                <RealizarVoto
                    ciudadanoData={ciudadanoData}
                    eleccionObtenida={eleccionObtenida}
                    candidatosObtenidos={candidatosObtenidos}
                    nuevoVoto={nuevoVoto}
                />
            }
        </>
    )

}

export default Votar
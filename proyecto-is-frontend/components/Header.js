import Reac from "react"
import { useQuery, gql } from "@apollo/client"
import { useRouter } from "next/router"

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
            email
        }
    }
`

const Header = () => {

    //Query usuario
    const { data, loading, error } = useQuery(OBTENER_USUARIO)

    //Routing
    const router = useRouter()

    //Proteger que no accedamos a data antes de tener los resultados
    if (loading) {
        return null
    }

    const { nombre, apellido } = data.obtenerUsuario

    if (!data) {
        return router.push('/')
    }

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    return (
        <div className="flex justify-between m-5">
            <p className="text-2xl font-bold text-gray-700">{nombre} {apellido}</p>
            <button
                type="button" 
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
                onClick={() => cerrarSesion()}
            >
                Cerrar Sesíon
            </button>
        </div>
    )
}

export default Header
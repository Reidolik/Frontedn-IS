import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'

export default function Home() {

  //Routing
  const router = useRouter()

  const irALogin = () => {
    router.push('/login')
  }
  
  const irAVotar = () => {
    router.push('/votar')
  }
  
  return (
    <>
      <Layout>
        <div className='flex flex-col justify-center items-center p-10'>
          <h1 className='text-white font-bold text-3xl mb-10'>¡Bienvenido a las Votaciones 2023!</h1>

          <div className='h-96 rounded-lg overflow-hidden'>
            <a href="#" class="group relative block bg-black w-full h-full">
              <img
                alt="Guatemala"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Flag_of_Guatemala.svg/1920px-Flag_of_Guatemala.svg.png"
                class="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
              />

              <div class="relative p-4 sm:p-6 lg:p-8">
                <p class="text-sm font-medium uppercase tracking-widest text-pink-500">
                  Guatemala
                </p>

                <p class="text-xl font-bold text-white sm:text-2xl">Votaciones 2023</p>

                <div class="mt-32 sm:mt-48 lg:mt-64">
                  <div
                    class="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <p class="text-sm text-white">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis
                      perferendis hic asperiores quibusdam quidem voluptates doloremque
                      reiciendis nostrum harum. Repudiandae?
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <div className='border rounded-lg overflow-hidden bg-white m-10 p-5'>
            <button className="px-4 py-2 bg-blue-500 text-white rounded mx-5" onClick={() => irALogin()}>Iniciar sesión</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded mx-5" onClick={() => irAVotar()}>Ir a votar</button>
          </div>
        </div>
      </Layout>
    </>
  )
}

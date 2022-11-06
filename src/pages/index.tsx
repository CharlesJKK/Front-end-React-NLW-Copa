import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import avatarImg from "../assets/users-avatar-example.png";
import iconImg from "../assets/icon-check.svg";
import Image from "next/image";
import { api } from "../api/api";
import { FormEvent, useState, useEffect } from "react";


interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
  
}



export default function Home(props: HomeProps) {

  const [poolTittle, setPoolTittle] = useState('')

  async function createPool(event: FormEvent){
    event.preventDefault()

    try{
      const response = await api.post('/pools', {
      tittle: poolTittle,
    });

    const { code } = response.data;

    await navigator.clipboard.writeText(code)

    alert('Bolão criado com sucesso, o código foi copiado para área de transferência!')

    setPoolTittle('')

  } catch(err){
    console.log(err)
    alert('Falha ao criar bolão, tente novamente!')
  }

  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>  
        <Image src={logoImg} alt="Nlw Copa" quality={100}/> 
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={avatarImg} alt="" quality={100}/>
          <strong className="text-gray-100 text-xl"><span className="text-ignite-500">+ {props.usersCount}</span> pessoas já estão usando</strong>
        </div>
        <form className="mt-10 flex gap-2" onSubmit={createPool}>
          <input type="text" required placeholder="Qual nome do seu bolão?" className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100" onChange={event => setPoolTittle(event.target.value)} value={poolTittle}/>
          <button type="submit" className="bg-nlyellow-500 px-6 py-4 text-gray-900 font-bold text-sm uppercase hover:bg-nlyellow-700">Criar meu bolão</button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconImg} alt="" quality={100}/>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"/>

          <div className="flex items-center gap-6">
            <Image src={iconImg} alt="" quality={100}/>
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{props.guessCount}</span>
                <span>Palpites enviados</span>
              </div>
            </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" quality={100}/>
    </div>
  )
}



export const getServerSideProps = async () => {

  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    }
  }

}

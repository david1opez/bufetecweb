"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Images
import image1 from '../assets/1.png';
import image2 from '../assets/2.png';
import image3 from '../assets/3.png';
import image4 from '../assets/4.png';
import image5 from '../assets/5.png';
import image6 from '../assets/6.png';
import image7 from '../assets/7.png';
import image8 from '../assets/8.png';
import image9 from '../assets/9.png';
import image10 from '../assets/10.png';

// Tipos
type News = {
  id: string
  title: string
  description: string
  imageUrl: string
}

type User = {
  username: string
  token: string
}

export default function Home() {
  const [news, setNews] = useState<News[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newNews, setNewNews] = useState<Omit<News, 'id'>>({ title: '', description: '', imageUrl: '' })

  // Efecto para cargar noticias iniciales
  useEffect(() => {
    if (user) {
      fetchNews()
    }
  }, [user])

  // Función para obtener noticias
  const fetchNews = async () => {
    setNews([
      { id: '1', title: 'Noticia 1', description: 'Descripción 1', imageUrl: '' },
      { id: '2', title: 'Noticia 2', description: 'Descripción 2', imageUrl: '' },
    ])
  }

  // Función para iniciar sesión
  const handleLogin = (username: string, password: string) => {
    setIsLoginOpen(false)
    setUser({ username, token: "ksdhgka" })
  }

  // Función para crear una nueva noticia
  const handleCreateNews = async () => {
    const newId = Date.now().toString()

    if(newNews.imageUrl === '') {
      const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10];
      newNews.imageUrl = images[Math.floor(Math.random() * images.length)].src;
    }

    setNews([...news, { ...newNews, id: newId }])
    setIsCreating(false)
    setNewNews({ title: '', description: '', imageUrl: '' })
  }

  // Función para eliminar una noticia
  const handleDeleteNews = async (id: string) => {
    setNews(news.filter(item => item.id !== id))
  }

  if (!user) {
    return (
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Iniciar sesión</DialogTitle>
            <DialogDescription>
              Ingresa tus credenciales para acceder a la aplicación de noticias.
            </DialogDescription>
          </DialogHeader>
          <LoginForm onLogin={handleLogin} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4" style={{color: "#14397F", fontWeight: 700}}>Portal de Noticias</h1>
      <p
        className="text-md mb-4"
        style={{
          color: "#14397F",
          fontSize: 14,
          marginRight: "55vw"
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      </p>
      <Button
        onClick={() => setIsCreating(true)}
        className="mb-4 font-bold"
        style={{backgroundColor: "#14397F", marginBottom: 30}}
      >
        Crear Nueva Noticia
      </Button>
      <NewsList news={news} onDelete={handleDeleteNews} />
      
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Noticia</DialogTitle>
          </DialogHeader>
          <NewsForm news={newNews} setNews={setNewNews} onSubmit={handleCreateNews} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de lista de noticias
function NewsList({ news, onDelete }: { news: News[], onDelete: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {news.map((item) => (
        <Card key={item.id}>
          <CardHeader style={{paddingBottom: 10}}>
            <CardTitle style={{fontSize: 20, color: "#14397F"}}>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <img src={item.imageUrl || image1.src} alt={item.title} className="w-full h-50 object-cover mb-2" />
            <p style={{fontSize: 12, fontWeight: 500}}>{item.description.substring(0,200).substring(0,170)}...</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={() => onDelete(item.id)}
              className='font-bold'
              style={{
                padding: "0 12px",
                paddingRight: 16,
                backgroundColor: "white",
                fontSize: 13,
                border: "2px solid #14397F",
                color: "#14397F",
              }}
            >
            <svg style={{marginRight: 4}} width="16" height="16" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.9995 7L4.99951 7.00001" stroke="#14397F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13 13V21" stroke="#14397F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 13V21" stroke="#14397F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M24.9995 7.00001V26C24.9995 26.2652 24.8942 26.5196 24.7066 26.7071C24.5191 26.8946 24.2647 27 23.9995 27H7.99951C7.7343 27 7.47994 26.8946 7.29241 26.7071C7.10487 26.5196 6.99951 26.2652 6.99951 26V7" stroke="#14397F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 7V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H13C12.4696 3 11.9609 3.21071 11.5858 3.58579C11.2107 3.96086 11 4.46957 11 5V7" stroke="#14397F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Eliminar
          </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// Componente de formulario de noticias
function NewsForm({ news, setNews, onSubmit }: { 
  news: Omit<News, 'id'>, 
  setNews: React.Dispatch<React.SetStateAction<Omit<News, 'id'>>>, 
  onSubmit: () => void 
}) {
  return (
    <div className="space-y-4">
      <Input 
        placeholder="Título" 
        value={news.title} 
        onChange={(e) => setNews({ ...news, title: e.target.value })} 
      />
      <Textarea 
        placeholder="Descripción" 
        value={news.description} 
        onChange={(e) => setNews({ ...news, description: e.target.value })} 
      />
      <Input 
        placeholder="URL de la imagen" 
        value={news.imageUrl}
        onChange={(e) => setNews({ ...news, imageUrl: e.target.value })} 
      />
      <Button
        onClick={onSubmit}
        className="font-bold"
        style={{backgroundColor: "#14397F"}}
      >
        Guardar
      </Button>
    </div>
  )
}

// Componente de formulario de inicio de sesión
function LoginForm({ onLogin }: { onLogin: (username: string, password: string) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Nombre de usuario" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <Input 
        type="password" 
        placeholder="Contraseña" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <Button
        onClick={() => onLogin(username, password)}
        style={{
          backgroundColor: "#14397F",
        }}
      >
        Iniciar sesión
      </Button>
    </div>
  )
}
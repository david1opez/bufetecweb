"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

import styles from './page.module.css'

type News = {
  id: string
  title: string
  description: string
  imageUrl: string
}

type User = {
  username: string
}

export default function Home() {
  const [news, setNews] = useState<News[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newNews, setNewNews] = useState<Omit<News, 'id'>>({ title: '', description: '', imageUrl: '' })
  const [activePage, setActivePage] = useState('news');
  const [users, setUsers] = useState<any[]>([]);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [createAttorney, setCreateAttorney] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNews()
    }
  }, [user])

  useEffect(() => {
    if(activePage === 'users') {
      document.querySelector('.newsTitle')?.setAttribute('style', 'color: #B3B3B3; font-weight: 700; cursor: pointer');
      document.querySelector('.newsTitle')?.classList.remove('text-3xl');
      document.querySelector('.newsTitle')?.classList.remove(styles.activeTitle);
      document.querySelector('.newsTitle')?.classList.add('text-2xl');
      document.querySelector('.newsTitle')?.classList.add(styles.inactiveTitle);
      document.querySelector('.usersTitle')?.setAttribute('style', 'color: #14397F; font-weight: 700; cursor: pointer');
      document.querySelector('.usersTitle')?.classList.remove('text-2xl');
      document.querySelector('.usersTitle')?.classList.remove(styles.inactiveTitle);
      document.querySelector('.usersTitle')?.classList.add('text-3xl');
      document.querySelector('.usersTitle')?.classList.add(styles.activeTitle);

      fetch('https://buffetec-api.vercel.app/getUsers')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUsers(data);
      });
    } else {
      document.querySelector('.newsTitle')?.setAttribute('style', 'color: #14397F; font-weight: 700; cursor: pointer');
      document.querySelector('.newsTitle')?.classList.remove('text-2xl');
      document.querySelector('.newsTitle')?.classList.remove(styles.inactiveTitle);
      document.querySelector('.newsTitle')?.classList.add('text-3xl');
      document.querySelector('.newsTitle')?.classList.add(styles.activeTitle);
      document.querySelector('.usersTitle')?.setAttribute('style', 'color: #B3B3B3; font-weight: 700; cursor: pointer');
      document.querySelector('.usersTitle')?.classList.remove('text-3xl');
      document.querySelector('.usersTitle')?.classList.remove(styles.activeTitle);
      document.querySelector('.usersTitle')?.classList.add('text-2xl');
      document.querySelector('.usersTitle')?.classList.add(styles.inactiveTitle);
    }
  }, [activePage])

  const fetchNews = async () => {
    // fetch https://buffetec-api.vercel.app/getNoticias
    await fetch('https://buffetec-api.vercel.app/getNoticias')
    .then(response => response.json())
    .then(data => {
      const news = data.articles.map((item: any, index: number) => ({
        id: index,
        title: item.title,
        description: item.description,
        imageUrl: item.urlToImage
      }))

      setNews(news)
    })
  }

  const handleLogin = (username: string, password: string) => {
    setIsLoginOpen(false)
    setUser({ username })
  }

  const handleCreateNews = async () => {
    const newId = Date.now().toString()

    if(newNews.imageUrl === '') {
      const images = [
        "https://bufetecweb.vercel.app/_next/static/media/1.b0413ad8.png",
        "https://bufetecweb.vercel.app/_next/static/media/2.98e68507.png",
        "https://bufetecweb.vercel.app/_next/static/media/3.43c2c507.png",
        "https://bufetecweb.vercel.app/_next/static/media/4.d877bccf.png",
        "https://bufetecweb.vercel.app/_next/static/media/5.cc66026c.png",
        "https://bufetecweb.vercel.app/_next/static/media/6.bb5cf1a9.png",
        "https://bufetecweb.vercel.app/_next/static/media/7.53c8d098.png",
        "https://bufetecweb.vercel.app/_next/static/media/8.d410856c.png",
        "https://bufetecweb.vercel.app/_next/static/media/9.4bd09491.png",
        "https://bufetecweb.vercel.app/_next/static/media/10.45af0ce2.png"
      ];
      newNews.imageUrl = images[Math.floor(Math.random() * images.length)];
    }

    setNews([...news, { ...newNews, id: newId }])

    await fetch('https://buffetec-api.vercel.app/crearNoticia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ news: {
        title: newNews.title,
        description: newNews.description,
        image: newNews.imageUrl
      }}),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
    
    setIsCreating(false)
    setNewNews({ title: '', description: '', imageUrl: '' })
  }

  const handleDeleteNews = async (id: string) => {
    setNews(news.filter(item => item.id !== id))

    const newsToDelete = news.find(item => item.id === id)

    if(!newsToDelete) return;

    await fetch('https://buffetec-api.vercel.app/eliminarNoticia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newsToDelete.title,
        description: newsToDelete.description,
        image: newsToDelete.imageUrl
      }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  if (!user) {
    return (
      <Dialog open={isLoginOpen}>
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
      <div style={{display: "flex", alignItems: "baseline"}}>
        <h1
          className={`text-3xl font-bold mb-4 newsTitle ${styles.activeTitle}`}
          style={{color: "#14397F", fontWeight: 700}}
          onClick={() => {
            setActivePage('news')
          }}
        >Portal de Noticias</h1>
        <svg width="25" height="25" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6L22 16L12 26" stroke="#14397F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1
          className={`text-2xl font-bold mb-4 usersTitle ${styles.inactiveTitle}`}
          style={{color: "#B3B3B3", fontWeight: 700, cursor: "pointer"}}
          onClick={() => {
            setActivePage('users')
          }}
        >Administración de Usuarios</h1>
      </div>

      {
        activePage == 'users' ? (
          <div>
            <p
              className={`text-md mb-4 ${styles.descripcion}`}
              style={{
                color: "#14397F",
                fontSize: 14,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            </p>

            <div>
              {
                users.map((user: any) => (
                  <div style={{marginBottom: "4vh"}}>
                    <p><span style={{fontWeight: "700", color: "#14397F"}}>Nombre:</span> {user.nombre}</p>
                    <p><span style={{fontWeight: "700", color: "#14397F"}}>Correo:</span> {user.email}</p>
                    <div style={{display: "flex"}}>
                      <p style={{fontWeight: "700", color: "#14397F"}}>Tipo: </p>
                      <select
                        value={user.tipo}
                        style={{backgroundColor: "#14397F", borderRadius: 4, marginLeft: "0.5vw", color: "#FFF", padding: "0.5vh 0.4vw"}}
                        onChange={async (e) => {

                          if(e.target.value == 'abogado') {
                            setCreateAttorney(true);
                            setEditedUser(user);
                            return;
                          } else {
                            try {
                              fetch('https://buffetec-api.vercel.app/updateUser', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  uid: user?.uid,
                                  tipo: 'cliente'
                                }),
                              })
                              .then(response => response.json())
                              .then(data => {
                              })
                            }
                            catch (error) {
                              console.error('Error:', error);
                            }
            
                            const updatedUsers = users.map((u: any) => {
                              if(u.uid === user?.uid) {
                                u.tipo = "cliente";
                              }
                              return u;
                            });
            
                            setUsers(updatedUsers);
                          }
                        }}
                      >
                        <option value="abogado" style={{backgroundColor: "#FFFF", color: "#000"}}>Abogado</option>
                        <option value="cliente" style={{backgroundColor: "#FFFF", color: "#000"}}>Cliente</option>
                      </select>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ) : (
          <div>
            <p
              className={`text-md mb-4 ${styles.descripcion}`}
              style={{
                color: "#14397F",
                fontSize: 14,
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
          </div>
        )
      }

      <Dialog open={createAttorney} onOpenChange={setCreateAttorney}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Asignar {editedUser?.nombre} como Abogado</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas asignar a {editedUser?.nombre} como abogado?
            </DialogDescription>
            <Button
              onClick={async () => {
                setCreateAttorney(false);

                try {
                  fetch('https://buffetec-api.vercel.app/updateUser', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      uid: editedUser?.uid,
                      tipo: 'abogado'
                    }),
                  })
                  .then(response => response.json())
                  .then(data => {
                  })
                }
                catch (error) {
                  console.error('Error:', error);
                }

                const updatedUsers = users.map((u: any) => {
                  if(u.uid === editedUser?.uid) {
                    u.tipo = "abogado";
                  }
                  return u;
                });

                try {
                  await fetch('https://buffetec-api.vercel.app/createAttorney', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      uid: editedUser?.uid,
                      especialidad: "",
                      descripcion: "",
                      horarioSemanal: {
                        lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], domingo: []
                      },
                      duracionCita: 0,
                      casosEjemplo: "",
                      excepcionesFechas: []
                    }),
                  })
                  .then(response => response.json())
                  .then(data => {
                    console.log(data);
                  });
                } catch (error) {
                  console.error('Error:', error);
                }

                setUsers(updatedUsers);
                setEditedUser(null);
              }}
              className="font-bold"
              style={{backgroundColor: "#14397F"}}
            >
              Aceptar
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
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
            <img 
              src={item.imageUrl || "https://via.placeholder.com/150"}
              alt={item.title}
              className="w-full h-50 object-cover mb-2"
              style={{
                maxHeight: "150px",
              }}
            />
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
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PageTab from "@/components/PageTab";
import UsersPage from "@/components/UsersPage";
import NewsPage from "@/components/NewsPage";
import NewsForm from "@/components/NewsForm";
import LoginForm from "@/components/LoginForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

import { firebaseConfig } from "@/lib/firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

type News = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

type UserType = {
  uid: string;
  nombre: string;
  genero: string;
  celular: string;
  email: string;
  fechaDeNacimiento: string;
  tipo: string;
};

type PageType = "news" | "users";

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [newNews, setNewNews] = useState<Omit<News, "id">>({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [activePage, setActivePage] = useState<PageType>("news");
  const [users, setUsers] = useState<any[]>([]);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [createAttorney, setCreateAttorney] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserType(currentUser.uid);
        fetchNews();
      } else {
        setUserType(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activePage === "users" && userType === "abogado") {
      fetchUsers();
    }
  }, [activePage, userType]);

  const fetchUserType = async (uid: string) => {
    try {
      const response = await fetch(
        `https://buffetec-api.vercel.app/getUser?uid=${uid}`
      );
      const userData: UserType = await response.json();
      setUserType(userData.tipo);
      if (userData.tipo !== "abogado") {
        await handleLogout();
        alert("No tienes permisos para acceder a esta aplicación.");
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
      await handleLogout();
    }
  };

  const fetchNews = async () => {
    const response = await fetch("https://buffetec-api.vercel.app/getNoticias");
    const data = await response.json();
    const formattedNews = data.articles.map((item: any) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      imageUrl: item.urlToImage || item.image,
    }));
    setNews(formattedNews);
  };

  const fetchUsers = async () => {
    const response = await fetch("https://buffetec-api.vercel.app/getUsers");
    const data = await response.json();
    setUsers(data);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoginOpen(false);
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Credenciales inválidas. Intenta otra vez.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const handleCreateNews = async () => {
    if (!newNews.title || !newNews.description) {
      alert("El título y la descripción son obligatorios.");
      return;
    }

    const newId = Date.now().toString();
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
      "https://bufetecweb.vercel.app/_next/static/media/10.45af0ce2.png",
    ];

    const finalNews = {
      ...newNews,
      id: newId,
      imageUrl:
        newNews.imageUrl || images[Math.floor(Math.random() * images.length)],
    };

    setNews([...news, finalNews]);

    try {
      const response = await fetch(
        "https://buffetec-api.vercel.app/crearNoticia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            news: {
              title: finalNews.title,
              description: finalNews.description,
              image: finalNews.imageUrl,
            },
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setIsCreating(false);
    setNewNews({ title: "", description: "", imageUrl: "" });
  };

  const handleEditNews = (newsToEdit: News) => {
    setEditingNews(newsToEdit);
    setNewNews(newsToEdit);
    setIsEditing(true);
  };

  const handleUpdateNews = async () => {
    if (!editingNews || !newNews.title || !newNews.description) {
      alert("El título y la descripción son obligatorios.");
      return;
    }

    const updatedNews = {
      ...editingNews,
      ...newNews,
    };

    const requestBody = {
      id: String(updatedNews.id), // Ensure id is sent as a string
      title: updatedNews.title,
      description: updatedNews.description,
      image: updatedNews.imageUrl,
    };

    console.log("Request Body:", JSON.stringify(requestBody));

    try {
      const response = await fetch(
        "https://buffetec-api.vercel.app/actualizarNoticia",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update news");
      }

      console.log("News updated successfully");

      // Refetch all news data
      await fetchNews();
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Failed to update news. Please try again.");
    } finally {
      setIsEditing(false);
      setEditingNews(null);
      setNewNews({ title: "", description: "", imageUrl: "" });
    }
  };

  const handleDeleteNews = async (id: string) => {
    const updatedNews = news.filter((item) => item.id !== id);
    setNews(updatedNews);

    const newsToDelete = news.find((item) => item.id === id);
    if (!newsToDelete) return;

    try {
      const response = await fetch(
        "https://buffetec-api.vercel.app/eliminarNoticia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newsToDelete.title,
            description: newsToDelete.description,
            image: newsToDelete.imageUrl,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUserTypeChange = async (user: any, newType: string) => {
    if (newType === "abogado") {
      setCreateAttorney(true);
      setEditedUser(user);
      return;
    }

    try {
      await updateUserType(user.uid, newType);
      const updatedUsers = users.map((u: any) =>
        u.uid === user.uid ? { ...u, tipo: newType } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateUserType = async (uid: string, tipo: string) => {
    const response = await fetch("https://buffetec-api.vercel.app/updateUser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, tipo }),
    });
    return response.json();
  };

  const createAttorneyProfile = async () => {
    try {
      await updateUserType(editedUser.uid, "abogado");
      await fetch("https://buffetec-api.vercel.app/createAttorney", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: editedUser.uid,
          especialidad: "",
          descripcion: "",
          horarioSemanal: {
            lun: [],
            mar: [],
            mie: [],
            jue: [],
            vie: [],
            sab: [],
            dom: [],
          },
          duracionCita: 0,
          casosEjemplo: "",
          excepcionesFechas: [],
        }),
      });

      const updatedUsers = users.map((u: any) =>
        u.uid === editedUser.uid ? { ...u, tipo: "abogado" } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error:", error);
    }

    setCreateAttorney(false);
    setEditedUser(null);
  };

  if (!user || userType !== "abogado") {
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
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-row gap-5">
          <PageTab
            title="Portal de Noticias"
            isActive={activePage === "news"}
            onClick={() => setActivePage("news")}
          />
          {userType === "abogado" && (
            <PageTab
              title="Administración de Usuarios"
              isActive={activePage === "users"}
              onClick={() => setActivePage("users")}
            />
          )}
        </div>
        <Button
          className="
        px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out bg-[#14397F] text-white shadow-md
        focus:outline-none focus:ring-2 focus:ring-[#14397F] focus:ring-opacity-50"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </div>

      {activePage === "users" && userType === "abogado" ? (
        <UsersPage users={users} onUserTypeChange={handleUserTypeChange} />
      ) : (
        <NewsPage
          news={news}
          onDelete={handleDeleteNews}
          onCreateNews={() => setIsCreating(true)}
          onEditNews={handleEditNews}
        />
      )}

      <Dialog open={createAttorney} onOpenChange={setCreateAttorney}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Asignar {editedUser?.nombre} como Abogado</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas asignar a {editedUser?.nombre} como
              abogado?
            </DialogDescription>
            <Button
              onClick={createAttorneyProfile}
              className="font-bold"
              style={{ backgroundColor: "#14397F" }}
            >
              Aceptar
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreating || isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setIsEditing(false);
            setNewNews({ title: "", description: "", imageUrl: "" });
            setEditingNews(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Noticia" : "Crear Nueva Noticia"}
            </DialogTitle>
          </DialogHeader>
          <NewsForm
            news={newNews}
            setNews={setNewNews}
            onSubmit={isEditing ? handleUpdateNews : handleCreateNews}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

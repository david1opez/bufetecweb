import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserPlus } from "lucide-react";

interface User {
  uid: string;
  nombre: string;
  email: string;
  tipo: string;
}

interface UsersPageProps {
  users: User[];
  onUserTypeChange: (user: User, newType: string) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ users, onUserTypeChange }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#14397F] flex items-center">
          <UserPlus className="mr-2" />
          Administración de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-6">
          Administra los usuarios y asigna roles de abogado o cliente.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 rounded-lg overflow-hidden">
                <th className="px-4 py-2 text-left text-[#14397F] first:rounded-l-lg">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left text-[#14397F]">Correo</th>
                <th className="px-4 py-2 text-left text-[#14397F] last:rounded-r-lg">
                  Tipo
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="border-b">
                  <td className="px-4 py-2">{user.nombre}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={user.tipo}
                      onChange={(e) => onUserTypeChange(user, e.target.value)}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="abogado">Abogado</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersPage;

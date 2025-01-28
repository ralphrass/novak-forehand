'use client';

import { useSession, signOut } from "next-auth/react";
import { Avatar } from "./avatar"; // Ajuste o caminho conforme necessário

export default function UserSessionInfo() {
  const { data: session } = useSession();

  // Exibição para visitantes (usuário não autenticado)
  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Avatar
          src="/default-avatar.jpg"
          className="size-10"
          square
          alt="Usuário não logado"
        />
        <span>
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            Visitante
          </p>
          <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
            Faça login para acessar mais recursos
          </p>
        </span>
      </div>
    );
  }

  const user = session.user;

  // Exibição para usuários autenticados
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={user?.image || "/default-avatar.jpg"}
        className="size-10"
        square
        alt={user?.name || "Usuário"}
      />
      <span>
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {user?.name || "Usuário"}
        </p>
        <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
          {user?.email || "Email não disponível"}
        </p>
      </span>
      <button
        onClick={() => signOut()}
        className="ml-4 px-3 py-1 text-xs font-medium text-red-500 hover:underline"
      >
        Sair
      </button>
    </div>
  );
}

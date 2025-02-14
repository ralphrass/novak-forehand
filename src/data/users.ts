// data/users.ts
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    active: boolean;
  }
  
  // Lista de usuários permitidos
  export const users: User[] = [
    {
      id: '1',
      name: 'Ralph Rassweiler',
      email: 'ralphrass@gmail.com',
      password: 'novak123', // senha em texto puro por enquanto
      role: 'admin',
      active: true
    },
    {
      id: '2',
      name: 'Pentágono',
      email: 'rudi@pentagonoseguros.com',
      password: 'Pentagon0', // senha em texto puro por enquanto
      role: 'admin',
      active: true
    }
  ]
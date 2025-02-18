'use client'

import Image from 'next/image'
import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import { getEvents } from '@/data'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'


function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>Minha conta</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Política de privacidade</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Enviar feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={() => signOut({ callbackUrl: '/auth/signin', redirect: true })}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sair</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({
  events,
  children,
}: {
  events: Awaited<ReturnType<typeof getEvents>>
  children: React.ReactNode
}) {
  let pathname = usePathname()
  const { data: session } = useSession()

  // Remove o console.log ou adiciona uma condição
  if (process.env.NODE_ENV === 'development') {
    console.log('Session data:', session)
  }

  // Se não houver sessão, não renderiza o layout
  if (!session) {
    return <>{children}</>
  }

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user?.name || ''}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {session.user?.name?.charAt(0) || '?'}
                  </div>
                )}
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar src="/teams/catalyst.svg" />
                <SidebarLabel>Novak</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <Avatar slot="icon" src="/teams/catalyst.svg" />
                  <DropdownLabel>Novak</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="#">
                  <Avatar slot="icon" initials="BE" className="bg-purple-500 text-white" />
                  <DropdownLabel>Big Events</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <PlusIcon />
                  <DropdownLabel>New team&hellip;</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              {/* <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem> */}
              {/* <SidebarItem href="/events" current={pathname.startsWith('/events')}>
                <Square2StackIcon />
                <SidebarLabel>Documentos personalizados</SidebarLabel>
              </SidebarItem> */}
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              {/* <SidebarItem href="/dashboard" current={pathname.startsWith('/dashboard')}>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem> */}
              <SidebarItem href="/proposta" current={pathname.startsWith('/proposta')}>
                <Square2StackIcon />
                <SidebarLabel>Gerar Proposta (DEMO)</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/gerar_proposta" current={pathname.startsWith('/gerador_proposta')}>
                <Square2StackIcon />
                <SidebarLabel>Gerar Proposta</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/assistente" current={pathname.startsWith('/assistente')}>
                <TicketIcon />
                <SidebarLabel>Assistente de Condições Gerais</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/analise-perfil" current={pathname.startsWith('/analise-perfil')}>
                <Cog6ToothIcon />
                <SidebarLabel>Análise de Perfil</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/send-message" current={pathname.startsWith('/send-message')}>
                <ChatBubbleLeftIcon />
                <SidebarLabel>Assistente de Conversa</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/argumentacao" current={pathname.startsWith('/argumentacao')}>
                <ChatBubbleLeftIcon />
                <SidebarLabel>Argumentação</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/duvidas" current={pathname.startsWith('/duvidas')}>
                <ChatBubbleLeftIcon />
                <SidebarLabel>Dúvidas Gerais</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            {/* <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              {events.map((event) => (
                <SidebarItem key={event.id} href={event.url}>
                  {event.name}
                </SidebarItem>
              ))}
            </SidebarSection>

            <SidebarSpacer /> */}

            <SidebarSection>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Suporte</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <SparklesIcon />
                <SidebarLabel>Informações gerais</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user?.name || ''}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {session.user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {session.user?.name}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {session.user?.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}

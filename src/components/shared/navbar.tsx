'use client'

import React from 'react'
import Image from 'next/image'

import Logo from '@/app/images/logo.png'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

type Props = {}

function Navbar({}: Props) {
  const { data: session, status } = useSession();
  
  return (
    <div className='flex flex-row items-center justify-between w-full px-16 py-4 border-b'>
      <Image
        src={Logo}
        alt="Logo"
        width={200} // Adjust size as needed
        height={200}
        className="object-contain opacity-80"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{session?.user.name}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => signOut()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Navbar
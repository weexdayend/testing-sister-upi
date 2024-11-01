// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Image from 'next/image'

import Logo from '@/app/images/logo.png'
import Background from '@/app/images/bauhaus-background.svg'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.ok) {
      router.push("/antrian");
    } else {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <section
      className='min-w-screen min-h-screen flex flex-col gap-6 px-6 py-6 items-center justify-center relative overflow-hidden'
    >
      <div className="absolute w-[50vw] h-full bottom-0 left-0 -z-50">
        {/* Image */}
        <Image
          src={Background}
          alt="Background"
          className="h-full w-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/30 via-white/80 to-white"></div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Button className="w-full" type="submit">Sign in</Button>
      </form>
      
      <div className="absolute bottom-6 right-6 z-10">
        <Image
          src={Logo}
          alt="Logo"
          width={300} // Adjust size as needed
          height={300}
          className="object-contain opacity-80"
        />
      </div>
    </section>
  );
}

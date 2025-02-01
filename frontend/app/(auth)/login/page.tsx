"use client";

import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signIn("credentials", {
      username: user.username,
      password: user.password,
    })
      return redirect('/');
  };
  return (
    <main>
      <section className="flex flex-col gap-4 justify-center items-center h-screen">
        <h1 className={title()}>Login</h1>
        <form className="max-w-[500px] w-full mx-auto space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username">Username</label>
            <Input
              type="text"
              placeholder="jsmith"
              id="username"
              className="border-gray-700 border rounded-lg"
              size="md"
              value={user?.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              placeholder="******"
              id="password"
              className="border-gray-700 border rounded-lg"
              size="md"
              value={user?.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div>
            <Button className="bg-purple-900 w-full rounded-lg" size="md" type="submit">
              Login
            </Button>
          </div>
        </form>
        <div>
          <p>
            Don&apos;t have an account? <Link href={"register"}>Sign up</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

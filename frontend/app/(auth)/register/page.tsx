"use client";

import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { axiosInstance } from "@/utils/request";

export default function RegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username: string;
    password: string;
    rePassword: string;
  }>({
    username: "",
    password: "",
    rePassword: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        username: user.username,
        password: user.password,
      };
      console.log(data);
      await axiosInstance
        .post("/auth/register/", data)
        .then((res) => console.log(res.data, res.status));
      //   await fetch(`http://localhost:8000/auth/register/`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded",
      //       accept: "application/json",
      //     },
      //     body: JSON.stringify(data),
      //   })
      //     .then((res) => res.json())
      //     .then((res) => console.log(res));
      //   // .then(() => router.push("/"));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <main>
      <section className="flex flex-col gap-4 justify-center items-center h-screen">
        <h1 className={title()}>Register</h1>
        <form
          className="max-w-[500px] w-full mx-auto space-y-4"
          onSubmit={handleSubmit}
        >
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
          <div className="flex flex-col gap-2">
            <label htmlFor="rePassword">Confirm Password</label>
            <Input
              type="password"
              placeholder="******"
              id="rePassword"
              className="border-gray-700 border rounded-lg"
              size="md"
              value={user?.rePassword}
              onChange={(e) => setUser({ ...user, rePassword: e.target.value })}
            />
          </div>
          <div>
            <Button
              className="bg-purple-900 w-full rounded-lg"
              size="md"
              type="submit"
            >
              Sign up
            </Button>
          </div>
        </form>
        <div>
          <p>
            Already have an account? <Link href={"/login"}>Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

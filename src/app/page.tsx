/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {useState} from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = () => {
    authClient.signUp.email({
      email, // user email address
      password, // user password -> min 8 characters by default
      name, // user display name
    }, {
      onRequest: (ctx: any) => {
        // show loading
      },
      onSuccess: (ctx: any) => {
        // redirect to the dashboard or sign in page
      },
      onError: (ctx: any) => {
        // display the error message
        alert(ctx.error?.message ?? "An error occurred");
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4"> 
      <Input placeholder="Name" value={name} onChange={(e) => setName((e as any).target.value)} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail((e as any).target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword((e as any).target.value)} />
      <Button onClick={onSubmit}>Create User</Button>
    </div>
  );
}

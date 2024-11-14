"use client";

import Link from "next/link";
import { LoginForm } from "@/components/form/login-form";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Login() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const errorMessage = searchParams.get("error");
  const successMessage = searchParams.get("success");

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-4">
        <LoginForm
          callbackUrl={callbackUrl || undefined} // Mengubah null menjadi undefined
          errorMessage={errorMessage || undefined} // Mengubah null menjadi undefined
          successMessage={successMessage || undefined} // Mengubah null menjadi undefined
        />
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="register" className="underline">
          Sign up
        </Link>
      </div>
    </>
  );
}

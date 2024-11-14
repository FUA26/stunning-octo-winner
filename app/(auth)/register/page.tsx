import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterForm } from "@/components/form/register-form";

export default function Login() {
  return (
    <div>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-4">
        <RegisterForm />
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="login" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

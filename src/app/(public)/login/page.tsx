import { Suspense } from "react";
import AuthForm from "@/components/public/AuthForm";
export default function LoginPage() { return <section className="mx-auto flex max-w-7xl justify-center px-5 py-16 lg:px-10 lg:py-24"><Suspense fallback={<div className="h-[520px] w-full max-w-4xl animate-pulse rounded-2xl bg-[#e5e1d7]" />}><AuthForm mode="login" /></Suspense></section>; }

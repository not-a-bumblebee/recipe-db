"use client"
import { useAuthStore } from "./store";
import { Affix, Button } from "@mantine/core";
import { useRouter } from "next/navigation";
export default function Home() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const loginUser = useAuthStore((state) => state.loginUser)
  const router = useRouter()
  console.log(isLoggedIn);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <Affix position={{ bottom: 40, right: 40 }}>
        <Button size="lg" onClick={() => { router.push('/create') }}>Create recipe</Button>
      </Affix>
    </main>
  );
}

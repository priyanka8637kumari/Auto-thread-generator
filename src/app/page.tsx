import AuthButton from "@/components/AuthButton";
import Image from "next/image";

export default function Home() {
  return (
   <main>
      <h1 className="text-4xl font-bold">Welcome to Auto Thread Generator</h1>
      <AuthButton />
   </main>
  );
}

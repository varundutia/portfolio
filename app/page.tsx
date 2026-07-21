import StarBackground from "@/components/star-bg";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <StarBackground />
      <section className="mx-auto flex min-h-screen max-w-5xl items-center px-6">
        <div>
          <p className="text-sm text-slate-400">Hello, I’m</p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight md:text-7xl">
            Varun Dutia
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Full-stack software engineer building reliable web, mobile and
            backend applications.
          </p>
        </div>
      </section>
    </main>
  );
}

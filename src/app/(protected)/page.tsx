import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Protected Page</h1>
        <p className="text-gray-700">This page is only accessible to authenticated users.</p>
        <Image
          src="/protected-image.jpg"
          alt="Protected Content"
          width={500}
          height={300}
          className="mt-6 rounded-lg shadow-lg"
        />
      </main>
    </>
  );
}

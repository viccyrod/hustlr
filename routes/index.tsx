import { Head } from "$fresh/runtime.ts";
import ActivityTracker from "../islands/ActivityTracker.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Hustlr Daily Activity Tracker</title>
      </Head>
      <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <header class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          <div class="p-6 mx-auto max-w-screen-md relative">
            <h1 class="text-4xl font-bold text-center tracking-tight">
              Hustlr
              <span class="block text-3xl mt-1 font-medium text-blue-100">Daily Activity Tracker</span>
            </h1>
          </div>
        </header>
        <main class="p-6 mx-auto max-w-screen-md">
          <ActivityTracker />
        </main>
      </div>
    </>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { useOnboardingAuth } from "../hooks/useAuth";

export default function OnboardingPage() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const { login, error, loading } = useOnboardingAuth();

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await login(username, password);
   };

   return (
      <section
         className="font-poppins min-w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('/image.jpg')" }}
      >
         <div className="m-6 px-10 py-6 rounded-lg backdrop-blur-md border border-white/20 text-white shadow-xl">
            <div className="sm:min-w-[350px] max-w-[350px]">
               <h1 className="text-white text-center text-2xl font-bold mb-6">LOGIN</h1>

               <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <label htmlFor="username">Username</label>
                  <input
                     type="text"
                     id="username"
                     name="username"
                     placeholder="Username"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                     disabled={loading}
                     className="p-4 rounded w-full h-[60px] text-black bg-gray-50 disabled:opacity-50"
                  />

                  <label htmlFor="password">Password</label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     disabled={loading}
                     className="p-4 rounded w-full h-[60px] text-black bg-gray-50 disabled:opacity-50"
                  />

                  {error && (
                     <p className="text-red-600 text-sm" role="alert">
                        {error}
                     </p>
                  )}

                  <button
                     type="submit"
                     disabled={loading}
                     className="cursor-pointer mt-4 bg-green text-white py-2 px-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {loading ? "Logging in..." : "LOGIN"}
                  </button>
               </form>
            </div>
         </div>
      </section>
   );
}
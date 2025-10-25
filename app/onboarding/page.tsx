"use client";

import { useState, useEffect, FormEvent } from "react";
import { useOnboardingAuth } from "../hooks/useAuth";

export default function OnboardingPage() {
   const [error, setError] = useState("");
   const { login } = useOnboardingAuth();

   useEffect(() => {
      document.title = "HSE-PTML | Login";
   }, []);

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");

      const formData = new FormData(e.currentTarget);
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      const isValidCredentials =
         username === process.env.NEXT_PUBLIC_USERNAME &&
         password === process.env.NEXT_PUBLIC_PASSWORD;

      if (isValidCredentials) {
         login();
      } else {
         setError(
            "Invalid credentials. Please check username and/or password (case-sensitive)."
         );
      }
   };

   return (
      <section
         className="font-poppins min-w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('/image.jpg')" }}
      >
         <div className="m-6 px-10 py-6 rounded-lg backdrop-blur-md border border-white/20 text-white shadow-xl">
            <div className="sm:min-w-[350px] max-w-[350px]">
               <h1 className="text-white text-center text-2xl font-bold mb-6">
                  LOGIN
               </h1>

               <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <label htmlFor="username">Username</label>
                  <input
                     type="text"
                     id="username"
                     name="username"
                     placeholder="Username"
                     required
                     className="p-4 rounded w-full h-[60px] text-black bg-bg"
                  />

                  <label htmlFor="password">Password</label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     placeholder="Password"
                     required
                     className="p-4 rounded w-full h-[60px] text-black bg-bg"
                  />

                  {error && (
                     <p className="text-red-600 text-sm" role="alert">
                        {error}
                     </p>
                  )}

                  <button
                     type="submit"
                     className="cursor-pointer mt-4 bg-green text-white py-2 px-4 rounded hover:opacity-90 transition-opacity"
                  >
                     LOGIN
                  </button>
               </form>
            </div>
         </div>
      </section>
   );
}
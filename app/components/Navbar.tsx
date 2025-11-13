"use client";
// import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react";


const Navbar = () => {
  const session = useSession();
  return (
    <header className="fixed top-0 w-full z-50 bg-black/35 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="logo.png" alt="logo" className="w-13.5 h-12" />
          <span className="text-xl font-bold text-foreground">SoundQ</span>
        </div>
         {/* /* {session.data?.user ? <button  className="bg-primary py-1.5 rounded-xl cursor-pointer px-5 hover:bg-primary/90" onClick={() => signOut()}>SignOut</button> : <button  className="bg-primary py-1.5 rounded-xl cursor-pointer px-5 hover:bg-primary/90" onClick={() => signIn()}>Signin</button>} */ */}
        <button className="bg-primary py-1.5 rounded-xl cursor-pointer px-5 hover:bg-primary/90" onClick={() => session.data?.user ? signOut() : signIn()}>{session.data?.user ? "SignOut" : "SignIn"}</button>
      </nav>
    </header>
  )
}

 export default Navbar;

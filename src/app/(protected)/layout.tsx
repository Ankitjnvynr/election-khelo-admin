"use client";

// app/components/Layout.tsx
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkCookie = () => {
            setIsLoading(true);
            // Example: looking for a cookie named "token"
            const hasToken = localStorage.getItem("accessToken") || document.cookie.split(';').some((item) => item.trim().startsWith('token='));

            
            if (!hasToken) {
                router.push("/login");
                setIsLoading(true);    
            }else{

                setIsLoading(false);
            }
        };

        checkCookie()
    }, []);

    if(isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex">
            <div className="w-64 ">
                <Sidebar />

            </div>
            <div className="flex-1 pr-2">
                <Topbar />
                <main className="p-6 mt-16  w-full">{children}</main>
            </div>
        </div>
    )
}

export default Layout

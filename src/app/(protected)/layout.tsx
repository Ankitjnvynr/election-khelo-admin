// app/components/Layout.tsx
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"


const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <div className="w-64 ">
                <Sidebar />

            </div>
            <div className="">
                <Topbar />
                <main className="p-6 mt-16">{children}</main>
            </div>
        </div>
    )
}

export default Layout

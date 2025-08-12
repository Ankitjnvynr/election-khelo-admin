// app/components/Sidebar.tsx
import Link from "next/link"
import { FiHome, FiUsers, FiSettings } from 'react-icons/fi'

const Sidebar = () => {
  return (
    <aside className="w-50 bg-gray-100 h-screen p-6  fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-8">Election Khelo</h2>
      <nav className="space-y-4 text-sm font-semibold">
        <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <FiHome />
          <span>Dashboard</span>
        </Link>
        <Link href="/users" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <FiUsers />
          <span>Users</span>
        </Link>
        <Link href="/settings" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <FiSettings />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar

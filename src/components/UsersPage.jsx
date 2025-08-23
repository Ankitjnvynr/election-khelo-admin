"use client";
import { useEffect, useState } from "react";
import { config } from "../conf/config";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        role: "",
        email: "",
        username: "",
        isVerified: "",
    });
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(false);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                role: filters.role,
                email: filters.email,
                username: filters.username,
                isVerified: filters.isVerified,
            }).toString();

            const res = await fetch(`${config.apiBaseUrl}/users/all?${query}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setUsers(data.data.users);
                setPagination({
                    page: data.data.currentPage,
                    totalPages: data.data.totalPages,
                });

            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(pagination.page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        fetchUsers(1);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Users Management</h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    name="username"
                    placeholder="Search Username"
                    value={filters.username}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Search Email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                />
                <select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    name="isVerified"
                    value={filters.isVerified}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                >
                    <option value="">Verified?</option>
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                </select>
            </div>

            <button
                onClick={applyFilters}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600 transition"
            >
                Apply Filters
            </button>

            {/* Users Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border rounded shadow">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Avatar</th>
                                <th className="p-2 border">Username</th>
                                <th className="p-2 border">Full Name</th>
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Role</th>
                                <th className="p-2 border">Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user._id} className="text-center">
                                        <td className="p-2 border">
                                            <img
                                                src={user.avatar || "/avatar.png"}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full mx-auto object-cover"
                                            />
                                        </td>
                                        <td className="p-2 border">{user.username}</td>
                                        <td className="p-2 border">{user.fullName}</td>
                                        <td className="p-2 border">{user.email}</td>
                                        <td className="p-2 border">{user.role}</td>
                                        <td className="p-2 border">
                                            {user.isVerified ? "✅" : "❌"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 gap-4">
                <button
                    disabled={pagination.page === 1}
                    onClick={() => fetchUsers(pagination.page - 1)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => fetchUsers(pagination.page + 1)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

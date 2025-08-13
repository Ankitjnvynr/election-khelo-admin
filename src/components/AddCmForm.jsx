'use client'

import { useState } from 'react'
import {config} from '@/conf/config' // Adjust this import path based on your project setup

const initialFormData = {
    name: '',
    party: '',
    state: '',
    age: '',
    gender: 'male',
    image_url: '', // Kept for API compatibility, but not shown in the form
    term_start: '',
    term_end: '',
    is_current: false,
}

export default function AddCmForm({ onSubmit }) {
    const [formData, setFormData] = useState(initialFormData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const response = await fetch(`${config.apiBaseUrl}/api/v1/cm/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (!response.ok) {
                // If backend sends a specific error message
                throw new Error(result?.message || 'Failed to add Chief Minister')
            }

            setSuccessMessage('Chief Minister added successfully!')
            setFormData(initialFormData)
            onSubmit?.(result.data)

        } catch (err) {
            console.error('Error submitting form:', err)
            setError(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-full mx-auto p-6 bg-white rounded shadow space-y-4">
            <h2 className="text-xl font-bold mb-4">Add New Chief Minister</h2>

            {/* Success Message */}
            {successMessage && (
                <div className="p-3 bg-green-100 text-green-800 border border-green-300 rounded">
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-100 text-red-800 border border-red-300 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Party</label>
                    <input
                        type="text"
                        name="party"
                        value={formData.party}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Term Start</label>
                    <input
                        type="date"
                        name="term_start"
                        value={formData.term_start}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Term End</label>
                    <input
                        type="date"
                        name="term_end"
                        value={formData.term_end}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div className="flex items-center space-x-2 sm:col-span-2">
                    <input
                        type="checkbox"
                        name="is_current"
                        checked={formData.is_current}
                        onChange={handleChange}
                        id="is_current"
                        className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="is_current" className="text-sm text-gray-700">Is Current CM?</label>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 rounded transition text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    )
}

import { useState } from "react"
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { config } from "@/conf/config" // Adjust this import to your config path

export default function CmList({ data = [], getCmList, onRefresh = () => { getCmList() } }) {
  const [selectedCm, setSelectedCm] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editForm, setEditForm] = useState({
    name: "",
    party: "",
    age: "",
    gender: "",
    is_current: false,
    term_start: "",
    term_end: ""
  })

  const handleDelete = async () => {
    if (!selectedCm?._id) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/cm/${selectedCm._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete the Chief Minister.")
      }

      setShowDeleteModal(false)
      setSelectedCm(null)
      onRefresh()
      getCmList()
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditOpen = (cm) => {
    setSelectedCm(cm)
    setEditForm({
      name: cm.name || "",
      party: cm.party || "",
      state: cm.state || "",
      age: cm.age || "",
      gender: cm.gender || "",
      is_current: cm.is_current || false,
      term_start: cm.term_start ? cm.term_start.split("T")[0] : "",
      term_end: cm.term_end ? cm.term_end.split("T")[0] : ""
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!selectedCm?._id) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/cm/${selectedCm._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        throw new Error("Failed to update the Chief Minister.")
      }

      setShowEditModal(false)
      setSelectedCm(null)
      onRefresh()
      getCmList()
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full overflow-auto">
      <table className="min-w-max w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-2 py-1 text-left font-semibold">#</th>
            <th className="px-2 py-1 text-left font-semibold">Name</th>
            <th className="px-2 py-1 text-left font-semibold">Party</th>
            <th className="px-2 py-1 text-left font-semibold">Term</th>
            <th className="px-2 py-1 text-left font-semibold">Current</th>
            <th className="px-2 py-1 text-left font-semibold">Age</th>
            <th className="px-2 py-1 text-left font-semibold">Gender</th>
            <th className="px-2 py-1 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-700">
          {data.map((cm, idx) => (
            <tr key={cm._id} className="hover:bg-gray-50">
              <td className="px-2 py-1">{idx + 1}</td>
              <td className="px-2 py-1">{cm.name}</td>
              <td className="px-2 py-1">{cm.party}</td>
              <td className="px-2 py-1">
                {cm.term_start ? new Date(cm.term_start).getFullYear() : '-'} →{" "}
                {cm.term_end ? new Date(cm.term_end).getFullYear() : cm.is_current ? "Present" : "-"}
              </td>
              <td className="px-2 py-1">
                {cm.is_current ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-gray-500">No</span>
                )}
              </td>
              <td className="px-2 py-1">{cm.age}</td>
              <td className="px-2 py-1 capitalize">{cm.gender}</td>
              <td className="px-2 py-1 capitalize">
                <button
                  onClick={() => handleEditOpen(cm)}
                  className="border-none outline-none cursor-pointer text-xl"
                >
                  <FaEdit className="text-green-800" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCm(cm)
                    setShowDeleteModal(true)
                  }}
                  className="border-none outline-none ml-2 text-xl cursor-pointer text-red-600 hover:text-red-800"
                >
                  <FaTrashAlt className="text-red-800" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete <strong>{selectedCm?.name}</strong>?</p>

            {error && (
              <div className="text-sm text-red-600 mb-3">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Edit Chief Minister</h2>

            <div className="space-y-3">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={editForm.party}
                onChange={(e) => setEditForm({ ...editForm, party: e.target.value })}
                placeholder="Party"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={editForm.state}
                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                placeholder="State"
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                placeholder="Age"
                className="w-full border p-2 rounded"
              />
              <select
                value={editForm.gender}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editForm.is_current}
                  onChange={(e) => setEditForm({ ...editForm, is_current: e.target.checked })}
                />
                <label>Is Current CM</label>
              </div>
              <input
                type="date"
                value={editForm.term_start}
                onChange={(e) => setEditForm({ ...editForm, term_start: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                value={editForm.term_end}
                onChange={(e) => setEditForm({ ...editForm, term_end: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 mt-3">
                {error}
              </div>
            )}

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedCm(null)
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

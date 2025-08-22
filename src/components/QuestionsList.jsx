import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { config } from "@/conf/config"; // Update as needed
import QuestionForm from '@/components/QuestionForm'

export default function QuestionsList({ data = [], onRefresh = () => { } ,getQuestions }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    if (!selectedQuestion?._id) return;

    setLoading(true);
    setError(null);


    try {
      const response = await fetch(
        `${config.apiBaseUrl}/questions/${selectedQuestion._id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the question.");
      }

      setShowDeleteModal(false);
      setSelectedQuestion(null);
      onRefresh();
      getQuestions()
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid gap-4">
        {data.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">No questions found.</p>
        ) : (
          data.map((question, index) => (
            <div
              key={question._id}
              className="bg-white shadow border border-gray-200 rounded-lg p-3"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {index + 1}. {question.question_text}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setShowEditModal(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 text-sm gap-1 mt-1">
                {question.options.map((option, idx) => {
                  const isCorrect = idx === question.correct_option_index;
                  return (
                    <div
                      key={idx}
                      className={`px-4 py-1 border rounded-md ${isCorrect
                        ? "bg-green-100 border-green-500 text-green-800 font-semibold"
                        : "bg-gray-50 border-gray-300 text-gray-700"
                        }`}
                    >
                      <b>{String.fromCharCode(65 + idx)}. </b> { } {option}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Created at: {new Date(question.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4">
              Are you sure you want to delete this question?
              <br />
              <strong className="text-gray-700">
                {selectedQuestion?.question_text}
              </strong>
            </p>

            {error && (
              <div className="text-sm text-red-600 mb-3">{error}</div>
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
                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal Placeholder */}
      {showEditModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">




            {/* Replace this with your actual edit form */}
            <div className="text-sm text-gray-500 italic">
              <QuestionForm
                isLoading={isLoading}
                initialData={selectedQuestion}
                onSubmit={async (data) => {
                  // Handle question update logic here
                  console.log("Updated data:", data);
                  setIsLoading(true);
                  try {
                    const response = await fetch(`${config.apiBaseUrl}/questions/${selectedQuestion?._id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                      },
                      body: JSON.stringify(data),
                    });

                    if (response.ok) {
                      const result = await response.json();
                      console.log('Question created successfully:', result);
                      setSuccessMessage('Question Updated successfully!');
                      setIsLoading(false);
                      setErrorMessage('');
                      setShowEditModal(false);
                      setSelectedQuestion(null);
                      getQuestions()

                    } else {
                      setIsLoading(false);
                      throw new Error('Failed to update question');
                    }
                  } catch (error) {
                    setIsLoading(false);
                    console.error('Error creating question:', error);
                    setErrorMessage(error.message || 'Something went wrong');
                    setSuccessMessage('');
                  }

                }}
                onCancel={() => {
                  setShowEditModal(false);
                  setSelectedQuestion(null);
                }}

              />
            </div>


          </div>
        </div>
      )}
    </div>
  );
}

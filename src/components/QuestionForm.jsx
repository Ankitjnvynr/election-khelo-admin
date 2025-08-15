
"use client";

import { useState, useEffect } from "react";

export default function QuestionForm({
    initialData = null,
    onSubmit,
    onCancel,
    isLoading = false,
}) {
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [correctIndex, setCorrectIndex] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setQuestionText(initialData.question_text || "");
            setOptions(initialData.options || ["", ""]);
            setCorrectIndex(initialData.correct_option_index || 0);
        }
    }, [initialData]);

    const handleOptionChange = (value, index) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        if (options.length < 6) {
            setOptions([...options, ""]);
        }
    };

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            const updated = options.filter((_, i) => i !== index);
            setOptions(updated);
            if (correctIndex === index) {
                setCorrectIndex(0); // reset to first if removed
            } else if (correctIndex > index) {
                setCorrectIndex(correctIndex - 1);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!questionText.trim()) {
            return setError("Question text is required.");
        }

        const trimmedOptions = options.map(opt => opt.trim());
        if (trimmedOptions.some(opt => !opt)) {
            return setError("All options must be filled.");
        }

        if (trimmedOptions.length < 2) {
            return setError("At least 2 options are required.");
        }

        if (correctIndex >= trimmedOptions.length) {
            return setError("Select a valid correct answer.");
        }

        const payload = {
            question_text: questionText.trim(),
            options: trimmedOptions,
            correct_option_index: correctIndex
        };

        onSubmit(payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-4 shadow-md w-full "
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {initialData ? "Edit Question" : "Add New Question"}
            </h2>

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">
                    Question Text
                </label>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={3}
                    required
                />
            </div>

            <label className="block font-medium text-gray-700 mb-2">Options</label>
            <div className="mb-4 grid grid-cols-2 gap-x-16">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className="flex items-center mb-2 gap-2"
                    >
                        <input
                            type="radio"
                            name="correct_option"
                            checked={correctIndex === index}
                            onChange={() => setCorrectIndex(index)}
                            className="text-green-600 focus:ring-green-500"
                        />
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(e.target.value, index)}
                            className="flex-1 border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                        {options.length > 2 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(index)}
                                className="text-red-500 hover:text-red-700 "
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
                {options.length < 6 && (
                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-sm text-green-600 w-[90%] m-auto py-1 hover:text-green-800  cursor-pointer flex-1 border border-gray-300 rounded-md"
                    >
                        + Add Option
                    </button>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
                {
                    isLoading ? (<div className="px-4 py-2 bg-green-300 text-white rounded hover:bg-green-300 cursor-pointer"> Please wait ...</div>) : (<button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                    >
                        {initialData ? "Update Question" : "Add Question"}
                    </button>)
                }

            </div>
        </form>
    );
}

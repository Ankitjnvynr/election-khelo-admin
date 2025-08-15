'use client';

import React, { useState } from 'react';
import QuestionForm from '@/components/QuestionForm';
import { config } from '@/conf/config';

const page = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createQuestion = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/v1/questions/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Question created successfully:', result);
                setSuccessMessage('Question created successfully!');
                setIsLoading(false);
                setErrorMessage('');
            } else {
                setIsLoading(false);
                throw new Error('Failed to create question');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error creating question:', error);
            setErrorMessage(error.message || 'Something went wrong');
            setSuccessMessage('');
        }
    };

    return (
        <div className="">

            {successMessage && (
                <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            <QuestionForm isLoading={isLoading} onSubmit={createQuestion} onCancel={() => { }} />
        </div>
    );
};

export default page;

"use client"
import React, { useEffect, useState } from 'react'
import { config } from '@/conf/config'
import Loading from '@/components/utils/Loading'
import QuestionsList from '@/components/QuestionsList'
import Pagination from '@/components/utils/Pagination'

const page = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
    });

    const getQuestions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/v1/questions/all?search=${filters.search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Questions fetched successfully:', data);
                setQuestions(data.data);
                setIsLoading(false);
            } else {
                if (response.status === 401) {
                    // Handle unauthorized access
                }
                throw new Error('Failed to fetch questions');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getQuestions();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        await getQuestions(); // Refetch with current search filter
    };

    const handleInputChange = (e) => {
        setFilters({ ...filters, search: e.target.value });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <form onSubmit={handleSearch} className='flex justify-between gap-5'>
                <input
                    value={filters.search}
                    onChange={handleInputChange}
                    className='flex-1 shadow mb-2 p-1 px-4 border border-green-800 rounded-full'
                    type='text'
                    placeholder='Search ...'
                />
                <span className='text-gray-500 text-sm font-bold'>
                    Total Questions: {questions.questions?.length || 0}
                </span>
            </form>

            <QuestionsList data={questions.questions} />

            <Pagination
                basePath='/questions'
                currentPage={questions?.currentPage}
                totalItems={questions?.totalQuestions}
            />
        </div>
    );
};

export default page;

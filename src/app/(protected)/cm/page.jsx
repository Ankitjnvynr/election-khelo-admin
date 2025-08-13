
"use client"

import React, { useEffect, useState } from 'react'
import Pagination from '@/components/utils/Pagination'
import CmList from '@/components/CmList'
import { config } from '@/conf/config'

const page = () => {
    const [cmlist, setCmList] = useState([])

    const getCmList = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/v1/cm`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //credentials: 'include', // IMPORTANT
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}` // Assuming you use accessToken for auth
                },
            })

            if (response.ok) {
                const data = await response.json()
                console.log('CM List fetched successfully:', data)
                setCmList(data.data) // Assuming the data is in data.data
            } else {
                console.error('Failed to fetch CM list:', response.statusText)
                throw new Error('Failed to fetch CM list')
            }

        }

        catch (error) {
            console.error('Error fetching CM list:', error)
        }
    }

    useEffect(() => {
        getCmList()
    }
        , [])

    return (
        <>

            <CmList data={cmlist} getCmList={getCmList} />

        </>
    )
}

export default page
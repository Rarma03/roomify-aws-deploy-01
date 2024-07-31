import React from 'react'
import AccountNav from '../AccountNav'
import { Link } from 'react-router-dom'

const ManageFlatmates = () => {
    return (
        <div className='relative min-h-[70vh]'>
            <AccountNav />
            <div>
                //content of request created by user
            </div>
            <Link to={'/account/manageflatmates/new'} className='bg-primary rounded-full w-fit text-white p-2 bottom-0 right-0 absolute'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            </Link>
        </div>
    )
}

export default ManageFlatmates
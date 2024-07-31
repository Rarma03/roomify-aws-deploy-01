import React from 'react'
import IndexNav from '../IndexNav'

const FlatmatePage = () => {
    return (
        <div>
            <IndexNav />
            <div className="border my-2"></div>
            <div className="flex gap-2">
                <div className="bg-white h-40 w-40 border"></div>
                <div className="bg-white h-40 w-40 border"></div>
                <div className="bg-white h-40 w-40 border"></div>
                <div className="bg-white h-40 w-40 border"></div>
            </div>
        </div>
    )
}

export default FlatmatePage
import React, { useState } from 'react';
import SearchFilterWidget from '../SearchFilterWidget';

export default function SearchPage() {

    return (
        <div className="mt-5 p-4 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Filters Area */}
                <SearchFilterWidget />

                {/* Search Area */}
                <div className="flex flex-col gap-4 lg:col-span-3">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Search</h2>
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search for places..."
                            />
                            <button className="absolute right-2 top-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="bg-white p-4 rounded-md shadow-md flex-1">
                        <h2 className="text-lg font-semibold mb-2">Search Results</h2>
                        {/* Add search result components here */}
                        <div>
                            {/* Example result */}
                            <div className="mb-4 p-2 border border-gray-300 rounded-md">
                                <h3 className="text-md font-semibold">Place Title</h3>
                                <p className="text-gray-700">Description of the place.</p>
                            </div>
                            {/* Add more search results as needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

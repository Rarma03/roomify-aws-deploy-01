import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
    const { user } = useContext(UserContext);

    return (
        <header className="bg-white bg-opacity-40 p-4 shadow-md -mx-5 md:mx-0">
            <div className="flex justify-between items-center">
                {/* Logo part */}
                <Link to={'/'} className='flex items-center gap-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    <span className='font-bold text-2xl mb-1'>Roomify</span>
                </Link>

                {/* Center part - search bar */}
                <Link to={'/search'} className='flex border border-gray-300 rounded-full py-2 px-4 gap-2 shadow-md items-center'>
                    <div className="hidden sm:block  pl-3">Anywhere</div>
                    <div className="hidden sm:block border-l pl-3">Any Week</div>
                    <div className="hidden sm:block border-l pl-3">Add Day</div>
                    <button className='bg-primary rounded-full text-white p-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </Link>

                {/* Profile and options part */}
                <Link to={user ? '/account' : '/login'} className="flex items-center border border-gray-300 rounded-full py-2 px-4 gap-2 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    {!!user && (
                        <div className="text-xs sm:text-base">
                            {user.name}
                        </div>
                    )}
                </Link>
            </div>
        </header>
    )
}

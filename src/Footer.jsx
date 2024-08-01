export default function Footer() {
    return (
        <div className="border-t py-8 px-4 bg-gray-100 mt-10 -mb-5 -mx-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h2 className="font-semibold text-xl mt-5">Support</h2>
                    <ul className="mt-2 space-y-1">
                        <li>Help center</li>
                        <li>AirCover</li>
                        <li>Anti-discrimination</li>
                        <li>Cancellation Options</li>
                        <li>Report neighbourhood concern</li>
                    </ul>
                </div>
                <div className="md:border-l md:px-4">
                    <h2 className="font-semibold text-xl mt-5">Hosting</h2>
                    <ul className="mt-2 space-y-1">
                        <li>Roomify your home</li>
                        <li>AirCover for Hosts</li>
                        <li>Hosting resources</li>
                        <li>Community forum</li>
                        <li>Hosting responsibly</li>
                        <li>Join a free Hosting class</li>
                    </ul>
                </div>
                <div className="md:border-l md:px-4">
                    <h2 className="font-semibold text-xl mt-5">Roomify</h2>
                    <ul className="mt-2 space-y-1">
                        <li>NewsRoom</li>
                        <li>New Features</li>
                        <li>Careers</li>
                        <li>Investors</li>
                        <li>Customer Support</li>
                    </ul>
                </div>
            </div>
            <div className="mt-10 text-center group">
                Made With Lots Of Love By Your Fellow Coder
                <a href="https://www.linkedin.com/in/rajverma7/" className="ml-2 text-blue-500" target="_blank">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block group-hover:fill-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>&nbsp;Raj Verma
                    </div>
                </a>
            </div>
        </div>
    );
}

import Image from "./Image";

export default function AllotDeallotWidget({ request }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border border-dashed py-2 px-3 rounded-lg">
                <div className="flex flex-col items-center gap-2">
                    <Image src={request.place.photos[0]} className="aspect-square object-cover max-h-[200px] max-w-[200px] rounded-md" />
                    <div className="text-center">Request By: {request.fullName}</div>
                </div>
                <div className="flex flex-col gap-2 sm:border-l-2 border-dashed p-2">
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>From: {new Date(request.checkIn).toLocaleDateString()}</h1>
                    </div>
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>Total Guest: {request.numberOfGuest}</h1>
                    </div>
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>Phone: {request.phone}</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-2 p-2">
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>To: {new Date(request.checkOut).toLocaleDateString()}</h1>
                    </div>
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>Total Days: {(new Date(request.checkOut) - new Date(request.checkIn)) / (1000 * 60 * 60 * 24)}</h1>
                    </div>
                    <div className="bg-primary rounded-r-md text-white text-center p-1">
                        <h1>Email: {request.email}</h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <button className="bg-green-600 hover:bg-green-400 text-white py-2 rounded-md">Allot the place</button>
                <button className="bg-red-600 hover:bg-red-400 text-white py-2 rounded-md">Reject Request</button>
            </div>
        </div>
    );
}

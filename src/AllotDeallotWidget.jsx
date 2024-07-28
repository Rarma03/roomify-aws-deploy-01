import Image from "./Image";

export default function AllotDeallotWidget({ request }) {
    return (
        < div className="flex flex-col" >
            <div className="grid grid-cols-3 gap-2 border border-dashed py-1 px-2">
                <div className="flex flex-col gap-2">
                    <Image src={request.place.photos[0]} className="aspect-square object-cover relative top-2 max-h-[150px] max-w-[150px] rounded-md" />
                    <div>Request By : {request.fullName}</div>
                </div>
                <div className="flex flex-col gap-2 border-l-2 border-dashed p-2">
                    <div className="bg-primary text-white text-center p-1">
                        <h1>Total Guest : {request.numberOfGuest}</h1>
                    </div>
                    <div className="bg-primary text-white text-center p-1">
                        <h1>Phone : {request.phone}</h1>
                    </div>
                    <div className="bg-primary text-white text-center p-1">
                        <h1>From : {new Date(request.checkIn).toLocaleDateString()}</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-2 p-2">
                    <div className="bg-primary text-white text-center p-1">
                        <h1>Total Days : {(new Date(request.checkOut) - new Date(request.checkIn)) / (1000 * 60 * 60 * 24)}</h1>
                    </div>
                    <div className="bg-primary text-white text-center p-1">
                        <h1>Email : {request.email}</h1>
                    </div>
                    <div className="bg-primary text-white text-center p-1">
                        <h1>To : {new Date(request.checkIn).toLocaleDateString()}</h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="bg-green-600 hover:bg-green-400 text-white">Allot the place</button>
                <button className="bg-red-600 hover:bg-red-400 text-white">Reject</button>
            </div>
        </div >
    )
}
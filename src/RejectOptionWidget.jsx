import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RejectOptionWidget({ bookedplace }) {
    const navigate = useNavigate();

    async function re_allocate_request(ev) {
        ev.preventDefault();
        try {
            await axios.post('/updateBookingStatus', {
                id: bookedplace._id,
                cur_status: 4
            });
            // want to refresh page here
            window.location.reload();
        } catch (err) {
            console.error('Error in re-allocating request:', err);
        }
    }

    async function delete_request(ev) {
        ev.preventDefault();
        try {
            await axios.post('/deleteBooking', {
                id: bookedplace._id
            });
            // want to refresh page here
            window.location.reload();
        }
        catch (err) {
            console.error('Error in deleting request:', err);
        }
    }

    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            <button className="bg-blue-600 hover:bg-green-400 text-white py-2 rounded-md" onClick={re_allocate_request}>Request Again</button>
            <button className="bg-red-600 hover:bg-red-400 text-white py-2 rounded-md" onClick={delete_request}>Delete</button>
        </div>
    );
}

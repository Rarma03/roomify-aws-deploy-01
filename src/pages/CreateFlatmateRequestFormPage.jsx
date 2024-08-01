import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateFlatmateRequestFormPage = () => {
    const [name, setName] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [preferenceType, setPreferenceType] = useState('');
    const [gender, setGender] = useState('');
    const [roomifylink, setRoomifyLink] = useState('');
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);

        const purifyLink = roomifylink.split('/');
        const place = purifyLink[purifyLink.length - 1];
        console.log(place);

        const requestData = {
            name,
            introduction,
            preferenceType,
            gender,
            place,
        };
        console.log(requestData);

        try {
            // Use POST to submit the data to the backend
            await axios.post('/flatmate', requestData);
            navigate('/account/manageflatmates');
        } catch (error) {
            alert(`Can't Create Request Currently Try Later`);
            console.error('Error submitting the flatmate request:', error);
        } finally {
            setLoad(false);
        }
    };


    return (
        <div className='bg-white my-10 p-4 shadow-md rounded-md md:mx-[200px]'>
            <form onSubmit={handleSubmit}>
                <h1 className='text-2xl text-center mb-6'>Create FlatMate Request</h1>
                <div className="mb-4">
                    <label className='block text-gray-700 mb-2'>Name:</label>
                    <input
                        type="text"
                        value={name}
                        placeholder='e.g. Raj Verma'
                        onChange={(e) => setName(e.target.value)}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700 mb-2'>Small Introduction:</label>
                    <textarea
                        type="text"
                        placeholder='e.g. I am working as a software Engineer at Google need a roomate near Downtown street, Wano Kingdom'
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700 mb-2'>Flat-Mate Preference Type:</label>
                    <textarea
                        type="text"
                        value={preferenceType}
                        placeholder='e.g. I want my flatmates to be calm in nature and it would be great if they work in software industry'
                        onChange={(e) => setPreferenceType(e.target.value)}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700 mb-2'>Flat-Mate Gender:</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="girl">Girl</option>
                        <option value="boy">Boy</option>
                        <option value="girl or boy">Girl or Boy</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700 mb-2'>Roomify Place Link:</label>
                    <input
                        type="text"
                        value={roomifylink}
                        placeholder='e.g. https://roomify-aws-deploy-01.vercel.app/place/668ef551cc3386a643005a70'
                        onChange={(e) => setRoomifyLink(e.target.value)}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>
                <button type="submit" className='w-full bg-primary text-white p-2 rounded-md'>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateFlatmateRequestFormPage;

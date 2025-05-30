'use client';

import React, { useState, useEffect } from 'react';


interface Donation {
    id: number;
    amount: number;
    description: string;
}

function App() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch('https://my-json-server-bbsk.onrender.com/donations');
            const data: Donation[] = await response.json();
            setDonations(data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const handleDonate = async () => {
        if (!amount || !description) return;

        const donationData = {
            amount: parseFloat(amount),
            description
        };

        try {
            let response: Response;
            if (editingId) {
                response = await fetch(`https://my-json-server-bbsk.onrender.com/donations/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(donationData)
                });

                if (response.ok) {
                    const updatedDonation: Donation = await response.json();
                    setDonations(donations.map(d =>
                        d.id === editingId ? updatedDonation : d
                    ));
                    setEditingId(null);
                }
            } else {
                response = await fetch('https://my-json-server-bbsk.onrender.com/donations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(donationData)
                });

                if (response.ok) {
                    const newDonation: Donation = await response.json();
                    setDonations(prev => [...prev, newDonation]);
                }
            }

            setAmount('');
            setDescription('');
        } catch (error) {
            console.error('Error donating:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`https://my-json-server-bbsk.onrender.com/donations/${id}`, {
                method: 'DELETE'
            });
            setDonations(donations.filter(d => d.id !== id));
            if (editingId === id) {
                setEditingId(null);
                setAmount('');
                setDescription('');
            }
        } catch (error) {
            console.error('Error deleting donation:', error);
        }
    };

    const handleEdit = (donation: Donation) => {
        setEditingId(donation.id);
        setAmount(String(donation.amount));
        setDescription(donation.description);
    };

    return (
        <div className="bg-gray-100 p-6 rounded shadow-md max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">Donation App</h1>
            <div className="mb-4 p-4 bg-white rounded-md shadow-inner">
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                        Amount:
                    </label>
                    <input
                        type="number"
                        id="amount"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description:
                    </label>
                    <input
                        type="text"
                        id="description"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleDonate}
                >
                    {editingId ? 'Update Donation' : 'Donate'}
                </button>
            </div>
            <div className="mt-6 bg-white rounded-md shadow-inner p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Donations:</h2>
                <ul className="list-none p-0">
                    {donations.map((donation) => (
                        <li key={donation.id} className="py-2 border-b border-gray-200 last:border-b-0 flex justify-between items-center">
                            <div className="font-semibold text-gray-800">
                                <span className="font-semibold text-gray-800">Amount:</span> ${donation.amount}, <div><span className="font-semibold text-gray">Description:</span> {donation.description}</div>
                            </div>
                            <div>
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2 text-sm"
                                    onClick={() => handleEdit(donation)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm"
                                    onClick={() => handleDelete(donation.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
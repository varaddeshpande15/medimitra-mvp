"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { useParams } from "next/navigation"; 

export default function MemberDashboard() {
    const router = useRouter();
    const { id } = useParams(); // Get the id from the URL (e.g., /app/member-dashboard/[id])
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await fetch(`/api/medicines/${id}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setMedicines(data); // Set the retrieved medicines to state
            } catch (err) {
                setError(err.message); // Set error message if fetching fails
            } finally {
                setLoading(false); // Stop loading
            }
        };

        if (id) {
            fetchMedicines(); // Fetch medicines when id is available
        }
    }, [id]);

    // Function to handle the "Add Medicine" button click
    const handleAddMedicineClick = () => {
        if (id) {
            router.push(`/uploadprescription/${id}`); // Redirect to the uploadprescription/[id] page with the member id
        }
    };

    // Example function to handle going back in history
    const handleGoBack = () => {
        router.back(); // Navigate back to the previous page
    };

    return (
        <div>
            <div>
                <div className=''>
                    <button 
                        onClick={handleAddMedicineClick} 
                        className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add Medicine
                    </button>
                </div>
            </div>
            <button onClick={handleGoBack} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">
                Go Back
            </button>

            {/* Render Medicines */}
            {loading && <p>Loading medicines...</p>}
            {error && <p>{error}</p>}
            <div className="medicines-list">
                {medicines.map(medicine => (
                    <div key={medicine._id} className="medicine-card">
                        <h3>{medicine.name}</h3>
                        <p>Dosage: {medicine.dosage}</p>
                        <p>Times: {medicine.times.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

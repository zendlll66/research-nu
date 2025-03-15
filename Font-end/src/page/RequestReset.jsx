import { useState } from "react";
import axios from "axios";

const RequestReset = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting email:", email);  // ตรวจสอบค่า email ก่อนส่ง

        try {
            const response = await fetch(`${backendUrl}/reset/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorMessage = await response.text(); // อ่านข้อความ error จากเซิร์ฟเวอร์
                throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage}`);
            }

            const data = await response.json();
            setMessage("Reset link sent successfully!");
            setError(""); // ล้าง error
            console.log("Response data:", data);
        } catch (error) {
            console.error("Error submitting reset request:", error);
            setError(error.message); // แสดงข้อความ error ใน UI
        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
                <p className="text-gray-600 text-sm mt-2">Enter your email to receive a reset link</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300"
                    >
                        Send Reset Link
                    </button>
                </form>

                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default RequestReset;

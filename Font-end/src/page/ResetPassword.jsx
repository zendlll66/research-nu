import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // ดึง Token จาก URL
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        // ถ้าไม่มี Token ให้ redirect ออกไป
        if (!token) {
            setError("Invalid or expired token.");
            setTimeout(() => navigate("/Foradmin"), 3000);
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post(`${backendUrl}/reset/reset-password`, {
                token,
                password,
            });

            setMessage(res.data.msg);
            setTimeout(() => navigate("/Foradmin"), 3000); // Redirect ไปหน้า Login
        } catch (err) {
            setError(err.response?.data?.msg || "Error resetting password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Reset Password</h2>
                {error && <p className="text-center text-red-500">{error}</p>}
                {message && <p className="text-center text-green-500">{message}</p>}
                
                {!error && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                        >
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;

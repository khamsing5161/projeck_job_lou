import React from 'react'
import axios from 'axios'
import api from '../api/axios'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false);


    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post("/register", { name, email, password });
            alert("สมัครสมาชิกสำเร็จ!");
            setName("");
            setEmail("");
            setPassword("");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.error || "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-96"
            >
                <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

                <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 border rounded mb-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />



                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full p-2 rounded text-white ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {isSubmitting ? "กำลังสมัคร..." : "Register"}
                </button>

                <p className="text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">Login</Link>
                </p>
            </form>
        </div>
    )
}

export default Register

import React, {useEffect, useState} from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useAuth } from "../../hooks/useAuth.tsx";
import { loginSchema } from "../../schemas/authSchema";
import { loginUser } from "../../services/authService";
import chronoverseLogo from "../../../public/chronoverse.svg";
import {useNavigate} from "react-router-dom";
import {useToast} from "../../hooks/useToast.tsx";

const Login: React.FC = () => {
    const toastRef = useToast();
    const { login, token } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            navigate("/admin/beranda", { replace: true });
        }
    }, [token, navigate]);

    const showToast = (severity: "error" | "success", detail: string) => {
        if (toastRef.current) {
            toastRef.current.show({ severity, detail, life: 2000 });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        toastRef.current?.clear();


        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
            const errorMessages: { email?: string; password?: string } = {};
            result.error.errors.forEach((err) => {
                if (err.path.includes("email")) errorMessages.email = err.message;
                if (err.path.includes("password")) errorMessages.password = err.message;
            });
            setErrors(errorMessages);
            setLoading(false);
            return;
        }

        setErrors({});

        try {
            const response = await loginUser({ email, password });
            login(response.data);
            navigate("/admin/beranda");
        } catch (error: any) {
            showToast("error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center h-screen bg-cover bg-center md:bg-[#f2f2f2]">
            <Toast ref={toastRef} position="top-center" />

            <div className="md:w-[90%] md:h-[90%] lg:w-[40%] flex items-center justify-center bg-white flex-col rounded-xl md:shadow-md">
                <div className="md:w-[80%] lg:w-[80%]">
                    <div className="flex items-center justify-center flex-col">
                        <img src={chronoverseLogo} className="md:w-1/3 w-1/2" alt="Chronoverse Logo"/>
                        <h1 className="m-0 text-[#475569] font-extrabold">
                            CHRONO <span className="text-[#f59e0b]">VERSE</span>
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full mt-4">
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                            <InputText
                                id="email"
                                className={`w-full`}
                                invalid={errors.email}
                                placeholder="Masukkan Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    errors.email = false;
                                }}
                            />
                            {errors.email && <small className="p-error">{errors.email}</small>}
                        </div>

                        <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                            <Password
                                id="password"
                                className={`w-full`}
                                invalid={errors.password}
                                feedback={false}
                                placeholder="Masukkan Password"
                                toggleMask
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    errors.password = false;
                                }}
                            />
                            {errors.password && <small className="p-error">{errors.password}</small>}
                        </div>

                        <Button
                            className="w-full flex items-center justify-center font-normal"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <i className="pi pi-spin pi-spinner text-[24px]" style={{color: "#475569"}}></i> : "Sign In"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

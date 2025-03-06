import React, {useEffect, useRef, useState} from "react";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {useAuth} from "../../hooks/useAuth.tsx";
import {loginSchema} from "../../schemas/authSchema";
import {loginUser} from "../../services/authService";
import chronoverseLogo from "../../../public/chronoverse.svg";
import {useNavigate} from "react-router-dom";
import {useToast} from "../../hooks/useToast.tsx";
import {Turnstile} from "@marsidev/react-turnstile";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const Login: React.FC = () => {
    const toastRef = useToast();
    const {login, token} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string; tokenCaptcha: string }>({});
    const [loading, setLoading] = useState(false);
    const ref = useRef();
    const [tokenCaptcha, setTokenCaptcha] = useState("");

    useEffect(() => {
        if (token) {
            navigate("/admin/beranda", {replace: true});
        }
    }, [token, navigate]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = loginSchema.safeParse({email, password, tokenCaptcha});

        if (!result.success) {
            const errorMessages: { email?: string; password?: string; tokenCaptcha: string; } = {};
            result.error.errors.forEach((err) => {
                if (err.path.includes("email")) errorMessages.email = err.message;
                if (err.path.includes("password")) errorMessages.password = err.message;
                if (err.path.includes("tokenCaptcha")) errorMessages.tokenCaptcha = err.message;
            });
            setErrors(errorMessages);
            setLoading(false);
            return;
        }

        setErrors({});

        try {
            const response = await loginUser({email, password, tokenCaptcha});
            login(response.data);
            toastRef.current?.show({severity: "success", detail: "Berhasil masuk ke sistem", life: 2000});
            navigate("/admin/beranda");
        } catch (error) {
            toastRef.current?.show({severity: "error", detail: error.message, life: 2000});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center h-screen bg-cover bg-center bg-white md:bg-[#f2f2f2]">
            <div
                className="md:w-[90%] md:h-[95%] lg:w-[40%] flex items-center justify-center bg-white flex-col rounded-xl md:shadow-md">
                <div className="md:w-[80%] lg:w-[80%]">
                    <div className="flex items-center justify-center flex-col">
                        <img src={chronoverseLogo} className="md:w-[35%] w-1/2" alt="Chronoverse Logo"/>
                        <h1 className="m-0 font-extrabold" style={{color: 'var(--surface-600)'}}>
                            CHRONO<span style={{color: 'var(--primary-500)'}}>VERSE</span>
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-2">
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

                        <div className="mb-2">
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
                        <Turnstile
                            ref={ref}
                            siteKey={turnstileSiteKey}
                            className="md:mx-0  mx-auto w-fit border-red-1 rounded-md "
                            style={errors.tokenCaptcha ? {
                                border: "1px solid #e24c69",
                                padding: "1.5px 1.5px 2.2px 1.5px"
                            } : {}}
                            onSuccess={(token) => {
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    tokenCaptcha: false,
                                }));
                                setTokenCaptcha(token)
                            }}
                            onError={() => {
                                setTokenCaptcha("");
                                ref.current?.reset();
                            }}
                            onExpire={() => {
                                setTokenCaptcha("");
                                ref.current?.reset();
                            }}
                        />
                        {errors.tokenCaptcha && <small className="p-error">{errors.tokenCaptcha}</small>}
                        <div className={"mb-2"}></div>

                        <Button
                            className="w-full flex items-center justify-center font-normal"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <i className="pi pi-spin pi-spinner text-[24px]"
                                          style={{color: "#475569"}}></i> : "Sign In"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

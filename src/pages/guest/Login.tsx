import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth.tsx";
import { loginSchema } from "../../schemas/authSchema";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast.tsx";
import { Turnstile } from "@marsidev/react-turnstile";
import GuestFormContainer from "../../components/GuestFormContainer.tsx";
import SubmitButton from "../../components/SubmitButton.tsx";
import InputGroup from "../../components/InputGroup.tsx";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const Login: React.FC = () => {
    const toastRef = useToast();
    const { login, token } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: "",
        tokenCaptcha: "",
    });
    const [errors, setError] = useState({
        email: "",
        password: "",
        tokenCaptcha: "",
    });
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (token) {
            navigate("/admin/beranda", { replace: true });
        }
    }, [token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = loginSchema.safeParse(data);

        if (!result.success) {
            const errorMessages = {
                email: "",
                password: "",
                tokenCaptcha: "",
            };
            result.error.errors.forEach((err) => {
                errorMessages[err.path[0]] = err.message;
            });
            setError(errorMessages);
            setLoading(false);
            return;
        }

        setError({
            email: "",
            password: "",
            tokenCaptcha: "",
        });

        try {
            const response = await loginUser(data);
            login(response.data);
            toastRef.current?.show({ severity: "success", detail: "Berhasil masuk ke sistem", life: 2000 });
            navigate("/admin/beranda");
        } catch (error) {
            toastRef.current?.show({ severity: "error", detail: error.message, life: 2000 });
        } finally {
            setData(prev => ({ ...prev, tokenCaptcha: "" }));
            ref.current?.reset();
            setLoading(false);
        }
    };

    return (
        <GuestFormContainer title={<p>Masuk Ke Sistem</p>}>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-2 mt-2 w-full">
                    <InputGroup
                        label="Email"
                        data={data.email}
                        error={errors.email}
                        setData={(e) => {
                            setData(prev => ({...prev, email: e}));
                        }}
                        setError={(e) => {
                            setError(prev => ({...prev, email: e}));
                        }}
                    />
                </div>
                <div className="mb-2">
                    <InputGroup
                        type="password"
                        label="Password"
                        data={data.password}
                        error={errors.password}
                        setData={(e) => {
                            setData(prev => ({...prev, password: e}));
                        }}
                        setError={(e) => {
                            setError(prev => ({...prev, password: e}));
                        }}
                    />
                </div>
                <div className="flex flex-col mb-2">
                    <Turnstile
                        ref={ref}
                        options={{language: "id", size: "flexible"}}
                        siteKey={turnstileSiteKey}
                        onSuccess={(token) => setData(prev => ({...prev, tokenCaptcha: token}))}
                        onError={() => {
                            setData(prev => ({...prev, tokenCaptcha: ""}))
                            ref.current?.reset();
                        }}
                        onExpire={() => {
                            setData(prev => ({...prev, tokenCaptcha: ""}))
                            ref.current?.reset();
                        }}
                    />
                </div>
                <SubmitButton loading={loading} captchaMode={true} tokenCaptcha={data.tokenCaptcha}/>
            </form>
            <h1 className="m-0 mt-2  text-sm font-normal text-center" style={{color: 'var(--surface-600)'}}>
                Lupa Password? <span
                onClick={() => navigate('/reset/request')}
                style={{color: 'var(--primary-500)', fontWeight: '500'}}
                className="cursor-pointer"
            >
        Permintaan Reset
      </span>
            </h1>

        </GuestFormContainer>
    );
};

export default Login;

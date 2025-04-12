import React, {useEffect, useRef, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {ResetRequestSchema} from "../../schemas/ResetSchema.tsx";
import {useNavigate} from "react-router-dom";
import {useToast} from "../../hooks/useToast.tsx";
import {Turnstile} from "@marsidev/react-turnstile";
import GuestFormContainer from "../../components/GuestFormContainer.tsx";
import InputGroup from "../../components/InputGroup.tsx";
import SubmitButton from "../../components/SubmitButton.tsx";
import {ResetService} from "../../services/ResetService.tsx"
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const Login: React.FC = () => {
    const toastRef = useToast();
    const {login, token} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errors, setError] = useState<{ email?: string;}>({});
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);
    const [tokenCaptcha, setTokenCaptcha] = useState("");

    useEffect(() => {
        if (token) {
            navigate("/admin/beranda", {replace: true});
        }
    }, [token, navigate]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = ResetRequestSchema.safeParse({email, tokenCaptcha});

        if (!result.success) {
            const errorMessages: { email?: string; tokenCaptcha: string; } = {};
            result.error.errors.forEach((err) => {
                if (err.path.includes("email")) errorMessages.email = err.message;
                if (err.path.includes("tokenCaptcha")) errorMessages.tokenCaptcha = err.message;
            });
            setError(errorMessages);
            setLoading(false);
            return;
        }

        setError({});

        try {
            const response = await ResetService.resetRequest({email, tokenCaptcha});
            login(response.data);
            toastRef.current?.show({severity: "success", detail: "Cek inbox atau spam pada email anda", life: 2000});
            navigate("/reset");
        } catch (error) {
            toastRef.current?.show({severity: "error", detail: error.message, life: 2000});
        } finally {
            setTokenCaptcha("");
            ref.current?.reset();
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(email)
    }, [email]);

    return (
        <GuestFormContainer title={"Permintaan Reset Akun"}>

            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-2 mt-2">
                    <div className="mb-2 mt-2 w-full">
                        <InputGroup
                            label={"Email"}
                            data={email}
                            error={errors.email}
                            setData={(e) => {
                                setEmail(e);
                            }}
                            setError={(e) => {
                                setError(prev => ({...prev, email: e}));
                            }}
                        />
                    </div>
                </div>
                <div className={`flex flex-col mb-2`}>
                    <Turnstile
                        ref={ref}
                        options={{
                            language: 'id',
                            size: "flexible"
                        }}
                        siteKey={turnstileSiteKey}

                        onSuccess={(token) => {
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
                </div>

                <SubmitButton captchaMode={true} tokenCaptcha={tokenCaptcha} loading={loading}/>
                <h1 className="m-0 mt-2  text-sm font-normal text-center" style={{color: 'var(--surface-600)'}}>
                    Memiliki Kode Reset? <span
                    onClick={() => navigate('/reset')}
                    style={{color: 'var(--primary-500)', fontWeight: '500'}}
                    className="cursor-pointer"
                >
        Reset Akun
      </span>
                </h1>
                <h1 className="m-0 text-sm font-normal text-center" style={{color: 'var(--surface-600)'}}>
                    Kembali Ke <span
                    onClick={() => navigate('/login')}
                    style={{color: 'var(--primary-500)', fontWeight: '500'}}
                    className="cursor-pointer"
                >
        Halaman Login
      </span>
                </h1>
            </form>
        </GuestFormContainer>
    );
};

export default Login;

import React, {useEffect, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {ResetSchema} from "../../schemas/ResetSchema.tsx";
import {ResetService} from "../../services/ResetService.tsx"
import {useNavigate} from "react-router-dom";
import {useToast} from "../../hooks/useToast.tsx";
import GuestFormContainer from "../../components/GuestFormContainer.tsx";
import InputGroup from "../../components/InputGroup.tsx";
import SubmitButton from "../../components/SubmitButton.tsx";
import { useSearchParams } from "react-router-dom";

const Login: React.FC = () => {
    const toastRef = useToast();
    const {login, token} = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [code, setCode] = useState(searchParams.get("code") || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ code?: string; password?: string; confirmPassword?: string }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            navigate("/admin/beranda", {replace: true});
        }
    }, [token, navigate]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = ResetSchema.safeParse({code, password, confirmPassword});

        if (!result.success) {
            const errorMessages: { code?: string; password?: string; confirmPassword: string; } = {};
            result.error.errors.forEach((err) => {
                if (err.path.includes("code")) errorMessages.code = err.message;
                if (err.path.includes("password")) errorMessages.password = err.message;
                if (err.path.includes("confirmPassword")) errorMessages.confirmPassword = err.message;
            });
            setErrors(errorMessages);
            setLoading(false);
            return;
        }

        setErrors({});

        try {
            const response = await ResetService.reset({code, password, confirmPassword});
            login(response.data);
            toastRef.current?.show({severity: "success", detail: "Berhasil melakukan reset", life: 2000});
            navigate("/login");
        } catch (error) {
            toastRef.current?.show({severity: "error", detail: error.message, life: 2000});
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestFormContainer title={"Reset Akun Anda"}>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-2 mt-2 w-full">
                    <InputGroup
                        label="Kode Reset"
                        data={code}
                        error={errors.code}
                        setData={(e) => {
                            setCode(e)
                        }}
                        setError={(e) => {
                            setErrors(prev => ({...prev, code: e}));
                        }}
                        tip={"Salin kode reset dari email Anda dan tempel"}
                    />
                        </div>
                        <div className="mb-2">
                        <InputGroup
                        type="password"
                        label="Password Baru"
                        data={password}
                     error={errors.password}
                     setData={(e) => {
                         setPassword(e);
                     }}
                     setError={(e) => {
                         setErrors(prev => ({...prev, password: e}));
                     }}
                />
            </div>
            <div className="mb-2">
                <InputGroup
                    type="password"
                    label="Konfirmasi Password Baru"
                    data={confirmPassword}
                    error={errors.confirmPassword}
                    setData={(e) => {
                        setConfirmPassword(e)
                    }}
                    setError={(e) => {
                        setErrors(prev => ({...prev, confirmPassword: e}));
                        }}
                    />
                </div>
                <SubmitButton loading={loading}/>
                <h1 className="m-0 mt-2  text-sm font-normal text-center" style={{color: 'var(--surface-600)'}}>
                    Belum Memiliki Kode Reset? <span
                    onClick={() => navigate('/reset/request')}
                    style={{color: 'var(--primary-500)', fontWeight: '500'}}
                    className="cursor-pointer"
                >
        Permintaan Reset
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

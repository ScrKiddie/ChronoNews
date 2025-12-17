import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { loginSchema } from '../../schemas/authSchema.ts';
import { loginUser } from '../../services/authService.ts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast.ts';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import GuestFormContainer from '../../components/layout/GuestFormContainer.tsx';
import SubmitButton from '../../components/ui/SubmitButton.tsx';
import InputGroup from '../../components/ui/InputGroup.tsx';
import { handleApiError, showSuccessToast } from '../../utils/toastUtils.ts';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { ApiError } from '../../types/api.ts';

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const Login: React.FC = () => {
    const toastRef = useToast();
    const { login, token } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
        tokenCaptcha: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const captchaRef = useRef<TurnstileInstance>(null);

    useEffect(() => {
        if (token) {
            navigate('/admin/beranda', { replace: true });
        }
    }, [token, navigate]);

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (response) => {
            login(response.data);
            showSuccessToast(toastRef, 'Berhasil masuk ke sistem');
            navigate('/admin/beranda');
        },
        onError: (error: ApiError) => {
            if (error?.status !== 400 && error?.status !== 401) {
                handleApiError(error, toastRef);
            }

            if (error?.status === 401 || error?.status === 400) {
                setErrors({
                    email: 'Email atau password salah',
                    password: 'Email atau password salah',
                });
            }

            setData((prev) => ({ ...prev, tokenCaptcha: '' }));
            captchaRef.current?.reset();
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const validatedData = loginSchema.parse(data);
            await loginMutation.mutateAsync(validatedData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const hasEmailOrPasswordError = error.errors.some(
                    (err) => err.path[0] === 'email' || err.path[0] === 'password'
                );

                if (hasEmailOrPasswordError) {
                    setErrors({
                        email: 'Email atau password salah',
                        password: 'Email atau password salah',
                    });
                } else {
                    const formErrors = error.errors.reduce(
                        (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
                        {}
                    );
                    setErrors(formErrors);
                }
            }
        }
    };

    const clearAuthErrors = () => {
        if (
            errors.email === 'Email atau password salah' ||
            errors.password === 'Email atau password salah'
        ) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.email;
                delete newErrors.password;
                return newErrors;
            });
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
                            setData((prev) => ({ ...prev, email: e }));
                            clearAuthErrors();
                        }}
                        setError={(e) => setErrors((prev) => ({ ...prev, email: e }))}
                    />
                </div>
                <div className="mb-2">
                    <InputGroup
                        type="password"
                        label="Password"
                        data={data.password}
                        error={errors.password}
                        setData={(e) => {
                            setData((prev) => ({ ...prev, password: e }));
                            clearAuthErrors();
                        }}
                        setError={(e) => setErrors((prev) => ({ ...prev, password: e }))}
                    />
                </div>
                <div className="flex flex-col mb-2">
                    <Turnstile
                        ref={captchaRef}
                        options={{ language: 'id', size: 'flexible' }}
                        siteKey={turnstileSiteKey}
                        onSuccess={(token) => setData((prev) => ({ ...prev, tokenCaptcha: token }))}
                        onError={() => {
                            setData((prev) => ({ ...prev, tokenCaptcha: '' }));
                            captchaRef.current?.reset();
                        }}
                        onExpire={() => {
                            setData((prev) => ({ ...prev, tokenCaptcha: '' }));
                            captchaRef.current?.reset();
                        }}
                    />
                </div>
                <SubmitButton
                    loading={loginMutation.isPending}
                    captchaMode={true}
                    tokenCaptcha={data.tokenCaptcha}
                />
            </form>
            <h1
                className="m-0 mt-2  text-sm font-normal text-center"
                style={{ color: 'var(--surface-600)' }}
            >
                Lupa Password?{' '}
                <span
                    onClick={() => navigate('/reset/request')}
                    style={{ color: 'var(--primary-500)', fontWeight: '500' }}
                    className="cursor-pointer"
                >
                    Permintaan Reset
                </span>
            </h1>
        </GuestFormContainer>
    );
};

export default Login;

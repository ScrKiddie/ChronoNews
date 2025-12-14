import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { ResetRequestSchema } from '../../schemas/resetSchema.ts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast.ts';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import GuestFormContainer from '../../components/layout/GuestFormContainer.tsx';
import InputGroup from '../../components/ui/InputGroup.tsx';
import SubmitButton from '../../components/ui/SubmitButton.tsx';
import { ResetService } from '../../services/resetService.ts';
import { handleApiError, showSuccessToast } from '../../utils/toastUtils.ts';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { ApiError } from '../../types/api.ts';

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const ResetRequest: React.FC = () => {
    const toastRef = useToast();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({ email: '', tokenCaptcha: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const captchaRef = useRef<TurnstileInstance>(null);

    useEffect(() => {
        if (token) {
            navigate('/admin/beranda', { replace: true });
        }
    }, [token, navigate]);

    const resetRequestMutation = useMutation({
        mutationFn: ResetService.resetRequest,
        onSuccess: () => {
            showSuccessToast(toastRef, 'Cek inbox atau spam pada email anda');
            navigate('/reset');
        },
        onError: (error: ApiError) => {
            handleApiError(error, toastRef);
            setData((prev) => ({ ...prev, tokenCaptcha: '' }));
            captchaRef.current?.reset();
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = ResetRequestSchema.parse(data);
            await resetRequestMutation.mutateAsync(validatedData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formErrors = error.errors.reduce(
                    (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
                    {}
                );
                setErrors(formErrors);
            }
        }
    };

    return (
        <GuestFormContainer title={'Permintaan Reset Akun'}>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-2 mt-2 w-full">
                    <InputGroup
                        label={'Email'}
                        data={data.email}
                        error={errors.email}
                        setData={(e) => setData((prev) => ({ ...prev, email: e }))}
                        setError={(e) => setErrors((prev) => ({ ...prev, email: e }))}
                    />
                </div>
                <div className={`flex flex-col mb-2`}>
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
                    captchaMode={true}
                    tokenCaptcha={data.tokenCaptcha}
                    loading={resetRequestMutation.isPending}
                />
                <h1
                    className="m-0 mt-2  text-sm font-normal text-center"
                    style={{ color: 'var(--surface-600)' }}
                >
                    Memiliki Kode Reset?{' '}
                    <span
                        onClick={() => navigate('/reset')}
                        style={{ color: 'var(--primary-500)', fontWeight: '500' }}
                        className="cursor-pointer"
                    >
                        Reset Akun
                    </span>
                </h1>
                <h1
                    className="m-0 text-sm font-normal text-center"
                    style={{ color: 'var(--surface-600)' }}
                >
                    Kembali Ke{' '}
                    <span
                        onClick={() => navigate('/login')}
                        style={{ color: 'var(--primary-500)', fontWeight: '500' }}
                        className="cursor-pointer"
                    >
                        Halaman Login
                    </span>
                </h1>
            </form>
        </GuestFormContainer>
    );
};

export default ResetRequest;

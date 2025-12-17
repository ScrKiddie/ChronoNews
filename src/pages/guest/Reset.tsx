import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { ResetSchema } from '../../schemas/resetSchema.ts';
import { ResetService } from '../../services/resetService.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../hooks/useToast.ts';
import GuestFormContainer from '../../components/layout/GuestFormContainer.tsx';
import InputGroup from '../../components/ui/InputGroup.tsx';
import SubmitButton from '../../components/ui/SubmitButton.tsx';
import { handleApiError, showSuccessToast } from '../../utils/toastUtils.ts';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { ApiError } from '../../types/api.ts';

const Reset: React.FC = () => {
    const toastRef = useToast();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [data, setData] = useState({
        code: searchParams.get('code') || '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (token) {
            navigate('/admin/beranda', { replace: true });
        }
    }, [token, navigate]);

    const resetMutation = useMutation({
        mutationFn: ResetService.reset,
        onSuccess: () => {
            showSuccessToast(toastRef, 'Berhasil melakukan reset');
            navigate('/login');
        },
        onError: (error: ApiError) => {
            if (error?.status !== 400) {
                handleApiError(error, toastRef);
            }

            if (error?.status === 400 && error.message) {
                setErrors({ code: error.message });
            }
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const validatedData = ResetSchema.parse(data);
            await resetMutation.mutateAsync(validatedData);
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
        <GuestFormContainer title={'Reset Akun Anda'}>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-2 mt-2 w-full">
                    <InputGroup
                        label="Kode Reset"
                        data={data.code}
                        error={errors.code}
                        setData={(e) => setData((prev) => ({ ...prev, code: e }))}
                        setError={(e) => setErrors((prev) => ({ ...prev, code: e }))}
                        tip={'Salin kode reset dari email Anda dan tempel'}
                    />
                </div>
                <div className="mb-2">
                    <InputGroup
                        type="password"
                        label="Password Baru"
                        data={data.password}
                        error={errors.password}
                        setData={(e) => setData((prev) => ({ ...prev, password: e }))}
                        setError={(e) => setErrors((prev) => ({ ...prev, password: e }))}
                    />
                </div>
                <div className="mb-2">
                    <InputGroup
                        type="password"
                        label="Konfirmasi Password Baru"
                        data={data.confirmPassword}
                        error={errors.confirmPassword}
                        setData={(e) => setData((prev) => ({ ...prev, confirmPassword: e }))}
                        setError={(e) => setErrors((prev) => ({ ...prev, confirmPassword: e }))}
                    />
                </div>
                <SubmitButton loading={resetMutation.isPending} />
                <h1
                    className="m-0 mt-2  text-sm font-normal text-center"
                    style={{ color: 'var(--surface-600)' }}
                >
                    Belum Memiliki Kode Reset?{' '}
                    <span
                        onClick={() => navigate('/reset/request')}
                        style={{ color: 'var(--primary-500)', fontWeight: '500' }}
                        className="cursor-pointer"
                    >
                        Permintaan Reset
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

export default Reset;

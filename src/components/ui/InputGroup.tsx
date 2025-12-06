import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';

interface InputGroupProps<T extends string | number | readonly string[] | undefined> {
    type?: 'text' | 'password' | 'dropdown';
    label?: string;
    data?: T;
    setData?: (value: T) => void;
    error?: string;
    setError?: (error: string) => void;
    tip?: string;
    options?: { label: string; value: T }[];
}

const InputGroup = <T extends string | number | readonly string[] | undefined>({
    type = 'text',
    label = '',
    data = '' as T,
    setData = () => {},
    error,
    setError = () => {},
    tip = '',
    options = [],
}: InputGroupProps<T>) => {
    return (
        <>
            <label
                htmlFor={label.replace(/\s+/g, '').toLowerCase()}
                className={`block mb-1 font-medium  ${error ? 'p-error' : 'text-[#48525f]'}`}
            >
                {label}
            </label>
            {type == 'text' && (
                <InputText
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    className={`w-full`}
                    invalid={!!error}
                    value={data as string}
                    onChange={(e) => {
                        if (setData) setData(e.target.value as T);
                        if (setError) setError('');
                    }}
                />
            )}
            {type == 'password' && (
                <Password
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    className={`w-full`}
                    invalid={!!error}
                    feedback={false}
                    toggleMask
                    value={data as string}
                    onChange={(e) => {
                        if (setData) setData(e.target.value as T);
                        if (setError) setError('');
                    }}
                />
            )}
            {type == 'dropdown' && (
                <Dropdown
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    className="w-full"
                    options={options}
                    value={data}
                    onChange={(e) => {
                        if (setData) setData(e.value as T);
                        if (setError) setError('');
                    }}
                    invalid={!!error}
                />
            )}
            {error && <small className="p-error">{error}</small>}
            {!error && tip != '' && <small className="text-gray-500">{tip}</small>}
        </>
    );
};

export default InputGroup;

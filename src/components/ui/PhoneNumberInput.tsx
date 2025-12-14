import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';

interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

const countries: Country[] = [
    { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩' },
    { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
    { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬' },
    { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾' },
];

interface PhoneNumberInputProps {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    setError?: (error: string) => void;
    tip?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
    label = 'Phone Number',
    value = '',
    onChange = () => {},
    error,
    setError = () => {},
    tip = '',
}) => {
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const dropdownRef = useRef<Dropdown>(null);

    useEffect(() => {
        if (value) {
            const matchedCountry = countries.find((c) => value.startsWith(c.dialCode));
            if (matchedCountry) {
                setSelectedCountry(matchedCountry);
            }
        }
    }, [value]);

    const getLocalNumber = (fullValue: string) => {
        if (!fullValue) return '';
        if (fullValue.startsWith(selectedCountry.dialCode)) {
            return fullValue.slice(selectedCountry.dialCode.length);
        }
        return fullValue;
    };

    const handleCountryChange = (e: DropdownChangeEvent) => {
        const newCountry = e.value;
        const currentLocalNumber = getLocalNumber(value);
        setSelectedCountry(newCountry);

        onChange(newCountry.dialCode + currentLocalNumber);

        if (setError) setError('');
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value.replace(/\D/g, '');

        onChange(selectedCountry.dialCode + inputVal);

        if (setError) setError('');
    };

    const countryOptionTemplate = (option: Country) => {
        return (
            <div className="flex align-items-center gap-2 white-space-nowrap">
                <span className="text-xl">{option.flag}</span>
                <span className="font-medium text-gray-500 w-2rem inline-block">
                    {option.dialCode}
                </span>
                <span className="text-gray-900">{option.name}</span>
            </div>
        );
    };

    return (
        <div className="field">
            <style>{`
                .country-picker-panel {
                    min-width: 300px !important;
                    width: 300px !important;
                }
                @media screen and (max-width: 400px) {
                    .country-picker-panel {
                        min-width: 90vw !important;
                        width: 90vw !important;
                    }
                }
            `}</style>

            <label
                htmlFor="phonenumber"
                className={`block mb-1 font-medium ${error ? 'p-error' : 'text-[#48525f]'}`}
            >
                {label}
            </label>

            <div className="p-inputgroup w-full">
                <div className="relative flex-none">
                    <Button
                        type="button"
                        className="p-button-primary relative z-10 h-full font-normal p-ripple custom-button-phone"
                        label={`${selectedCountry.flag} ${selectedCountry.dialCode}`}
                        icon="pi pi-chevron-down"
                        iconPos="right"
                        onClick={() => {
                            dropdownRef.current?.getElement()?.click();
                        }}
                    />
                    <Dropdown
                        ref={dropdownRef}
                        value={selectedCountry}
                        options={countries}
                        onChange={handleCountryChange}
                        optionLabel="name"
                        filter
                        itemTemplate={countryOptionTemplate}
                        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none p-0 border-none"
                        style={{ minWidth: 0 }}
                        panelClassName="country-picker-panel"
                        tabIndex={-1}
                    />
                </div>

                <InputText
                    id="phonenumber"
                    className="w-full"
                    invalid={!!error}
                    value={getLocalNumber(value)}
                    onChange={handleNumberChange}
                    keyfilter="int"
                />
            </div>

            {error && <small className="p-error block mt-1">{error}</small>}
            {!error && tip !== '' && <small className="text-gray-500 block mt-1">{tip}</small>}
        </div>
    );
};

export default PhoneNumberInput;

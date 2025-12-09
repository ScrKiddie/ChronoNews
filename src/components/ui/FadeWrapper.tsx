import React from 'react';

interface FadeWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export const FadeWrapper: React.FC<FadeWrapperProps> = ({ children, className = '' }) => {
    return <div className={`animate-fade-in ${className}`}>{children}</div>;
};

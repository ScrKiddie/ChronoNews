import React, { useEffect, useState } from 'react';
import { Skeleton } from 'primereact/skeleton';

interface ClientOnlyProps {
    children: React.ReactNode;
}
const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted ? <>{children}</> : null;
};

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, style, ...props }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <ClientOnly>
            {isLoading && (
                <Skeleton
                    className={className}
                    width="100%"
                    height="100%"
                    borderRadius="0"
                    style={{
                        ...style,
                        zIndex: 10,
                        backgroundColor: '#e5e7eb',
                    }}
                />
            )}

            <img
                src={src}
                alt={alt}
                className={`${className || ''} transition-opacity duration-500 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                style={style}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                {...props}
            />
        </ClientOnly>
    );
};

export default SafeImage;

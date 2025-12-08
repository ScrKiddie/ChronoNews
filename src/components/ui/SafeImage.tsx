import React, { useEffect, useState } from 'react';

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

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, ...props }) => {
    return (
        <ClientOnly>
            <img src={src} alt={alt} {...props} />
        </ClientOnly>
    );
};

export default SafeImage;

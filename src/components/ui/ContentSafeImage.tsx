import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from 'primereact/skeleton';

interface ContentSafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

const ContentSafeImage: React.FC<ContentSafeImageProps> = ({
    src,
    alt,
    className,
    style,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [containerHeight, setContainerHeight] = useState<string | number | undefined>(undefined);
    const [isAnimating, setIsAnimating] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const attrWidth = props.width || style?.width;
    const attrHeight = props.height || style?.height;

    const getSafeStyleValue = (value: string | number | undefined) => {
        if (value === undefined || value === null) return undefined;
        if (typeof value === 'number') return `${value}px`;
        return !isNaN(Number(value)) ? `${value}px` : value;
    };

    const numWidth = typeof attrWidth === 'string' ? parseFloat(attrWidth) : (attrWidth as number);
    const numHeight =
        typeof attrHeight === 'string' ? parseFloat(attrHeight) : (attrHeight as number);

    const hasSpecificWidth = attrWidth !== undefined && attrWidth !== null;

    const handleImageLoad = () => {
        const img = imgRef.current;
        const container = containerRef.current;

        if (img && container) {
            const currentSkeletonHeight = container.offsetHeight;

            const targetHeight = (img.naturalHeight / img.naturalWidth) * container.offsetWidth;

            if (Math.abs(currentSkeletonHeight - targetHeight) < 5) {
                setContainerHeight('auto');
                setIsLoading(false);
                return;
            }

            setContainerHeight(`${currentSkeletonHeight}px`);
            setIsAnimating(true);

            requestAnimationFrame(() => {
                setContainerHeight(`${targetHeight}px`);

                setTimeout(() => {
                    setContainerHeight('auto');
                    setIsLoading(false);
                    setIsAnimating(false);
                }, 500);
            });
        } else {
            setIsLoading(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        ...style,
        position: 'relative',
        display: 'block',

        width: hasSpecificWidth ? getSafeStyleValue(attrWidth) : '100%',

        maxWidth: '100%',
        height: containerHeight,

        aspectRatio:
            isLoading && !containerHeight
                ? numWidth && numHeight && !String(attrWidth).includes('%')
                    ? `${numWidth} / ${numHeight}`
                    : '16 / 9'
                : 'auto',

        overflow: 'hidden',
    };

    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete) {
            handleImageLoad();
        }
    }, []);

    const imageClasses = [
        'block',
        'h-auto',
        'w-full',
        'transition-opacity duration-500',
        isLoading && !isAnimating ? 'opacity-0' : 'opacity-100',
    ].join(' ');

    return (
        <div
            ref={containerRef}
            className={`content-safe-image-wrapper transition-all duration-500 ease-in-out rounded-lg ${className || ''}`}
            style={containerStyle}
        >
            {isLoading && (
                <div className="absolute inset-0 z-10 w-full h-full">
                    <Skeleton
                        width="100%"
                        height="100%"
                        borderRadius="0"
                        className="w-full h-full"
                    />
                </div>
            )}

            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={imageClasses}
                onLoad={handleImageLoad}
                onError={() => setIsLoading(false)}
                {...props}
            />
        </div>
    );
};

export default ContentSafeImage;

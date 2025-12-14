import React from 'react';
import parse, { DOMNode, Element as HTMLElement, domToReact } from 'html-react-parser';
import ContentSafeImage from './ContentSafeImage';

interface SafeHtmlContentProps {
    content: string;
    className?: string;
}

const parseStyle = (styleString?: string): React.CSSProperties => {
    const styleObj: Record<string, string> = {};
    if (styleString) {
        styleString.split(';').forEach((styleRule) => {
            const rule = styleRule.trim();
            if (rule) {
                const [key, value] = rule.split(':').map((s) => s.trim());
                if (key && value) {
                    const camelKey = key.replace(/-./g, (x) => x[1].toUpperCase());
                    styleObj[camelKey] = value;
                }
            }
        });
    }
    return styleObj as React.CSSProperties;
};

const SafeHtmlContent: React.FC<SafeHtmlContentProps> = ({ content, className }) => {
    const options = {
        replace: (domNode: DOMNode) => {
            if ('name' in domNode && 'attribs' in domNode) {
                const element = domNode as HTMLElement;

                if (element.name === 'p') {
                    const hasImageChild = element.children.some(
                        (child) => 'name' in child && (child as HTMLElement).name === 'img'
                    );

                    const originalClass = element.attribs.class || '';
                    const parsedStyle = parseStyle(element.attribs.style);

                    if (hasImageChild) {
                        return (
                            <div className={`${originalClass}`} style={parsedStyle}>
                                {domToReact(element.children as DOMNode[], options)}
                            </div>
                        );
                    } else {
                        return (
                            <p className={`${originalClass}`} style={parsedStyle}>
                                {domToReact(element.children as DOMNode[], options)}
                            </p>
                        );
                    }
                }

                if (element.name === 'img') {
                    const { src, alt, class: imgClass, style, ...otherAttribs } = element.attribs;
                    const parsedStyle = parseStyle(style);

                    return (
                        <ContentSafeImage
                            src={src}
                            alt={alt || 'Content Image'}
                            className={`${imgClass || ''} max-w-full h-auto block`}
                            style={parsedStyle}
                            {...otherAttribs}
                        />
                    );
                }
            }
        },
    };

    return <div className={`text-gray-700 ${className || ''}`}>{parse(content, options)}</div>;
};

export default SafeHtmlContent;

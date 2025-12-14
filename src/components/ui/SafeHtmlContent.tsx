import React from 'react';
import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import ContentSafeImage from './ContentSafeImage';

interface SafeHtmlContentProps {
    content: string;
    className?: string;
}

const parseStyle = (styleString?: string): React.CSSProperties => {
    const styleObj: React.CSSProperties = {};
    if (styleString) {
        styleString.split(';').forEach((styleRule) => {
            const rule = styleRule.trim();
            if (rule) {
                const [key, value] = rule.split(':').map((s) => s.trim());
                if (key && value) {
                    const camelKey = key.replace(/-./g, (x) => x[1].toUpperCase());
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    styleObj[camelKey] = value;
                }
            }
        });
    }
    return styleObj;
};

const SafeHtmlContent: React.FC<SafeHtmlContentProps> = ({ content, className }) => {
    const options = {
        replace: (domNode: DOMNode) => {
            if (domNode instanceof Element) {
                if (domNode.name === 'p') {
                    const hasImageChild = domNode.children.some(
                        (child) => child instanceof Element && child.name === 'img'
                    );

                    const originalClass = domNode.attribs.class || '';
                    const parsedStyle = parseStyle(domNode.attribs.style);

                    if (hasImageChild) {
                        return (
                            <div className={`${originalClass}`} style={parsedStyle}>
                                {domToReact(domNode.children as DOMNode[], options)}
                            </div>
                        );
                    } else {
                        return (
                            <p className={`${originalClass}`} style={parsedStyle}>
                                {domToReact(domNode.children as DOMNode[], options)}
                            </p>
                        );
                    }
                }

                if (domNode.name === 'img') {
                    const { src, alt, class: imgClass, style, ...otherAttribs } = domNode.attribs;
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

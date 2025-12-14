/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Scope } from 'parchment';
import { ImageService } from '../services/imageService';
import { useToast } from './useToast';
import { showErrorToast } from '../utils/toastUtils';

const useQuillConfig = ({
    onUploadStateChange = () => {},
}: { onUploadStateChange?: (isLoading: boolean) => void } = {}) => {
    const [isClient, setIsClient] = useState(false);
    const toast = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const initializeQuill = async () => {
            const [Quill, ResizeModule] = await Promise.all([
                import('quill'),
                import('@botom/quill-resize-module'),
            ]);

            const ImageFormatAttributesList = ['id', 'height', 'width', 'style'];
            const allowedStyles = {
                display: ['inline', 'block'],
                float: ['left', 'right'],
                margin: [],
            };

            const BaseImageFormat = Quill.default.import('formats/image');

            // @ts-expect-error: intentionally overriding type requirement
            class ImageFormat extends BaseImageFormat {
                static create(value: any) {
                    const node = super.create(value);
                    if (typeof value === 'object' && value.src) {
                        node.setAttribute('src', value.src);
                        if (value.id) {
                            node.setAttribute('data-id', value.id);
                        }
                    }
                    return node;
                }

                static formats(domNode: any) {
                    const formats: any = {};
                    ImageFormatAttributesList.forEach((attribute) => {
                        if (domNode.hasAttribute(attribute)) {
                            formats[attribute] = domNode.getAttribute(attribute);
                        }
                    });
                    return formats;
                }

                static value(domNode: any) {
                    return {
                        src: domNode.getAttribute('src'),
                        id: domNode.getAttribute('data-id'),
                    };
                }

                format(name: any, value: any) {
                    if (ImageFormatAttributesList.includes(name)) {
                        if (name === 'style' && value) {
                            const styleEntries = value
                                .split(';')
                                .map((entry: any) => entry.trim())
                                .filter(Boolean);

                            const newStyles: any = {};

                            styleEntries.forEach((entry: any) => {
                                const [key, val] = entry.split(':').map((item: any) => item.trim());
                                if (
                                    (allowedStyles as any)[key] &&
                                    ((allowedStyles as any)[key].length === 0 ||
                                        (allowedStyles as any)[key].includes(val))
                                ) {
                                    newStyles[key] = val;
                                }
                            });

                            const styleString = Object.entries(newStyles)
                                .map(([key, val]) => `${key}: ${val}`)
                                .join('; ');
                            // @ts-expect-error: intentionally overriding type requirement
                            this.domNode.setAttribute('style', styleString);
                        } else if (value) {
                            // @ts-expect-error: intentionally overriding type requirement
                            this.domNode.setAttribute(name, value);
                        } else {
                            // @ts-expect-error: intentionally overriding type requirement
                            this.domNode.removeAttribute(name);
                        }
                    } else {
                        super.format(name, value);
                    }
                }
            }

            // @ts-expect-error: intentionally overriding type requirement
            Quill.default.register(ImageFormat, true);
            Quill.default.register('modules/resize', ResizeModule.default, true);
            const BlockEmbed = Quill.default.import('blots/block/embed');

            // @ts-expect-error: intentionally overriding type requirement
            class VideoBlot extends BlockEmbed {
                static create(value: any) {
                    const node = super.create(value);
                    node.setAttribute('contenteditable', 'false');
                    node.setAttribute('frameborder', '0');
                    node.setAttribute('allowfullscreen', true);
                    node.setAttribute('src', this.sanitize(value));
                    return node;
                }

                static sanitize(url: any) {
                    return url;
                }

                static formats(domNode: any) {
                    const formats: any = {};
                    const attrs = ['height', 'width', 'style'];

                    attrs.forEach((attr) => {
                        if (domNode.hasAttribute(attr)) {
                            formats[attr] = domNode.getAttribute(attr);
                        }
                    });

                    return formats;
                }

                format(name: any, value: any) {
                    const allowedStyles = {
                        display: ['inline', 'block'],
                        float: ['left', 'right', 'none'],
                        margin: [],
                        'max-width': [],
                        'max-height': [],
                    };

                    if (['height', 'width', 'style'].includes(name)) {
                        if (name === 'style' && value) {
                            const styleEntries = value
                                .split(';')
                                .map((entry: any) => entry.trim())
                                .filter(Boolean);

                            const newStyles: any = {};

                            styleEntries.forEach((entry: any) => {
                                const [key, val] = entry.split(':').map((item: any) => item.trim());
                                if (
                                    (allowedStyles as any)[key] &&
                                    ((allowedStyles as any)[key].length === 0 ||
                                        (allowedStyles as any)[key].includes(val))
                                ) {
                                    newStyles[key] = val;
                                }
                            });

                            const styleString = Object.entries(newStyles)
                                .map(([key, val]) => `${key}: ${val}`)
                                .join('; ');
                            // @ts-expect-error: intentionally overriding type requirement
                            this.domNode.setAttribute('style', styleString);
                        } else if (value) {
                            // @ts-expect-error: intentionally overriding type requirement
                            this.domNode.setAttribute(name, value);
                        } else {
                            // @ts-expect-error: intentionally overriding type requirement
                            this.domNode.removeAttribute(name);
                        }
                    } else {
                        super.format(name, value);
                    }
                }

                static value(domNode: any) {
                    return domNode.getAttribute('src');
                }
            }

            // @ts-expect-error: intentionally overriding type requirement
            VideoBlot.blotName = 'video';
            // @ts-expect-error: intentionally overriding type requirement
            VideoBlot.tagName = 'iframe';
            // @ts-expect-error: intentionally overriding type requirement
            VideoBlot.scope = Scope.BLOCK_BLOT;
            // @ts-expect-error: intentionally overriding type requirement
            Quill.default.register(VideoBlot, true);
        };

        initializeQuill();
    }, [isClient]);

    function imageHandler(this: { quill: any }) {
        if (!isClient) return;

        const quillInstance = this.quill;
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.png, .jpg, .jpeg, .jpe, .jfif, .jif, .jfi');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                await uploadImage(quillInstance, file);
            }
        };
    }

    const uploadImage = async (quillInstance: any, file: File) => {
        if (!isClient) return;

        const MAX_SIZE_MB = 10;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
        const MAX_DIMENSION = 16383;
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.jpe', '.jfif', '.jif', '.jfi'];
        const allowedContentTypes = ['image/png', 'image/jpeg', 'image/pjpeg', 'image/apng'];

        if (file.size > MAX_SIZE_BYTES) {
            showErrorToast(toast, `Ukuran file melebihi ${MAX_SIZE_MB}MB.`);
            return;
        }

        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        if (
            !allowedContentTypes.includes(file.type) ||
            !allowedExtensions.includes(fileExtension)
        ) {
            showErrorToast(toast, 'Tipe file tidak valid.');
            return;
        }

        try {
            const { width, height } = await new Promise<{
                width: number;
                height: number;
            }>((resolve, reject) => {
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);
                img.onload = () => {
                    resolve({ width: img.naturalWidth, height: img.naturalHeight });
                    URL.revokeObjectURL(objectUrl);
                };
                img.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error('Gagal membaca file gambar.'));
                };
                img.src = objectUrl;
            });

            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                showErrorToast(toast, `Dimensi gambar melebihi ${MAX_DIMENSION}x${MAX_DIMENSION}.`);
                return;
            }
        } catch (error: any) {
            showErrorToast(toast, error.message);
            return;
        }

        const range = quillInstance.getSelection(true);
        onUploadStateChange(true);

        try {
            const response = await ImageService.uploadImage(file);
            if (!response) {
                return;
            }
            const imageUrl = `${response.name}`;

            quillInstance.insertEmbed(
                range.index,
                'image',
                { src: imageUrl, id: String(response.id) },
                'user'
            );
            quillInstance.setSelection(range.index + 1, 'silent');
        } catch (error) {
            void error;
        } finally {
            onUploadStateChange(false);
        }
    };

    const getQuillModules = () => {
        if (!isClient) return {};

        return {
            clipboard: {
                matchers: [
                    [
                        'img',
                        (node: any, delta: any) => {
                            if (node.src && node.src.startsWith('data:image/')) {
                                return { ops: [] };
                            }
                            return delta;
                        },
                    ],
                    [
                        Node.ELEMENT_NODE,
                        (node: any, delta: any) => {
                            if (
                                node.tagName === 'IMG' &&
                                node.src &&
                                node.src.startsWith('data:')
                            ) {
                                return { ops: [] };
                            }
                            return delta;
                        },
                    ],
                ],
            },
            resize: {
                showSize: true,
                locale: {
                    altTip: 'Hold down the alt key to zoom',
                    floatLeft: 'Left',
                    floatRight: 'Right',
                    center: 'Mid',
                    restore: 'Reset',
                },
            },
        };
    };

    return { getQuillModules, uploadImage, imageHandler, isClient };
};

export default useQuillConfig;

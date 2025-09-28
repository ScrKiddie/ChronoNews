import {useEffect} from "react";
import Quill from "quill";
import {Scope} from "parchment";
import ResizeModule from "@botom/quill-resize-module";
import {ImageService} from "../services/imageService.tsx";
import {useAuth} from "./useAuth.tsx";
import {useToast} from "./useToast.tsx";
import {handleApiError, showErrorToast} from "../utils/toastHandler.tsx";

const useQuillConfig = ({ onUploadStateChange = () => {} }: { onUploadStateChange?: (isLoading: boolean) => void } = {}) => {
    const { token, logout } = useAuth();
    const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;
    const toast = useToast();

    useEffect(() => {
        const ImageFormatAttributesList = ["id", "height", "width", "style"];
        const allowedStyles = {
            display: ["inline", "block"],
            float: ["left", "right"],
            margin: [],
        };

        const BaseImageFormat = Quill.import("formats/image");

        // @ts-expect-error: intentionally overriding type requirement
        class ImageFormat extends BaseImageFormat {
            static create(value) {
                const node = super.create(value);
                if (typeof value === 'object' && value.src) {
                    node.setAttribute('src', value.src);
                    if (value.id) {
                        node.setAttribute('data-id', value.id);
                    }
                }
                return node;
            }
            static formats(domNode) {
                const formats = {};
                ImageFormatAttributesList.forEach((attribute) => {
                    if (domNode.hasAttribute(attribute)) {
                        formats[attribute] = domNode.getAttribute(attribute);
                    }
                });
                return formats;
            }
            
            static value(domNode) {
                return {
                    src: domNode.getAttribute('src'),
                    id: domNode.getAttribute('data-id'),
                };
            }

            format(name, value) {
                if (ImageFormatAttributesList.includes(name)) {
                    if (name === "style" && value) {
                        const styleEntries = value
                            .split(";")
                            .map((entry) => entry.trim())
                            .filter(Boolean);

                        const newStyles = {};

                        styleEntries.forEach((entry) => {
                            const [key, val] = entry.split(":").map((item) => item.trim());
                            if (
                                allowedStyles[key] &&
                                (allowedStyles[key].length === 0 || allowedStyles[key].includes(val))
                            ) {
                                newStyles[key] = val;
                            }
                        });

                        const styleString = Object.entries(newStyles)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join("; ");
                        // @ts-expect-error: intentionally overriding type requirement
                        this.domNode.setAttribute("style", styleString);
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
        Quill.register(ImageFormat, true); // `true` untuk menimpa blot bawaan
        Quill.register("modules/resize", ResizeModule, true);
        const BlockEmbed = Quill.import("blots/block/embed");

        // @ts-expect-error: intentionally overriding type requirement
        class VideoBlot extends BlockEmbed {
            static create(value) {
                const node = super.create(value);
                node.setAttribute("contenteditable", "false");
                node.setAttribute("frameborder", "0");
                node.setAttribute("allowfullscreen", true);
                node.setAttribute("src", this.sanitize(value));
                return node;
            }

            static sanitize(url) {
                return url;
            }

            static formats(domNode) {
                const formats = {};
                const attrs = ["height", "width", "style"];

                attrs.forEach((attr) => {
                    if (domNode.hasAttribute(attr)) {
                        formats[attr] = domNode.getAttribute(attr);
                    }
                });

                return formats;
            }

            format(name, value) {
                const allowedStyles = {
                    display: ["inline", "block"],
                    float: ["left", "right", "none"],
                    margin: [],
                    "max-width": [],
                    "max-height": [],
                };

                if (["height", "width", "style"].includes(name)) {
                    if (name === "style" && value) {
                        const styleEntries = value
                            .split(";")
                            .map((entry) => entry.trim())
                            .filter(Boolean);

                        const newStyles = {};

                        styleEntries.forEach((entry) => {
                            const [key, val] = entry.split(":").map((item) => item.trim());
                            if (
                                allowedStyles[key] &&
                                (allowedStyles[key].length === 0 || allowedStyles[key].includes(val))
                            ) {
                                newStyles[key] = val;
                            }
                        });

                        const styleString = Object.entries(newStyles)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join("; ");
                        // @ts-expect-error: intentionally overriding type requirement
                        this.domNode.setAttribute("style", styleString);
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

            static value(domNode) {
                return domNode.getAttribute("src");
            }
        }

        // @ts-expect-error: intentionally overriding type requirement
        VideoBlot.blotName = "video";
        // @ts-expect-error: intentionally overriding type requirement
        VideoBlot.tagName = "iframe";
        // @ts-expect-error: intentionally overriding type requirement
        VideoBlot.scope = Scope.BLOCK_BLOT;
        // @ts-expect-error: intentionally overriding type requirement
        Quill.register(VideoBlot, true);

    }, []);

    function imageHandler(this: { quill: Quill }) {
        const quillInstance = this.quill;
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                await uploadImage(quillInstance, file);
            }
        };
    };

    const uploadImage = async (quillInstance: Quill, file: File) => {
        const MAX_SIZE_MB = 10;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
        const MAX_DIMENSION = 16383;
        const allowedExtensions = [".png", ".jpg", ".jpeg", ".jpe", ".jfif", ".jif", ".jfi"];
        const allowedContentTypes = ["image/png", "image/jpeg", "image/pjpeg", "image/apng"];

        if (file.size > MAX_SIZE_BYTES) {
            showErrorToast(toast, `Ukuran file melebihi ${MAX_SIZE_MB}MB.`);
            return;
        }

        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        if (!allowedContentTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
            showErrorToast(toast, "Tipe file tidak valid.");
            return;
        }

        try {
            const { width, height } = await new Promise<{width: number, height: number}>((resolve, reject) => {
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);
                img.onload = () => {
                    resolve({ width: img.naturalWidth, height: img.naturalHeight });
                    URL.revokeObjectURL(objectUrl);
                };
                img.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error("Gagal membaca file gambar."));
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
            const response = await ImageService.uploadImage(file, token as string);
            if (!response) {
                throw new Error("Upload response was empty.");
            }
            const imageUrl = `${apiUri}/post_picture/${response.name}`;

            quillInstance.insertEmbed(range.index, 'image', { src: imageUrl, id: String(response.id) }, Quill.sources.USER);
            quillInstance.setSelection(range.index + 1, Quill.sources.SILENT);
        } catch (error) {
            handleApiError(error, toast, logout);
        } finally {
            onUploadStateChange(false);
        }
    };

    const getQuillModules = () => ({
        clipboard: {
            matchers: [
                ['img', (node: any, delta: any) => {
                    if (node.src.startsWith('data:image/')) {
                        return { ops: [] };
                    }
                    return delta;
                }],
            ],
        },
        resize: {
            showSize: true,
            locale: {
                altTip: "Hold down the alt key to zoom",
                floatLeft: "Left",
                floatRight: "Right",
                center: "Mid",
                restore: "Reset",
            },
        },
    });


    return { getQuillModules, uploadImage, imageHandler };
};

export default useQuillConfig;

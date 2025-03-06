import {useEffect} from "react";
import Quill from "quill";
import {Scope} from "parchment";
import ResizeModule from "@botom/quill-resize-module";

const useQuillConfig = () => {
    useEffect(() => {
        const ImageFormatAttributesList = ["height", "width", "style"];
        const allowedStyles = {
            display: ["inline", "block"],
            float: ["left", "right"],
            margin: [],
        };

        const BaseImageFormat = Quill.import("formats/image");

        class ImageFormat extends BaseImageFormat {
            static formats(domNode) {
                const formats = {};
                ImageFormatAttributesList.forEach((attribute) => {
                    if (domNode.hasAttribute(attribute)) {
                        formats[attribute] = domNode.getAttribute(attribute);
                    }
                });
                return formats;
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

                        this.domNode.setAttribute("style", styleString);
                    } else if (value) {
                        this.domNode.setAttribute(name, value);
                    } else {
                        this.domNode.removeAttribute(name);
                    }
                } else {
                    super.format(name, value);
                }
            }
        }

        Quill.register(ImageFormat, true);
        Quill.register("modules/resize", ResizeModule);

        const BlockEmbed = Quill.import("blots/block/embed");

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

                        this.domNode.setAttribute("style", styleString);
                    } else if (value) {
                        this.domNode.setAttribute(name, value);
                    } else {
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

        VideoBlot.blotName = "video";
        VideoBlot.tagName = "iframe";
        VideoBlot.scope = Scope.BLOCK_BLOT;

        Quill.register(VideoBlot);
    }, []);
};

export default useQuillConfig;

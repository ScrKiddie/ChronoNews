import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Editor} from "primereact/editor";
import {Dropdown} from "primereact/dropdown";
import useQuillConfig from "../hooks/useQuillConfig.tsx";
import thumbnail from "../../public/thumbnail.svg";
import React, {useCallback, useEffect, useRef} from "react";
import {InputTextarea} from "primereact/inputtextarea";

const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;
const PostModal = ({
                       visible,
                       onClose,
                       data,
                       setData,
                       croppedImage,
                       fileInputRef,
                       errors,
                       submitLoading,
                       handleSubmit,
                       handleClickUploadButton,
                       handleImageChange,
                       categoryOptions = [],
                       userOptions = [],
                       isEditMode,
                       role = "admin",
                       editorContent
                   }) => {

    useQuillConfig();

    useEffect(() => {
        if (data?.content) {
            editorContent.current = data.content;
        }
    }, [data?.content]);


    const handleTextChange = useCallback((htmlValue) => {
        const isEditorFocused = document.activeElement.closest(".ql-editor") !== null;

        editorContent.current = htmlValue;
        setData((prev) => ({ ...prev, content: htmlValue }));

        if (!isEditorFocused) {
            setTimeout(() => {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
            }, 0);
        }
    }, []);

    const handleFormSubmit = (e) => {
        handleSubmit(e, editorContent.current)
    }

    return (
        <Dialog
            header={
                <h1 className="font-medium m-0 text-xl">
                    {isEditMode
                        ? "Edit Berita"
                        : "Buat Berita Baru"}
                </h1>
            }
            visible={visible}
            maximizable
            className="w-[94%] md:w-[50%]"
            onHide={onClose}
        >
            <form onSubmit={handleFormSubmit} className="w-full">
                <div className="flex flex-col p-4 gap-4">
                    <div className="w-full">
                        <label htmlFor="name" className="block mb-1 font-medium">
                            Judul
                        </label>
                        <InputText
                            id="title"
                            className="w-full"
                            invalid={errors.title}
                            placeholder="Masukkan Judul"
                            value={data?.title || ""}
                            onChange={(e) => {
                                setData((prev) => ({...prev, title: e.target.value}));
                                errors.title = false;
                            }}
                        />
                        {errors.title && <small className="p-error">{errors.title}</small>}
                    </div>
                    {
                        role == "admin" ? (
                            <div className="w-full">
                                <label htmlFor="userID" className="block mb-1 font-medium">
                                    Penulis
                                </label>

                                <Dropdown
                                    id="userID"
                                    className="w-full"
                                    filter
                                    invalid={!!errors.userID}
                                    placeholder="Posting Sebagai Diri Sendiri"
                                    value={data?.userID || null}
                                    options={userOptions}
                                    onChange={(e) => {
                                        setData((prev) => ({...prev, userID: e.value}));
                                        errors.userID = false;
                                    }}
                                />
                                {errors.userID && <small className="p-error">{errors.userID}</small>}
                            </div>
                        ) : ""
                    }


                    <div className="w-full flex flex-col ">
                        <label htmlFor="name" className="block mb-1 font-medium">
                            Thumbnail
                        </label>

                        <div style={{aspectRatio: "16/9"}} className={`relative rounded-md bg-[#f59e0b]  w-full`}>
                            <img src={
                                croppedImage ||
                                (data?.thumbnail
                                    ? `${apiUri}/post_picture/${data?.thumbnail}`
                                    : `${thumbnail}`)
                            } className="h-full  w-full rounded-md  border-none z-10"
                                 style={{border: "1px solid #d1d5db"}}/>
                            <Button
                                onClick={handleClickUploadButton}
                                type="button"
                                text
                                severity="secondary"
                                className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-black/20 transition"
                            />
                        </div>

                        <input
                            ref={fileInputRef}
                            id="file-upload"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="email" className="block mb-1 font-medium">
                            Kategori
                        </label>

                        <Dropdown
                            id="categoryID"
                            className="w-full"
                            filter
                            invalid={!!errors.categoryID}
                            placeholder="Pilih Kategori"
                            value={data?.categoryID || null}
                            options={categoryOptions}
                            onChange={(e) => {
                                setData((prev) => ({...prev, categoryID: e.value}));
                                errors.categoryID = false;
                            }}
                        />
                        {errors.categoryID && <small className="p-error">{errors.categoryID}</small>}
                    </div>

                    <div className="w-full">
                        <label htmlFor="email" className="block mb-1 font-medium">
                            Ringkasan
                        </label>
                        <InputTextarea
                            autoResize={true}
                            id="summary"
                            className="w-full"
                            invalid={!!errors.summary}
                            placeholder="Masukkan Ringkasan"
                            value={data?.summary || ""}
                            onChange={(e) => {
                                setData((prev) => ({...prev, summary: e.target.value}));
                                errors.summary = false;
                            }}
                        />
                        {errors.summary && <small className="p-error">{errors.summary}</small>}
                    </div>


                    <div className="w-full">
                        <label htmlFor="content" className="block mb-1 font-medium">
                            Konten
                        </label>
                        <Editor
                            id={`content`}
                            modules={{
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
                            }}
                            value={editorContent?.current || data?.content || ""}
                            onTextChange={(e) => handleTextChange(e.htmlValue || "")}
                            placeholder="Masukkan Konten"
                            headerTemplate={
                                <span className="ql-formats">
                                <select className="ql-size" aria-label="Font Size">
                                     <option value="small" selected>Small</option>
                                     <option value="">Normal</option>
                                     <option value="large">Large</option>
                                     <option value="huge">Huge</option>
                                 </select>
                                <select className="ql-header" aria-label="Heading">
                                    <option value="1">Heading 1</option>
                                    <option value="2">Heading 2</option>
                                    <option value="3">Heading 3</option>
                                    <option value="4">Heading 4</option>
                                    <option value="5">Heading 5</option>
                                    <option value="6">Heading 6</option>
                                    <option value="">Normal</option>
                                </select>
                                <button className="ql-bold" aria-label="Bold"></button>
                                <button className="ql-italic" aria-label="Italic"></button>
                                <button className="ql-underline" aria-label="Underline"></button>
                                <button className="ql-strike" aria-label="Strike-through"></button>
                                <button className="ql-blockquote" aria-label="Blockquote"></button>
                                <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                                <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
                                <button className="ql-indent" value="+1" aria-label="Indent"></button>
                                <button className="ql-indent" value="-1" aria-label="Outdent"></button>
                                <button className="ql-align" value="" aria-label="Left Align"></button>
                                <button className="ql-align" value="center" aria-label="Center Align"></button>
                                <button className="ql-align" value="right" aria-label="Right Align"></button>
                                <button className="ql-align" value="justify" aria-label="Justify"></button>
                                <button className="ql-link" aria-label="Link"></button>
                                <button className="ql-image" aria-label="Insert Image"></button>
                                            <select className="ql-color" aria-label="Text Color"></select>
                                <select className="ql-background" aria-label="Background Color"></select>
                                <button className="ql-script" value="sub" aria-label="Subscript"></button>
                                <button className="ql-script" value="super" aria-label="Superscript"></button>
                                <button className="ql-clean" aria-label="Clear Formatting"></button>
                            </span>
                            }
                        />
                        {errors.content && <small className="p-error">{errors.content}</small>}
                    </div>

                    <Button
                        disabled={submitLoading}
                        className="w-full flex items-center justify-center font-normal"
                        type="submit"
                    >
                        {submitLoading ? (
                            <i className="pi pi-spin pi-spinner text-[24px]" style={{color: "#475569"}}></i>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};

export default PostModal;

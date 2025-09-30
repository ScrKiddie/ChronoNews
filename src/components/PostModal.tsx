import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {Editor} from "primereact/editor";
import {Dropdown} from "primereact/dropdown";
import useQuillConfig from "../hooks/useQuillConfig.tsx";
import thumbnail from "../assets/thumbnail.svg";
import {useCallback, useEffect, useState} from "react";
import {InputTextarea} from "primereact/inputtextarea";
import InputGroup from "./InputGroup.tsx";
import {useSidebar} from "../hooks/useSidebar.tsx";
import {Menu} from "primereact/menu";
import {useAuth} from "../hooks/useAuth.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

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
                       categoryOptions,
                       userOptions,
                       isEditMode,
                       role,
                       editorContent,
                       setThumbnail,
                       setCroppedImage
                   }) => {

    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const { getQuillModules, uploadImage, imageHandler } = useQuillConfig({
        onUploadStateChange: setIsUploadingImage
    });

    const handleEditorLoad = useCallback((quillInstance: any) => {
        if (quillInstance) {
            const toolbar = quillInstance.getModule('toolbar');
            if (toolbar && toolbar.container) {
                const imageButton = toolbar.container.querySelector('.ql-image');
                if (imageButton) {
                    imageButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        imageHandler.call({ quill: quillInstance });
                    }, true);
                }
            }
            quillInstance.root.addEventListener('drop', (e: DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer?.files.length) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        uploadImage(quillInstance, file);
                    }
                }
            });

            quillInstance.root.addEventListener('paste', (e: ClipboardEvent) => {
                if (e.clipboardData?.files.length) {
                    const file = e.clipboardData.files[0];
                    if (file.type.startsWith('image/')) {
                        e.preventDefault();
                        uploadImage(quillInstance, file);
                    }
                }
            });
        }
    }, [uploadImage, imageHandler]);

    useEffect(() => {
        if (data?.content) {
            editorContent.current = data.content;
        }
    }, [data?.content]);

    const {sub} = useAuth()

    const handleTextChange = useCallback((htmlValue) => {
        if (htmlValue.length > 65535) {
            if(errors) errors.content = "Konten terlalu panjang";
        } else {
            if(errors) errors.content = false;
        }
        editorContent.current = htmlValue;
    }, [errors]);

    const processContentForSubmit = (htmlContent: string | null | undefined) => {
        if (!htmlContent) return "";

        const contentToProcess = String(htmlContent);

        const parser = new DOMParser();
        const doc = parser.parseFromString(contentToProcess, 'text/html');
        const images = doc.querySelectorAll('img');
        images.forEach(img => img.removeAttribute('src'));
        return doc.body.innerHTML;
    };

    const handleFormSubmit = (e) => {
        handleSubmit(e, processContentForSubmit(editorContent.current))
    }

    const {
        isMenuVisible,
        setIsMenuVisible,
        toggleMenuVisibility,
        key,
        buttonRef,
        menuContainerRef,
    } = useSidebar();

    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const items:any = [];
        items.push({
            label: "Ganti",
            icon: <i className="pi pi-image pr-3" />,
            command() {
                setIsMenuVisible(false);
                handleClickUploadButton();
            },
        });

        if (data?.thumbnail || croppedImage) {
            items.push({
                label: "Hapus",
                icon: <i className="pi pi-trash pr-3" />,
                command() {
                    setIsMenuVisible(false);
                    if(setData){
                        setData(prev => ({...prev, thumbnail: ""}))
                        setData(prev => ({...prev, deleteThumbnail: true}))
                    }
                    if(setThumbnail){
                        setThumbnail("")
                    }
                    if(setCroppedImage){
                        setCroppedImage("")
                    }
                },
            });
        }

        setMenuItems(items);
    }, [data?.thumbnail, croppedImage, handleClickUploadButton]);

    return (
        <Dialog
            closable={!submitLoading}
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
                        <InputGroup
                            label="Judul"
                            data={data?.title}
                            error={errors.title}
                            setData={(e) => {setData(prev => ({...prev, title: e}))}}
                            setError={(e) => {errors.title = e}}
                        />
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
                                    value={data?.userID === sub ? 0 : data?.userID || 0 }
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
                                onClick={
                                    toggleMenuVisibility
                                }
                                ref={buttonRef}
                                type="button"
                                text
                                severity="secondary"
                                className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-black/20 transition"
                            />
                            <div ref={menuContainerRef}>
                                <Menu
                                    key={key}
                                    className={`${isMenuVisible ? "visible" : "hidden"} normal text-md w-fit shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 menu-news`}
                                    model={menuItems}
                                />
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            id="file-upload"
                            type="file"
                            accept=".png, .jpg, .jpeg, .jpe, .jfif, .jif, .jfi"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <div className="w-full">
                        <InputGroup
                            type={"dropdown"}
                            options={categoryOptions}
                            label="Kategori"
                            data={data?.categoryID}
                            error={errors.categoryID}
                            setData={(e)=>{ setData(prev => ({ ...prev, categoryID: e }));}}
                            setError={(e)=>{ errors.categoryID=e;}}
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="summary"
                               className={`block mb-1 font-medium  ${errors.summary ? "p-error" : "text-[#48525f]"}`}>Ringkasan</label>
                        <InputTextarea
                            autoResize={true}
                            id="summary"
                            className="w-full h-fit"
                            invalid={!!errors.summary}
                            value={data?.summary || ""}
                            onChange={(e) => {
                                setData((prev) => ({...prev, summary: e.target.value}));
                                errors.summary = false;
                            }}
                        />
                        {errors.summary && <small className="p-error mt-[-5px]">{errors.summary}</small>}
                    </div>


                    <div className="w-full ">
                        <label htmlFor="content" className="block mb-1 font-medium">
                            Konten
                        </label>
                        <div className={`w-full h-fit relative`}>
                            {isUploadingImage && (
                                <div className="loading-container">
                                    <i className="pi pi-spin pi-spinner text-[3rem]"
                                       style={{color: "#64748b", animationDuration: "1s"}}></i>
                                    <span className="mt-2 text-slate-600">Mengunggah gambar...</span>
                                </div>


                            )}
                            <Editor
                                readOnly={isUploadingImage}
                                onLoad={handleEditorLoad}
                                id={`content`}
                                modules={getQuillModules()}
                                value={editorContent?.current || data?.content || ""}
                                onTextChange={(e) => handleTextChange(e.htmlValue || "")}

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
                        </div>
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

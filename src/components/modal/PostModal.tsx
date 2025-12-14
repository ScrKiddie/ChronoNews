import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import useQuillConfig from '../../hooks/useQuillConfig';
import React, { useCallback, useState, useEffect, useMemo, memo, useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import InputGroup from '../ui/InputGroup.tsx';
import { useSidebar } from '../../hooks/useSidebar.ts';
import { Menu } from 'primereact/menu';
import { useAuth } from '../../hooks/useAuth';
import { DropdownOption, PostFormData, PostFormErrors } from '../../types/post.ts';
import { MenuItem } from 'primereact/menuitem';
import Quill from 'quill';
import defaultThumbnail from '../../../public/thumbnail.svg';

interface CustomEditorChangeEvent {
    htmlValue: string | null;
    textValue: string;
    delta: unknown;
    source: string;
}

interface IsolatedEditorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modules: any;
    headerTemplate?: React.ReactNode;
    onTextChange: (e: CustomEditorChangeEvent) => void;
    onLoad: (quill: Quill) => void;
    readOnly: boolean;
    editorId: string;
    initialContent: string;
}

const IsolatedEditor = memo(
    ({
        modules,
        headerTemplate,
        onTextChange,
        onLoad,
        readOnly,
        editorId,
        initialContent,
    }: IsolatedEditorProps) => {
        const hasInitialized = useRef(false);

        const handleLoad = (quill: Quill) => {
            if (quill && !hasInitialized.current) {
                if (initialContent) {
                    quill.clipboard.dangerouslyPasteHTML(initialContent);
                }

                quill.blur();

                hasInitialized.current = true;

                if (onLoad) onLoad(quill);
            }
        };

        return (
            <Editor
                id={editorId}
                readOnly={readOnly}
                onLoad={handleLoad}
                modules={modules}
                headerTemplate={headerTemplate}
                onTextChange={onTextChange}
            />
        );
    },
    (prev, next) => {
        return (
            prev.readOnly === next.readOnly &&
            prev.modules === next.modules &&
            prev.editorId === next.editorId &&
            prev.headerTemplate === next.headerTemplate
        );
    }
);

export interface PostModalProps {
    visible: boolean;
    onClose: () => void;
    data: PostFormData;
    setData: React.Dispatch<React.SetStateAction<PostFormData>>;
    croppedImage: string | null;
    fileInputRef: React.RefObject<HTMLInputElement>;
    errors: PostFormErrors;
    submitLoading: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    handleClickUploadButton: () => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    categoryOptions: DropdownOption[];
    userOptions: DropdownOption[];
    isEditMode: boolean;
    role: string;
    editorContentRef: React.MutableRefObject<string>;
    setThumbnail: React.Dispatch<React.SetStateAction<File | null>>;
    setCroppedImage: React.Dispatch<React.SetStateAction<string | null>>;
}

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
    editorContentRef,
    setThumbnail,
    setCroppedImage,
}: PostModalProps) => {
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const { getQuillModules, uploadImage, imageHandler } = useQuillConfig({
        onUploadStateChange: setIsUploadingImage,
    });
    const { sub } = useAuth();

    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                if (titleInputRef.current) {
                    titleInputRef.current.focus();
                }
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const handleEditorChange = useCallback(
        (e: CustomEditorChangeEvent) => {
            editorContentRef.current = e.htmlValue || '';
        },
        [editorContentRef]
    );

    const handleEditorLoad = useCallback(
        (quillInstance: Quill) => {
            if (quillInstance) {
                const toolbar = quillInstance.getModule('toolbar') as {
                    container: HTMLElement;
                } | null;
                if (toolbar && toolbar.container) {
                    const imageButton = toolbar.container.querySelector('.ql-image');
                    if (imageButton) {
                        imageButton.addEventListener(
                            'click',
                            (e) => {
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                imageHandler.call({ quill: quillInstance });
                            },
                            true
                        );
                    }
                }
                quillInstance.root.addEventListener(
                    'drop',
                    async (e: DragEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const files = e.dataTransfer?.files;
                        if (files && files.length > 0) {
                            const file = files[0];
                            if (file.type.startsWith('image/')) {
                                await uploadImage(quillInstance, file);
                            }
                        }
                    },
                    true
                );
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
        },
        [uploadImage, imageHandler]
    );

    const quillModules = getQuillModules();

    const headerTemplate = useMemo(
        () => (
            <span className="ql-formats">
                <select className="ql-size" aria-label="Font Size">
                    <option value="small">Small</option>
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
                <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
                <button className="ql-link" aria-label="Link"></button>
                <button className="ql-image" aria-label="Insert Image"></button>
                <button className="ql-clean" aria-label="Clear Formatting"></button>
            </span>
        ),
        []
    );

    const {
        isMenuVisible,
        setIsMenuVisible,
        toggleMenuVisibility,
        key: menuKey,
        buttonRef,
        menuContainerRef,
    } = useSidebar();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        const items: MenuItem[] = [];
        items.push({
            label: 'Ganti',
            icon: <i className="pi pi-image pr-3" />,
            command() {
                setIsMenuVisible(false);
                handleClickUploadButton();
            },
        });
        if (data?.thumbnail || croppedImage) {
            items.push({
                label: 'Hapus',
                icon: <i className="pi pi-trash pr-3" />,
                command() {
                    setIsMenuVisible(false);
                    if (setData) {
                        setData((prev) => ({
                            ...prev,
                            thumbnail: '',
                            deleteThumbnail: true,
                        }));
                    }
                    if (setThumbnail) setThumbnail(null);
                    if (setCroppedImage) setCroppedImage(null);
                },
            });
        }
        setMenuItems(items);
    }, [
        data?.thumbnail,
        croppedImage,
        handleClickUploadButton,
        setData,
        setThumbnail,
        setCroppedImage,
        setIsMenuVisible,
    ]);

    const getThumbnailSource = () => {
        if (croppedImage) return croppedImage;
        if (data?.thumbnail && typeof data.thumbnail === 'string' && data.thumbnail.trim() !== '') {
            return `${data.thumbnail}`;
        }
        return defaultThumbnail;
    };

    const editorKey = isEditMode ? `edit-${data.userID}-${visible}` : `create-${visible}`;

    const MemoizedEditorComponent = useMemo(() => {
        return (
            <IsolatedEditor
                key={editorKey}
                editorId="content"
                readOnly={isUploadingImage}
                onLoad={handleEditorLoad}
                modules={quillModules}
                headerTemplate={headerTemplate}
                initialContent={editorContentRef.current}
                onTextChange={handleEditorChange}
            />
        );
    }, [
        editorKey,
        isUploadingImage,
        quillModules,
        headerTemplate,
        handleEditorLoad,
        handleEditorChange,
        editorContentRef,
    ]);

    return (
        <Dialog
            closable={!submitLoading && !isUploadingImage}
            header={
                <h1 className="font-medium m-0 text-xl">
                    {isEditMode ? 'Edit Berita' : 'Buat Berita Baru'}
                </h1>
            }
            visible={visible}
            maximizable
            className="w-[94%] md:w-[50%]"
            onHide={onClose}
            focusOnShow={false}
        >
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col p-4 gap-4">
                    <div className="w-full">
                        <InputGroup
                            type="text"
                            label="Judul"
                            data={data?.title || ''}
                            setData={(value) => {
                                setData((prev) => ({ ...prev, title: value }));
                                if (errors.title) errors.title = undefined;
                            }}
                            error={errors.title}
                            setError={(error) => {
                                if (error) errors.title = error;
                            }}
                        />
                    </div>

                    {role == 'admin' ? (
                        <div className="w-full">
                            <label htmlFor="userID" className="block mb-1 font-medium">
                                Penulis
                            </label>
                            <Dropdown
                                id="userID"
                                className="w-full"
                                filter
                                invalid={!!errors.userID}
                                value={data?.userID === sub ? 0 : data?.userID || 0}
                                options={userOptions}
                                onChange={(e) => {
                                    setData((prev) => ({ ...prev, userID: e.value }));
                                    errors.userID = undefined;
                                }}
                            />
                            {errors.userID && <small className="p-error">{errors.userID}</small>}
                        </div>
                    ) : (
                        ''
                    )}

                    <div className="w-full flex flex-col ">
                        <label htmlFor="name" className="block mb-1 font-medium">
                            Thumbnail
                        </label>
                        <div
                            style={{ aspectRatio: '16/9' }}
                            className={`relative rounded-md w-full overflow-hidden`}
                        >
                            <img
                                src={getThumbnailSource()}
                                className="h-full w-full object-cover rounded-md border-none z-10"
                                style={{ border: '1px solid #d1d5db' }}
                                alt="Thumbnail"
                                onError={(e) => {
                                    e.currentTarget.src = defaultThumbnail;
                                }}
                            />
                            <Button
                                onClick={toggleMenuVisibility}
                                ref={buttonRef}
                                type="button"
                                text
                                severity="secondary"
                                className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-black/20 transition"
                            />
                            <div ref={menuContainerRef}>
                                <Menu
                                    key={menuKey}
                                    className={`${isMenuVisible ? 'visible' : 'hidden'} normal text-md w-fit shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 menu-news`}
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
                            type={'dropdown'}
                            options={categoryOptions}
                            label="Kategori"
                            data={data?.categoryID}
                            error={errors.categoryID}
                            setData={(e) => {
                                setData((prev) => ({ ...prev, categoryID: e }));
                            }}
                            setError={(e) => {
                                errors.categoryID = e;
                            }}
                        />
                    </div>

                    <div className="w-full">
                        <label
                            htmlFor="summary"
                            className={`block mb-1 font-medium ${errors.summary ? 'p-error' : 'text-[#48525f]'}`}
                        >
                            Ringkasan
                        </label>
                        <InputTextarea
                            autoResize={true}
                            id="summary"
                            className="w-full h-fit"
                            invalid={!!errors.summary}
                            value={data?.summary || ''}
                            onChange={(e) => {
                                setData((prev) => ({ ...prev, summary: e.target.value }));
                                errors.summary = undefined;
                            }}
                        />
                        {errors.summary && <small className="p-error">{errors.summary}</small>}
                    </div>

                    <div className="w-full ">
                        <label htmlFor="content" className="block mb-1 font-medium">
                            Konten
                        </label>
                        <div className={`w-full h-fit relative`}>
                            {isUploadingImage && (
                                <div className="loading-container">
                                    <i
                                        className="pi pi-spin pi-spinner text-[3rem]"
                                        style={{ color: '#64748b', animationDuration: '1s' }}
                                    ></i>
                                </div>
                            )}

                            {MemoizedEditorComponent}
                        </div>
                        {errors.content && <small className="p-error">{errors.content}</small>}
                    </div>

                    <Button
                        disabled={submitLoading || isUploadingImage}
                        className="w-full flex items-center justify-center font-normal"
                        type="submit"
                    >
                        {submitLoading || isUploadingImage ? (
                            <i
                                className="pi pi-spin pi-spinner text-[24px]"
                                style={{ color: '#475569' }}
                            ></i>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};

export default PostModal;

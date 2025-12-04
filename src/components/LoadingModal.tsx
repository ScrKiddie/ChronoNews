interface LoadingModalProps {
    modalLoading: boolean;
}

const LoadingModal = ({modalLoading}: LoadingModalProps) => {
    return (
        <div
            className={`flex items-center justify-center p-dialog-mask p-dialog-center p-component-overlay p-component-overlay-enter ${modalLoading ? "block" : "hidden"}`}
            data-pc-section="mask"
            style={{
                height: "100%",
                width: "100%",
                left: 0,
                top: 0,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <i
                className="pi pi-spin pi-spinner text-[10vh]"
                style={{color: "#f59e0b", animationDuration: "1s"}}
            ></i>
        </div>
    );
};

export default LoadingModal;

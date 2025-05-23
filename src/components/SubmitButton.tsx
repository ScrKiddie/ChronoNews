import {Button} from "primereact/button";

const SubmitButton = ({loading, tokenCaptcha="", captchaMode=false}) => {
    return (
        <Button
            className="w-full flex items-center justify-center font-normal"
            type="submit"
            disabled={loading || (captchaMode && tokenCaptcha == "")}
        >
            {loading ? <i className="pi pi-spin pi-spinner text-[24px]"
                          style={{color: "#475569"}}></i> : "Submit"}
        </Button>
    )
}
export default SubmitButton
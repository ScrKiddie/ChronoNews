import {Button} from "primereact/button";
import React from "react";

interface SubmitButtonProps {
    loading: boolean;
    tokenCaptcha?: string;
    captchaMode?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({loading, tokenCaptcha="", captchaMode=false}) => {
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
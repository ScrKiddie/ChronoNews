import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Dropdown} from "primereact/dropdown";

const InputGroup = ({
                        type = "text", label = "", data = "", setData = (a) => {
        return a
    }, error, setError = (a) => {
        return a
    }, tip = "", options=  [] as { label: string; value: string }[]
                    }) => {
    return (
        <>
            <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}
                   className={`block mb-1 font-medium  ${error ? "p-error" : "text-[#48525f]"}`}>{label}</label>
            {type == "text" && <InputText
                id={label.replace(/\s+/g, '').toLowerCase()}
                className={`w-full`}
                invalid={error}
                value={data}
                onChange={(e) => {
                    setData(e.target.value);
                    setError("");
                }}

            />}
            {type == "password" && <Password
                id={label.replace(/\s+/g, '').toLowerCase()}
                className={`w-full`}
                invalid={error}
                feedback={false}
                toggleMask
                value={data}
                onChange={(e) => {
                    setData(e.target.value);
                    setError("");
                }}
            />}
            {type == "dropdown" && <Dropdown
                id={label.replace(/\s+/g, '').toLowerCase()}
                className="w-full"
                options={options}
                value={data}
                onChange={(e) => {
                    setData(e.target.value);
                    setError("");
                }}

                invalid={error}
            />}
            {error && <small className="p-error">{error}</small>}
            {!error && tip != "" && <small className="text-gray-500">{tip}</small>}
        </>
    )
}

export default InputGroup
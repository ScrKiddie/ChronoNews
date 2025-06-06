import {useState, useEffect, useRef} from "react";
import {UserService} from "../services/userService.tsx";
import {useToast} from "./useToast.tsx";
import {useAuth} from "./useAuth.tsx";
import { useAbort } from "./useAbort";
import {handleApiErrorWithRetry} from "../utils/toastHandler.tsx";

const useSearchUser = () => {
    const toastRef = useToast();
    const {token,logout} = useAuth();
    const [data, setData] = useState([]);
    const [searchParams, setSearchParams] = useState({name: "", phoneNumber: "", email: "", role: ""});
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [totalItem, setTotalItem] = useState(0);
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);
    const [visibleLoadingConnection, setVisibleLoadingConnection] = useState(false);
    const prevSearchParams = useRef(searchParams);
    const { abortController, setAbortController } = useAbort();

    useEffect(() => {
        if (JSON.stringify(prevSearchParams.current) !== JSON.stringify(searchParams)) {
            prevSearchParams.current = searchParams;
            if (page != 1){
                setPage(1)
            }else {
                fetchData()
            }
        } else {
            fetchData();
        }
    }, [page, searchParams, size]);

    const fetchData = async (reset = false) => {
        if (abortController) {
            abortController.abort();
        }

        const newAbortController = new AbortController();
        setAbortController(newAbortController);

        setVisibleConnectionError(false);
        setVisibleLoadingConnection(true);
        try {
            const filters = {
                name: searchParams.name,
                phoneNumber: searchParams.phoneNumber,
                email: searchParams.email,
                role: searchParams.role,
                page: reset ? 1 : page.toString(),
                size: size.toString(),
            };

            const response = await UserService.searchUser(token, filters, newAbortController.signal);

            if (response && response.data) {
                setData(response.data);
                setTotalItem(response.pagination.totalItem);
            }
        } catch (error) {
            handleApiErrorWithRetry(error,toastRef,logout,setVisibleConnectionError)
        }
        setVisibleLoadingConnection(false);
    };


    return {
        data,
        searchParams,
        setSearchParams,
        page,
        setPage,
        size,
        setSize,
        totalItem,
        fetchData,
        visibleConnectionError,
        visibleLoadingConnection,
    };
};

export default useSearchUser;

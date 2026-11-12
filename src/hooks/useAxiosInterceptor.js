import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { api } from "../config/api.config";
import { cerrarSesion } from "../features/auth.slice";
import { guardarCampanias } from "../features/campanias.slice";

export const useAxiosInterceptor = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("usuario");
                    dispatch(cerrarSesion());
                    dispatch(guardarCampanias([]));
                    navigate("/", { replace: true });
                }
                return Promise.reject(error);
            }
        );

        return () => api.interceptors.response.eject(interceptor);
    }, [navigate, dispatch]);
};
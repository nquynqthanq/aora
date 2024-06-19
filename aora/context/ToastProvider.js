import React, { createContext, useContext, useRef, useState } from 'react';
import CustomToast from '../components/CustomToast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toastProps, setToastProps] = useState({ title: '', message: '', isVisible: false });
    const showToast = (title, message) => {
        setToastProps({ title, message, isVisible: true });
        setTimeout(() => setToastProps({ title: '', message: '', isVisible: false }), 2500);
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <CustomToast {...toastProps} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const showToast = useContext(ToastContext);
    return showToast;
};
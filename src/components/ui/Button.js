import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
export const Button = ({ children, className, ...props }) => {
    const variant = props.variant ?? 'primary';
    return (_jsx("button", { ...props, className: clsx('button', `button-${variant}`, className), children: children }));
};

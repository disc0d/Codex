import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Loading = ({ label = 'Loading' }) => (_jsxs("div", { style: { display: 'inline-flex', gap: 8, alignItems: 'center' }, children: [_jsx("span", { className: "spinner" }), _jsxs("small", { children: [label, "..."] })] }));

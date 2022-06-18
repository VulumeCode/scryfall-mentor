import React from "react";

import "./ContextMenu.css";

const ContextMenu: React.FC<{
    yPos: number,
    onClose: () => void,
    children: React.ReactNode,
}> = ({ onClose, yPos, children }) => {
    return (
        <>
            <div className="modalBackground" onClick={onClose}></div>
            <div className="modalMenu" style={{ top: `${yPos}px` }}>
                <ul>{children}</ul>
            </div>
        </>
    );
};

export default ContextMenu;

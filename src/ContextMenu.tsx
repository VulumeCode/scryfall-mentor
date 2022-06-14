import React from "react";
import "./ContextMenu.css";




const ContextMenu: React.FC<{
    // yPos: number,
    onClose: () => void,
    onDelete: () => void,
    onRename: () => void,
    menuRef: HTMLDivElement | null,
}> = ({ onClose, onDelete, onRename, menuRef }) => {

    const doIt = (action: () => void): (() => void) => {
        return () => {
            action();
            onClose();
        };
    };

    return (
        <>
            <div className="modalBackground"
                onClick={onClose}>

            </div>
            <div
                className="modalMenu"
                style={{ top: `${menuRef?.getBoundingClientRect().bottom}px` }}
            >
                <ul>
                    <li>
                        <i className="ms ms-ability-menace"></i>
                        Load as mask
                    </li>
                    <li>
                        <i className="ms ms-ability-menace"></i>
                        Append to mask
                    </li>
                    <li>
                        <i className="ms ms-ability-transform"></i>
                        Duplicate
                    </li>
                    <li
                        onClick={doIt(onRename)}>
                        <i className="ms ms-artist-nib "></i>
                        Rename
                    </li>
                    <li
                        style={{ color: "#f64800" }}
                        onClick={doIt(onDelete)}
                    >
                        <i className="ms ms-ability-devotion"></i>
                        Delete
                    </li>
                    {/* <li><i className="blueprint-icons-big">{icons["edit"].utf}</i>Rename</li>
                <li><i className="blueprint-icons-big">{icons["duplicate"].utf}</i>Duplicate</li>
                <li style={{ color: "red" }}><i className="blueprint-icons-big">{icons["trash"].utf}</i>Delete</li> */}
                </ul>
            </div >
        </>
    );
};

export default ContextMenu;


import React, { useState } from "react";
import { useRef } from "react";


import icons from "./icons";

import "./ContextMenu.css";

const ContextMenu: React.FC<{
    yPos: number,
}> = ({ yPos }) => {

    return (
        <div className="modalBackground">
            <div
                className="modalMenu"
                style={{ top: `${yPos}px` }}>
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
                    <li>
                        <i className="ms ms-artist-nib "></i>
                        Rename
                    </li>
                    <li style={{ color: "#f64800" }}>
                        <i className="ms ms-ability-devotion"></i>
                        Delete
                    </li>
                    {/* <li><i className="blueprint-icons-big">{icons["edit"].utf}</i>Rename</li>
                    <li><i className="blueprint-icons-big">{icons["duplicate"].utf}</i>Duplicate</li>
                    <li style={{ color: "red" }}><i className="blueprint-icons-big">{icons["trash"].utf}</i>Delete</li> */}
                </ul>
            </div >
        </div>

    );
};

export default ContextMenu;


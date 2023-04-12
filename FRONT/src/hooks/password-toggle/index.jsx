import React, { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaEye, FaEyeSlash } from '@fortawesome/free-solid-svg-icons';

const userTogglePassword = () => {

    const [visibility, setVisibility] = useState(false);
    
    const icon = <FontAwesomeIcon icon={visibility ? FaEye : FaEyeSlash}
                    onClick={() => {
                        setVisibility(visibility => !visibility);
                    }}/>;
    
    const inputType = visibility ? "text" : "password";

    return [inputType, icon];

};

export default userTogglePassword;
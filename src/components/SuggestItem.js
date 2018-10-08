import React from 'react';


const SuggestItem = ({suggestItem, className, onClick}) => {
    return (
        <li
            className={className}
            onClick={onClick}
        >
            {suggestItem.title}
        </li>
    )
};

export default SuggestItem;

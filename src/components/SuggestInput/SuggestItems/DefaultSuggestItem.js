import React from 'react';


const DefaultSuggestItem = ({suggestItem, className, onClick}) => {
    return (
        <li
            className={className}
            onClick={onClick}
        >
            {suggestItem.title}
        </li>
    )
};

export default DefaultSuggestItem;

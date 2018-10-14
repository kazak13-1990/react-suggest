import React from 'react';


const SuggestItemWithDescr = ({suggestItem, className, onClick}) => {
    return (
        <li
            className={className}
            onClick={onClick}
        >
            <div>
                <h3>{suggestItem.title}</h3>
                <p>{suggestItem.descr.substr(0, 100)}...</p>
            </div>
        </li>
    )
};

export default SuggestItemWithDescr;

import React from 'react';

const SuggestResults = ({suggestResults, showResults, activeItemIndex, SuggestItem, onSelect}) => {
    if ((suggestResults.length === 0) || !showResults) {
        return null;
    }

    return (
        <ul
            className="suggest-block"
        >
            {suggestResults.map((suggestItem, index) => {
                const isActive = activeItemIndex === index;
                const className = ['suggest-item'];
                isActive && className.push('isActive');
                return (
                    <SuggestItem
                        key={index}
                        className={className.join(' ')}
                        suggestItem={suggestItem}
                        onClick={() => onSelect(index)}
                    />
                )
            })}
        </ul>
    )
};

export default SuggestResults;
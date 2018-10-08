import React from 'react';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import SuggestItem from "../SuggestItem";
import SearchService from "../../services/SearchService";
import './suggest-input.css';


const MAX_SUGGEST_COUNT = 10;
const DEFAULT_ITEM_INDEX = -1;
const handleKeys = {
    keyUp: 38,
    keyDown: 40,
    enter: 13,
};

export default class SuggestInput extends React.Component {
    static propTypes = {
        maxSuggestCount: PropTypes.number,
        onAction: PropTypes.func,
    };

    static defaultProps = {
        SuggestItem: SuggestItem,
        maxSuggestCount: MAX_SUGGEST_COUNT,
    };

    state = {
        inputValue: '',
        suggestResults: [],
        activeItemIndex: DEFAULT_ITEM_INDEX,
    };

    onChange = async (event) => {
        const {maxSuggestCount} = this.props;
        const value = event.target.value;
        this.setState({
            inputValue: value,
            activeItemIndex: DEFAULT_ITEM_INDEX,
        });

        if (value !== '') {
            const suggestResults = await SearchService.search(value, maxSuggestCount);
            this.setState({
                suggestResults: suggestResults,
            });
        } else {
            this.setState({
                suggestResults: [],
            });
        }
    };

    selectSuggestItem = (newActiveItem) => {
        const {suggestResults} = this.state;
        if (suggestResults.length > 0) {
            const maxActiveItemIndex = suggestResults.length - 1;
            if (newActiveItem > maxActiveItemIndex) {
                newActiveItem = DEFAULT_ITEM_INDEX;
            }
            if (newActiveItem < -1) {
                newActiveItem = maxActiveItemIndex;
            }
            this.setState({
                activeItemIndex: newActiveItem,
            });
        }
    };

    onKeyPress = (event) => {
        const {activeItemIndex} = this.state;
        const keyCode = event.keyCode || event.which;

        if (keyCode === handleKeys.keyDown) {
            event.preventDefault();
            this.selectSuggestItem(activeItemIndex + 1);
        }
        if (keyCode === handleKeys.keyUp) {
            event.preventDefault();
            this.selectSuggestItem(activeItemIndex - 1);
        }
        if (keyCode === handleKeys.enter) {
            event.preventDefault();
            this.onSelectSuggest(activeItemIndex);
        }
    };

    onSelectSuggest = (suggestIndex, finished = true) => {
        const {onAction} = this.props;
        const {inputValue, suggestResults} = this.state;
        const suggestValue = suggestResults[suggestIndex] && suggestResults[suggestIndex].title;
        const newInputValue = suggestValue || inputValue;
        this.setState({
            inputValue: newInputValue,
            activeItemIndex: DEFAULT_ITEM_INDEX,
            suggestResults: [],
        });

        if (finished) {
            onAction && onAction(newInputValue);
        }
    };

    onBlur = (event) => {
        const {activeItemIndex} = this.state;
        this.onSelectSuggest(activeItemIndex, false);
    };

    render() {
        const {SuggestItem} = this.props;
        const { inputValue, suggestResults, activeItemIndex } = this.state;

        const suggestValue = suggestResults[activeItemIndex] && suggestResults[activeItemIndex].title;
        const displayValue = suggestValue || inputValue;

        return (
            <OutsideClickHandler
                onOutsideClick={this.onBlur}
            >
                <div className="suggest-input">
                    <input
                        type="text"
                        value={displayValue}
                        className="input"
                        placeholder="Start typing..."
                        onChange={this.onChange}
                        onKeyDown={this.onKeyPress}
                    />
                    {(suggestResults.length > 0) &&
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
                                    onClick={() => this.onSelectSuggest(index)}
                                />
                            )
                        })}
                    </ul>
                    }
                </div>
            </OutsideClickHandler>
        );
    }
}

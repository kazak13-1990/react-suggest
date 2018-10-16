import React from 'react';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import {noop} from "../../utils/miscUtils";
import SuggestResults from "./SuggestResults";
import './suggest-input.css';


const DEFAULT_ITEM_INDEX = -1;
const handleKeys = {
    keyUp: 38,
    keyDown: 40,
    enter: 13,
    esc: 27,
};

export default class SuggestInput extends React.PureComponent {
    static propTypes = {
        suggestResults: PropTypes.array.isRequired,
        SuggestItem: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.node,
        ]).isRequired,
        onAction: PropTypes.func,
    };

    static defaultProps = {
        onAction: noop,
    };

    state = {
        inputValue: '',
        activeItemIndex: DEFAULT_ITEM_INDEX,
        showResults: true,
    };

    handlerActions = {
        [handleKeys.keyUp]: () => {
            const {activeItemIndex} = this.state;
            this.selectSuggestItemWithCheck(activeItemIndex - 1);
        },
        [handleKeys.keyDown]: () => {
            const {activeItemIndex} = this.state;
            this.selectSuggestItemWithCheck(activeItemIndex + 1);
        },
        [handleKeys.enter]: () => {
            const {activeItemIndex} = this.state;
            this.onSelectSuggest(activeItemIndex);
        },
        [handleKeys.esc]: () => {
            this.onBlur();
        },
    };

    onChange = (event) => {
        const {onSearch} = this.props;
        const value = event.target.value;
        this.setState({
            inputValue: value,
            activeItemIndex: DEFAULT_ITEM_INDEX,
            showResults: true,
        });

        onSearch(value);
    };

    selectSuggestItem = (newActiveItem) => {
        const {suggestResults} = this.props;
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

    selectSuggestItemWithCheck = (index) => {
        const {showResults} = this.state;
        if (showResults){
            this.selectSuggestItem(index);
        } else {
            this.setState({
                showResults: true,
            })
        }
    };

    onKeyPress = (event) => {
        const keyCode = event.keyCode || event.which;

        const action = this.handlerActions[keyCode];
        if (action) {
            event.preventDefault();
            action();
        }
    };

    onSelectSuggest = (suggestIndex) => {
        const {onAction, suggestResults} = this.props;
        const {inputValue} = this.state;
        const suggestValue = suggestResults[suggestIndex] && suggestResults[suggestIndex].title;
        const newInputValue = suggestValue || inputValue;
        this.setState({
            inputValue: newInputValue,
            activeItemIndex: DEFAULT_ITEM_INDEX,
        });

        onAction(newInputValue);
    };

    onBlur = () => {
        this.setState({
            showResults: false,
        })
    };

    render() {
        const { SuggestItem, suggestResults, className } = this.props;
        const { inputValue, showResults, activeItemIndex } = this.state;

        const suggestValue = suggestResults[activeItemIndex] && suggestResults[activeItemIndex].title;
        const displayValue = suggestValue || inputValue;

        return (
            <OutsideClickHandler
                onOutsideClick={this.onBlur}
            >
                <div className={`suggest-input ${className}`}>
                    <input
                        type="text"
                        value={displayValue}
                        className="input"
                        placeholder="Start typing..."
                        onChange={this.onChange}
                        onKeyDown={this.onKeyPress}
                    />
                    <SuggestResults
                        SuggestItem={SuggestItem}
                        suggestResults={suggestResults}
                        showResults={showResults}
                        activeItemIndex={activeItemIndex}
                        onSelect={this.onSelectSuggest}
                    />
                </div>
            </OutsideClickHandler>
        );
    }
}

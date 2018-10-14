import React from 'react';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import {noop} from "../../utils/miscUtils";
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

    onKeyPress = (event) => {
        const {activeItemIndex, showResults} = this.state;
        const keyCode = event.keyCode || event.which;

        if (keyCode === handleKeys.keyDown) {
            event.preventDefault();
            if (showResults){
                this.selectSuggestItem(activeItemIndex + 1);
            } else {
                this.setState({
                    showResults: true,
                })
            }
        }
        if (keyCode === handleKeys.keyUp) {
            event.preventDefault();
            if (showResults){
                this.selectSuggestItem(activeItemIndex - 1);
            } else {
                this.setState({
                    showResults: true,
                })
            }
        }
        if (keyCode === handleKeys.enter) {
            event.preventDefault();
            this.onSelectSuggest(activeItemIndex);
        }
        if (keyCode === handleKeys.esc) {
            event.preventDefault();
            this.onBlur();
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
                    {(suggestResults.length > 0) && showResults &&
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

import React from 'react';
import SuggestInput from "./SuggestInput/SuggestInput";
import SearchService from "../services/SearchService";
import PropTypes from "prop-types";
import DefaultSuggestItem from "./SuggestInput/SuggestItems/DefaultSuggestItem";
import {noop} from "../utils/miscUtils";


const DEFAULT_MAX_SUGGEST_COUNT = 10;

export default class SearchWithSuggest extends React.Component{
    static propTypes = {
        className: PropTypes.string,
        maxSuggestCount: PropTypes.number,
        SuggestItem: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.node,
        ]),
        onAction: PropTypes.func,
    };

    static defaultProps = {
        maxSuggestCount: DEFAULT_MAX_SUGGEST_COUNT,
        SuggestItem: DefaultSuggestItem,
        onAction: noop,
    };

    state = {
        searchResults: [],
    };

    searchCount = 0;

    onSearch = async (value) => {
        const {maxSuggestCount} = this.props;
        const searchCount = ++this.searchCount;
        let searchResults = [];

        if (value !== '') {
            searchResults = await SearchService.search(value, maxSuggestCount);
        }
        if (searchCount === this.searchCount) {
            this.setState({
                searchResults: searchResults,
            });
        }
    };

    onAction = (value) => {
        const {onAction} = this.props;
        this.setState({
            searchResults: [],
        });
        onAction(value);
    };

    render() {
        const {SuggestItem, className} = this.props;
        const {searchResults} = this.state;
        return (
            <SuggestInput
                className={className}
                suggestResults={searchResults}
                SuggestItem={SuggestItem}
                onSearch={this.onSearch}
                onAction={this.onAction}
            />
        )
    }
}

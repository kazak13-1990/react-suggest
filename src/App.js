import React, { Component } from 'react';
import SearchWithSuggest from "./components/SearchWithSuggest"
import SuggestItemWithDescr from "./components/SuggestInput/SuggestItems/SuggestItemWithDescr";
import "./App.css";


class App extends Component {
    render() {
        return (
            <div className="app">
                <h2>Default suggest</h2>
                <SearchWithSuggest
                    className="search-first"
                    onAction={(result) => alert('Search: ' + result)}
                />
                <div>
                    <p>Some content after suggest input</p>
                </div>
                <hr/>
                <h2>Suggest with descriptions</h2>
                <SearchWithSuggest
                    className="search-second"
                    SuggestItem={SuggestItemWithDescr}
                    maxSuggestCount={5}
                    onAction={(result) => alert('Search: ' + result)}
                />
                <div>
                    <p>Some content after suggest input</p>
                </div>
            </div>
        );
    }
}

export default App;

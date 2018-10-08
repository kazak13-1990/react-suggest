import React, { Component } from 'react';
import SuggestInput from './components/SuggestInput/SuggestInput';
import "./App.css";


class App extends Component {
    render() {
        return (
            <div className="app">
                <SuggestInput
                    maxSuggestCount={7}
                    onAction={(result) => alert('Действие с результатом: ' + result)}
                />
                <div>
                    <p>Some content after suggest input</p>
                </div>
            </div>
        );
    }
}

export default App;

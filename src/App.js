import React, {Component} from 'react';
import './App.css';

const list = [
    {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://redux.js.org/',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
    },

];

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list,
            name: 'The road to learn react',
            searchTerm: '',
            filteredList: list.slice()
        };
    }

    onDismiss = (id) => {
        this.setState({
            list: this.state.list.filter(item => item.objectID !== id),
        });
    };

    onSearchChange = (event) => {
        this.setState({searchTerm: event.target.value});
    };

    onSearchSubmit = () => {
        this.setState({
            filteredList: this.state.list.filter(item => item.title.indexOf(this.state.searchTerm) === 0)
        })
    };

    render() {
        return (
            <div className="App">
                <h2>{this.state.name}</h2>
                <Search searchTerm={this.state.searchTerm} onSearchChange={this.onSearchChange}
                        onSearchSubmit={this.onSearchSubmit}/>
                <Table filteredList={this.state.filteredList} onDismiss={this.onDismiss}/>
            </div>
        );
    }
}

class Search extends Component {
    render() {
        const {searchTerm, onSearchChange, onSearchSubmit} = this.props;
        return (
            <div>
                <form>
                    <input value={searchTerm} type="text" onChange={onSearchChange}/>
                </form>
                <Button  className="btn" onClick={onSearchSubmit}>
                    Search
                </Button>
            </div>)
    }
}

class Table extends Component {
    render() {
        const {filteredList, onDismiss} = this.props;
        return (filteredList.map(item => (
                <div key={item.objectID}>
                    <span><a href={item.url}>{item.title}</a></span>
                    <span>{item.author}</span>
                    <span>{item.num_comments}</span>
                    <span>{item.points}</span>
                    <Button className="btn" onClick={() => onDismiss(item.objectID)}>
                        Dismiss
                    </Button>
                </div>))
        )
    }
}

class Button extends Component {
    render() {
        const {
            onClick,
            className,
            children
        } = this.props;
        return (
            <button onClick={onClick} className={className} type="button">
                {children}
            </button>)
    }
}

export default App;

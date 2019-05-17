import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = `page=`;

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
            filteredList: [],
            list: [],
            error: 'There has been an error'
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
        this.fetchSearchTopStories(this.state.searchTerm);
    };

    searchStories = (result) => {
        if (result.page !== 0) {
            this.setState({result, filteredList: [...this.state.filteredList, ...result.hits]});
            return;
        }
        this.setState({result, filteredList: result.hits});

    };

    onFetchMore = () => {
        this.fetchSearchTopStories(this.state.searchTerm, this.state.result.page + 1);
    };

    onError = (error) => {
        this.setState({error});
    };

    fetchSearchTopStories = (searchTerm, page = 0) => {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
            .then(response => response.json())
            .then(result => this.searchStories(result))
            .catch(error => this.setState({error}));
    };


    componentDidMount() {
        const {searchTerm} = this.state;
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => {
                this.searchStories(result);
                this.setState({
                    list: result['hits'] || []
                })
            })
            .catch(e => console.log(e));
    }

    render() {
        const {name, searchTerm, filteredList, error} = this.state;
        return (
            <div className="App">
                <h2>{name}</h2>
                <Search searchTerm={searchTerm} error={error} onSearchChange={this.onSearchChange}
                        onSearchSubmit={this.onSearchSubmit} fetchMore={this.onFetchMore}/>
                <div className="margin-v-2x table">
                    <div className="table-component table-header d-flex justify-between align-center margin-v-1x">
                        <span className="margin-h-2x flex-1">Title</span>
                        <span className="margin-h-2x flex-3">Author</span>
                        <span className="margin-h-2x flex-1">#Comments</span>
                        <span className="margin-h-2x flex-1">#Points</span>
                    </div>
                    {filteredList && filteredList.length ?
                        <Table filteredList={filteredList} onDismiss={this.onDismiss}/> : null}
                </div>
            </div>
        );
    }
}

const Search = ({searchTerm, onSearchChange, onSearchSubmit, fetchMore, error}) =>
    <div className="d-flex search">
        <form>
            <input value={searchTerm} type="text" onChange={onSearchChange}/>
        </form>
        <Button className="btn" onClick={onSearchSubmit}>
            Search
        </Button>
        <Button className="btn margin-h-2x" onClick={fetchMore}>
            Fetch more
        </Button>
        {error && error.length ? <div className="error">{error}</div> : null}
    </div>;

const Table = ({filteredList, onDismiss}) =>
    filteredList.map(item => (
        <div key={item.objectID} className="table-component d-flex justify-between align-center margin-v-1x">
            <span className="margin-h-2x flex-1"><a href={item.url}>{item.title}</a></span>
            <span className="margin-h-2x flex-3">{item.author}</span>
            <span className="margin-h-2x flex-1">{item.num_comments}</span>
            <span className="margin-h-2x flex-1">{item.points}</span>
            <Button className="btn" onClick={() => onDismiss(item.objectID)}>
                Dismiss
            </Button>
        </div>)
    );

const Button = ({onClick, className, children}) =>
    <button onClick={onClick} className={className} type="button">
        {children}
    </button>;

export default App;

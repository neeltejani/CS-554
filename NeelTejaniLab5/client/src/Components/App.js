import "./App.css";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
 
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./Home";
import MyBin from "./MyBin";
import MyPosts from "./MyPosts";
import NewPost from "./NewPost";

const client = new ApolloClient({
  uri: "http://localhost:4000", // <- this could be the issue if not set correctly
  cache: new InMemoryCache(),
});
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className="App-header">
            <h1 className="App-title">Binterest</h1>
            <nav>
              <NavLink to="/my-bin">MY BIN</NavLink>
              <NavLink to="/my-posts">MY POSTS</NavLink>
            </nav>
          </header>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route
              exact
              path="/my-bin"
              element={<MyBin />}
            />
            <Route
              exact
              path="/my-posts"
              element={<MyPosts />}
            />
            <Route
              exact
              path="/new-post"
              element={<NewPost />}
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import "../App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  NavLink,
} from "react-router-dom";
import PokemonById from "./PokemonById";
import PokemonList from "./PokemonList";
import Trainer from "./Trainer";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className="App-header ">
            <Link to={"/"}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png"
                className="App-logo"
                alt="logo"
              />
            </Link>
            <nav>
              <NavLink
                className="navlink"
                to="/pokemon/page/0"
              >
                Pokemon
              </NavLink>
              <NavLink className="navlink" to="/trainers">
                Pokemon Trainer
              </NavLink>
            </nav>
          </header>
          <Routes>
            <Route
              exact
              path="/pokemon/page/:pageNum"
              element={<PokemonList />}
            />
            <Route
              exact
              path="/pokemon/:id"
              element={<PokemonById />}
            />
            <Route
              exact
              path="/trainers"
              element={<Trainer />}
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import classNames from "classnames";

import { get_movies } from "@apis/movies";
import { addImagePrefix } from "@libs/utils/helpers";
import { Movie } from "@libs/utils/types";

import { useAuth } from "./AuthProvider";
import SearchBar from "./SeachBar";
import ThemeController from "./ThemeController";

type NavBarProps = {
  title: string;
}

const SHOW_SEARCH_BAR_PATHS = [/^\/movies(\/\d+)?$/, /^\/users$/, /^\/$/];

const NavBar = (props: NavBarProps) => {
  const { title } = props;
  const { token, setToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const showSearchBar = SHOW_SEARCH_BAR_PATHS.some((pattern) => pattern.test(location.pathname));


  const [isLoading, setIsLoading] = useState(false);
  const [canShowDropdown, setCanShowDropdown] = useState(false);
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const handleSearchInputChange = (value: string) => {
    setMovies([]);
    setQuery(value);
  };

  const handleSearchSubmit = async (value: string) => {
    setCanShowDropdown(false);
    navigate(`/movies?query=${value}`);
  };

  useEffect(() => {
    setIsLoading(true);
    setCanShowDropdown(true);

    const getMovies = async () => {
      if (!query) return;

      const responeMovies = await get_movies({ query, page: 1 });

      setIsLoading(false);

      if (!responeMovies) return;
      if (responeMovies.movies?.length === 0) return;

      setMovies(responeMovies.movies.slice(0, 10));
    };

    const debounce = setTimeout(() => getMovies(), 500);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    if (location.pathname.includes('/movies')) {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('query');

      if (query) {
        setQuery(query);
      }
    }
  }, [location]);

  return (
    <div className="navbar bg-base-100">
      <div className={classNames("flex-1", { "flex-none": showSearchBar })}>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          {title}
        </Link>
      </div>
      {showSearchBar && (
        <div className="flex flex-1 justify-center items-center dropdown dropdown-bottom">
          <SearchBar className="w-4/5" value={query} onChange={handleSearchInputChange} onSubmit={handleSearchSubmit} />
          {query && canShowDropdown && (
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-4/5 p-2 mt-2 shadow">
              {isLoading ? (
                <div className="h-14 flex justify-center items-center">
                  <span className="loading loading-dots loading-md" />
                </div>
              ) :
                <>
                  {movies.map((movie) => (
                    <li key={movie.id}>
                      <Link to={`/movies/${movie.id}`}>
                        <div className="flex gap-2 items-center">
                          <img
                            src={addImagePrefix(movie.poster_path)}
                            alt={movie.title} className="h-[64px] w-fit object-cover rounded-btn"
                          />
                          <div className="flex flex-col gap-1">
                            <p className="font-medium">
                              {movie.title}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => {
                        setCanShowDropdown(false);
                        navigate(`/movies?query=${query}`)
                      }}
                      className="btn btn-ghost">
                      View all
                    </button>
                  </li>
                </>
              }
            </ul>
          )}
        </div>
      )}
      <div className="flex-none">
        <ThemeController />
        <ul className="menu menu-horizontal px-1 gap-1">
          {token ? (
            <>
              <li><Link to="/users">Users</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">SignIn</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default NavBar;
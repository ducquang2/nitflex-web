import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import classNames from "classnames";

import { get_genres, get_llm_movies, get_movies } from "@apis/movies";
import { get_user_profile } from "@apis/profile";
import { addImagePrefix } from "@libs/utils/helpers";
import { Genre, MovieInfo } from "@libs/utils/types";

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
  const [movies, setMovies] = useState<Array<MovieInfo>>([]);
  const [query, setQuery] = useState("");
  const [isLLMSearch, setIsLLMSearch] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
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
    const checkUserProfile = async () => {
      try {
        await get_user_profile();
      } catch (error) {
        // @ts-expect-error - This is a hack to check if the token is valid
        if (error?.response?.data?.message === 'invalid token') {
          setShowLogoutModal(true);
        }
      }
    };

    checkUserProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await get_genres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setCanShowDropdown(true);

    const getMovies = async () => {
      if (!query) return;

      try {
        const responseMovies = isLLMSearch ? await get_llm_movies({ query }) : await get_movies({ query, page: 1 });

        setIsLoading(false);

        if (!responseMovies) return;
        if (responseMovies.results?.length === 0) return;

        setMovies(responseMovies.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => getMovies(), 500);
    return () => clearTimeout(debounce);
  }, [query, isLLMSearch]);

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
        <div className="flex flex-1 gap-4 justify-center items-center">
          <label className="label cursor-pointer">
            <span className="label-text mr-2 w-12">{isLLMSearch ? "LLM" : "Simple"}</span>
            <input type="checkbox" className="toggle toggle-primary" checked={isLLMSearch} onChange={() => setIsLLMSearch(!isLLMSearch)} />
          </label>

          <div className="w-3/5 dropdown dropdown-bottom">
            <SearchBar className="w-full" value={query} onChange={handleSearchInputChange} onSubmit={handleSearchSubmit} />

            {query && canShowDropdown && (
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-4/5 p-2 mt-2 shadow">
                {isLoading ? (
                  <div className="h-14 flex justify-center items-center">
                    <span className="loading loading-dots loading-md" />
                  </div>
                ) :
                  <>
                    {movies.map((movie) => (
                      <li key={movie.Id}>
                        <Link to={`/movies/${movie.TmdbId}`}>
                          <div className="flex gap-2 items-center">
                            <img
                              src={addImagePrefix(movie.PosterPath)}
                              alt={movie.Title} className="h-[64px] w-fit object-cover rounded-btn"
                            />
                            <div className="flex flex-col gap-1">
                              <p className="font-medium">
                                {movie.Title}
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

          <div className="dropdown dropdown-bottom">
            <label tabIndex={0} className="btn btn-ghost">
              <i className="icon-funnel-mini" />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-80 z-20 h-64 overflow-x-auto">
              {genres?.map((genre) => (
                <li key={genre.Id} className="w-40">
                  <Link to={`/movies?genre=${genre.Id}`}>
                    {genre.Name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="flex-none">
        <ThemeController />
        <ul className="menu menu-horizontal px-1 gap-1">
          {token ? (
            <>
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

      {showLogoutModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Session Expired</h3>
            <p className="py-4">Your session has expired. Please log in again.</p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar;
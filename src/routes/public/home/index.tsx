import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@components/AuthProvider';
import nitflexApiAxios from '@libs/axios/nitflex-api';
import { Movie } from '@libs/utils/types';

const Home = () => {
  const { token } = useAuth();

  const [trendingMovies, setTrendingMovies] = useState<Array<Movie>>([]);
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const getTrendingMovies = async () => {
      const responseDay = await nitflexApiAxios.get(`/movies/trending?time_window=${timeWindow}`);

      setIsLoading(false);

      setTrendingMovies(responseDay.data.data);
    };

    getTrendingMovies();
  }, [timeWindow]);

  return (
    <div className="min-h-[calc(100dvh-5rem)] container mx-auto p-4">
      <div className="hero bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              NitFlex - Movies/Books recommendation web
            </h1>
            <div>
              {token ? (
                <p className="py-6">Welcome back, user!</p>
              ) : (
                <p className="py-6">
                  A web application built with React, providing a seamless and secure user registration experience.
                </p>
              )}
            </div>
            <div>
              <Link to="/movies" className="btn btn-primary">Find Movies</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="my-8">
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-3xl font-bold">
            {timeWindow === 'day' ? "Today" : "Week"} Trending Movies
          </h2>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn m-1">Time Window</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
              <li>
                <button onClick={() => setTimeWindow('day')}>Today</button>
              </li>
              <li>
                <button onClick={() => setTimeWindow('week')}>This Week</button>
              </li>
            </ul>
          </div>
        </div>

        {isLoading ? (
          <div className="h-full flex justify-center items-center">
            <span className="loading loading-bars loading-lg" />
          </div>
        ) : (
          <div className="carousel carousel-center w-full bg-neutral rounded-box space-x-4 p-4">
            {trendingMovies?.length && trendingMovies.map((movie) => (
              <div key={movie.id} className="carousel-item w-1/3 md:w-1/4 rounded-box">
                <div className="card w-full bg-base-100 shadow-xl">
                  <figure className="relative">
                    <img src={movie.poster_path} alt={movie.title} className="h-[300px] w-full object-cover" />
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                      <p className="text-sm">{movie.release_date}</p>
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="card-title text-lg font-bold">{movie.title}</h2>
                    <p className="text-gray-700 text-sm truncate">{movie.overview}</p>
                    <div className="card-actions justify-end mt-2">
                      <Link to={`/movies/${movie.id}`} className="btn btn-primary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  path: '/',
  main: Home,
}
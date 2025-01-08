import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { MovieInfo } from '@libs/utils/types';

import { get_popular_movies, get_trending_movies, get_upcoming_movies } from '@apis/movies';

import { useAuth } from '@components/AuthProvider';
import MoviesSection from '@components/MoviesSection';

const Home = () => {
  const { token } = useAuth();

  const [trendingMovies, setTrendingMovies] = useState<Array<MovieInfo>>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Array<MovieInfo>>([]);
  const [popularMovies, setPopularMovies] = useState<Array<MovieInfo>>([]);

  const [isGettingTrendingMovies, setIsGettingTrendingMovies] = useState(false);
  const [isGettingUpcomingMovies, setIsGettingUpcomingMovies] = useState(false);
  const [isGettingPopularMovies, setIsGettingPopularMovies] = useState(false);

  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');


  useEffect(() => {
    setIsGettingTrendingMovies(true);
    setIsGettingUpcomingMovies(true);
    setIsGettingPopularMovies(true);

    const getTrendingMovies = async () => {
      const responseDay = await get_trending_movies({ time_window: timeWindow });

      setIsGettingTrendingMovies(false);
      setTrendingMovies(responseDay);
    };

    const getUpcomingMovies = async () => {
      const responseUpcoming = await get_upcoming_movies();

      setIsGettingUpcomingMovies(false);
      setUpcomingMovies(responseUpcoming.results);
    }

    const getPopularMovies = async () => {
      const responsePopular = await get_popular_movies();

      setIsGettingPopularMovies(false);
      setPopularMovies(responsePopular.results);
    }

    getTrendingMovies();
    getUpcomingMovies();
    getPopularMovies();
  }, [timeWindow]);

  return (
    <div className="min-h-[calc(100dvh-5rem)] container mx-auto p-4">
      <div className="hero bg-base-200">
        <div className="hero-content text-center flex flex-col">
          <h1 className="text-5xl font-bold w-fit">
            NitFlex <br /> Movies recommendation web
          </h1>
          <div>
            {token ? (
              <p className="pt-6 pb-4">Welcome back, user!</p>
            ) : (
              <p className="py-6">
                A web application built with React, providing a seamless and secure user registration experience.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8 mt-8">
        <MoviesSection
          title={`${timeWindow === 'day' ? "Today" : "This Week"} Trending Movies`}
          isLoading={isGettingTrendingMovies}
          movies={trendingMovies}
          rightHeader={() => (
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
          )}
        />

        <MoviesSection
          title="Upcoming Movies"
          isLoading={isGettingUpcomingMovies}
          movies={upcomingMovies}
          rightHeader={() => (
            <Link to="/movies" className="btn btn-primary">View All</Link>
          )}
        />

        <MoviesSection
          title="Popular Movies"
          isLoading={isGettingPopularMovies}
          movies={popularMovies}
          rightHeader={() => (
            <Link to="/movies" className="btn btn-primary">View All</Link>
          )}
        />
      </div>
    </div>
  );
};

export default {
  path: '/',
  main: Home,
}
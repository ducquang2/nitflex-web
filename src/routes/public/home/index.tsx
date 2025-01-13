import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';

import { MovieInfo, Trailer } from '@libs/utils/types';

import { get_popular_movies, get_trailers, get_trending_movies } from '@apis/movies';

import { useAuth } from '@components/AuthProvider';
import MoviesSection from '@components/MoviesSection';

const Home = () => {
  const { token } = useAuth();

  const [trendingMovies, setTrendingMovies] = useState<Array<MovieInfo>>([]);
  // const [upcomingMovies, setUpcomingMovies] = useState<Array<MovieInfo>>([]);
  const [popularMovies, setPopularMovies] = useState<Array<MovieInfo>>([]);
  const [trailers, setTrailers] = useState<Array<Trailer>>([]);

  const [isGettingTrendingMovies, setIsGettingTrendingMovies] = useState(false);
  // const [isGettingUpcomingMovies, setIsGettingUpcomingMovies] = useState(false);
  const [isGettingPopularMovies, setIsGettingPopularMovies] = useState(false);

  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');

  useEffect(() => {
    const fetchMovies = async () => {
      setIsGettingTrendingMovies(true);
      // setIsGettingUpcomingMovies(true);
      setIsGettingPopularMovies(true);

      try {
        const [trendingResponse, popularResponse, trailersResponse] = await Promise.all([
          get_trending_movies({ time_window: timeWindow }),
          // get_upcoming_movies(),
          get_popular_movies(),
          get_trailers(),
        ]);

        setTrendingMovies(trendingResponse);
        // setUpcomingMovies(upcomingResponse.results);
        setPopularMovies(popularResponse);
        setTrailers(trailersResponse);

        // popularResponse.forEach(movie => fetchMovieTrailer(movie.TmdbId));
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setIsGettingTrendingMovies(false);
        // setIsGettingUpcomingMovies(false);
        setIsGettingPopularMovies(false);
      }
    };

    fetchMovies();
  }, [timeWindow]);

  return (
    <div className="min-h-[calc(100dvh-5rem)] container w-full max-w-full">
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
                Welcome to NitFlex, your ultimate destination for movie recommendations!
                Discover trending, upcoming, and popular movies tailored to your taste.
                Sign up to create your watchlist, rate movies, and add reviews.
                Enjoy a seamless movie discovery experience with NitFlex.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8 mt-8">
        <MoviesSection
          className='mx-6'
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

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2 mx-6">
            <h2 className="text-3xl font-bold">Latest Trailer</h2>
          </div>

          <div className="carousel carousel-center w-full bg-neutral space-x-4 py-4 px-6">
            {trailers && trailers.map((trailer) => (
              <div key={trailer.Id} className="carousel-item w-1/2 md:w-1/3">
                <div className="card w-full bg-transparent shadow-xl">
                  <figure className="relative w-full rounded-react-player">
                    <ReactPlayer url={trailer.Link} width="100%" height="300px" />
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="text-neutral-content text-center w-full text-lg font-bold">{trailer.Title}</h2>
                    <p className="text-neutral-content text-sm text-center truncate">{trailer.Description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <MoviesSection
          title="Upcoming Movies"
          isLoading={isGettingUpcomingMovies}
          movies={upcomingMovies}
          rightHeader={() => (
            <Link to="/movies" className="btn btn-primary">View All</Link>
          )}
        /> */}

        <MoviesSection
          className='mx-6'
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
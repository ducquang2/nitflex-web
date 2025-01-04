import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { get_movies } from '@apis/movies';

import { Movie } from '@libs/utils/types';

import { MovieList } from '../components/movie-list';

const Movies = () => {
  const location = useLocation();

  const [movies, setMovies] = useState<Array<Array<Movie>>>([]);
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const renderContent = () => {
    if (!isLoading && query && movies.length === 0) {
      return (
        <div className="flex justify-center items-center">
          <p className="text-2xl text-gray-400 ">No results found</p>
        </div>
      );
    }

    if (!query) {
      return (
        <div className="flex justify-center items-center">
          <p className="text-2xl text-gray-400 ">
            Please input to search for movies
          </p>
        </div>
      );
    }

    return movies.map((images, index) => (
      <MovieList key={index} images={images} />
    ));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (Math.round(scrollTop + clientHeight) >= scrollHeight - 20 && maxPage > page) {
      setPage((page) => page + 1);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const getMovies = async () => {
      if (!query) return;

      const responeMovies = await get_movies({ query, page });

      setIsLoading(false);

      if (!responeMovies) return;
      if (responeMovies.movies?.length === 0) return;

      setMaxPage(responeMovies?.totalPages);
      setMovies((prev) => [...prev, [...responeMovies.movies]]);
    };

    const debounce = setTimeout(() => getMovies(), 500);
    return () => clearTimeout(debounce);
  }, [query, page]);

  useEffect(() => {
    if (location.search && location.search.includes('query')) {
      const query = new URLSearchParams(location.search).get('query');
      setQuery(query || '');
    }
  }, [location])

  return (
    <div className="h-full bg-base-200 overflow-hidden p-4">
      <div className="flex flex-col gap-4">
        <div
          className="max-h-[calc(100vh-6rem)] flex flex-col gap-4 overflow-y-auto"
          onScroll={handleScroll}
        >
          {renderContent()}
          {query && isLoading && (
            <div className="flex justify-center items-center">
              <span className="loading loading-infinity loading-lg" />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default {
  path: '/movies',
  main: Movies
};
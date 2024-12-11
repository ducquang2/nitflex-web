import { useEffect, useState } from 'react';

import SearchBar from '@components/SeachBar';
import nitflexApiAxios from '@libs/axios/nitflex-api';
import { Movie } from '@libs/utils/types';

import { MovieList } from '../components/movie-list';

const Movies = () => {
  const [movies, setMovies] = useState<Array<Array<Movie>>>([]);
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const onSearchSubmit = async (value: string) => {
    setMovies([]);
    setPage(1);
    setQuery(value);
  };

  const onSearchInputChange = (value: string) => {
    setMovies([]);
    setPage(1);
    setQuery(value);
  };

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

    if (Math.round(scrollTop + clientHeight) >= scrollHeight - 20) {
      setPage((page) => page + 1);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const getMovies = async () => {
      if (!query) return;

      const response = await nitflexApiAxios.get(`/movies?query=${query}&page=${page}`);

      const responeMovies = response.data.data.results as Array<Movie>;

      setIsLoading(false);

      if (responeMovies.length === 0) return;

      setMovies((prev) => [...prev, [...responeMovies]]);
    };

    const debounce = setTimeout(() => getMovies(), 500);
    return () => clearTimeout(debounce);
  }, [query, page]);

  return (
    <div className="h-full bg-base-200 overflow-hidden p-4">
      <h1>Movies List</h1>
      <div className="flex flex-col gap-4">
        <SearchBar
          value={query}
          onSubmit={onSearchSubmit}
          onChange={onSearchInputChange}
        />
        <div
          className="max-h-[calc(100vh-12rem)] flex flex-col gap-4 overflow-y-auto"
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
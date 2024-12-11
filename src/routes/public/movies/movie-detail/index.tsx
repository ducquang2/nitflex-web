import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import nitflexApiAxios from "@libs/axios/nitflex-api";
import { Movie } from "@libs/utils/types";

const MovieDetail = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState<Movie>()
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)

    const getPhotoDetail = async () => {
      if (id) {
        const response = await nitflexApiAxios.get(`/movies/${id}`);

        const responeMovie = response.data.data as Movie

        setIsLoading(false);
        setMovie(responeMovie);
      }
    }

    getPhotoDetail()
  }, [id])

  if (isLoading) {
    return <div className="h-full flex justify-center items-center">
      <span className="loading loading-bars loading-lg" />
    </div>
  }

  return (
    <div className="min-h-[calc(100dvh-5rem)] container mx-auto p-4">
      {movie ? (
        <div className="card w-full bg-base-100 shadow-xl">
          <figure>
            <img src={movie.poster_path} alt="Movie Poster" className="h-[400px]" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{movie.title}</h2>
            <p className="text-gray-700">{movie.overview}</p>
            <p className="text-gray-700">Original Title: {movie.original_title}</p>
            <p className="text-gray-700">Release Date: {movie.release_date}</p>
            <p className="text-gray-700">Rating: {movie.vote_average} / 10</p>
            <p className="text-gray-700">Votes: {movie.vote_count}</p>
            <p className="text-gray-700">Original Language: {movie.original_language}</p>
            <p className="text-gray-700">Media Type: {movie.media_type}</p>
            <p className="text-gray-700">Adult: {movie.adult ? "Yes" : "No"}</p>
            <p className="text-gray-700">Popularity: {movie.popularity}</p>
            <p className="text-gray-700">Video: {movie.video ? "Yes" : "No"}</p>
            <div className="card-actions justify-between">
              <Link to="/movies" className="btn btn-secondary">Back to Search</Link>
              <div className="flex gap-2">
                <button className="btn btn-primary">Watch Now</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h2>Movie not Found</h2>
      )}
    </div>
  );
};

export default {
  path: '/movies/:id',
  main: MovieDetail
}
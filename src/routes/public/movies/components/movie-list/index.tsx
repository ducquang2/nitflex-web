import { Link } from "react-router-dom";

import { addImagePrefix, splitToSmallChunks } from "@libs/utils/helpers";
import { MovieInfo } from "@libs/utils/types";

export { MovieList };

type MovieListProps = {
  images: Array<MovieInfo>;
}

function MovieList(props: MovieListProps) {
  const { images } = props

  const gridImages = splitToSmallChunks([...images], 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {gridImages?.map((column, index) => (
        <div className="grid gap-4" key={index}>
          {column?.map((movie) => (
            <div key={movie.ID} className="card w-full bg-base-100 shadow-xl">
              <figure className="relative">
                <img
                  src={addImagePrefix(movie.PosterPath)} alt={movie.Title} className="h-[300px] w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="text-sm">{movie.ReleaseDate}</p>
                </div>
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-bold">{movie.Title}</h2>
                <p className="text-gray-700 h-fit">
                  {movie.VoteAverage} - {movie.VoteCount} / 10
                </p>
                <div className="card-actions justify-end">
                  <Link to={`/movies/${movie.TmdbId}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}


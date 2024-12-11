import { Link } from "react-router-dom";

import { splitToSmallChunks } from "@libs/utils/helpers";
import { Movie } from "@libs/utils/types";

export { MovieList };

type MovieListProps = {
  images: Array<Movie>;
}

function MovieList(props: MovieListProps) {
  const { images } = props

  const gridImages = splitToSmallChunks([...images], 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {gridImages.map((column, index) => (
        <div className="grid gap-4" key={index}>
          {column.map((movie) => (
            <div key={movie.id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  className="h-auto max-w-full rounded-t-lg"
                  src={movie.poster_path}
                  alt={movie.title}
                />
              </figure>
              <div className="card-body px-4 py-3">
                <h2 className="card-title">{movie.title}</h2>
                <p className="text-gray-700">
                  {movie.overview.length > 100 ? (
                    <>
                      {movie.overview.substring(0, 100)}...
                    </>
                  ) : (
                    movie.overview
                  )}
                </p>
                <div className="card-actions justify-end">
                  <Link to={`/movies/${movie.id}`} className="btn btn-primary">
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


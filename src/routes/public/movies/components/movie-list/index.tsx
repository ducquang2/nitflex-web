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
      {gridImages?.map((column, index) => (
        <div className="grid gap-4" key={index}>
          {column?.map((movie) => (
            <div key={movie.id} className="card w-full bg-base-100 shadow-xl">
              <figure className="relative">
                <img
                  src={movie.poster_path} alt={movie.title} className="h-[300px] w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="text-sm">{movie.release_date}</p>
                </div>
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-bold">{movie.title}</h2>
                <p className="text-gray-700 h-fit">
                  {movie.release_date} - {movie.vote_average} / 10
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


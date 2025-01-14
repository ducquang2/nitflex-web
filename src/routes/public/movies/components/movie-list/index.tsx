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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {gridImages?.map((column, index) => (
        <div className="grid gap-6" key={index}>
          {column?.map((movie) => (
            <div key={movie.Id} className="card w-full bg-base-100 shadow-xl h-full">
              <figure className="relative">
                <img
                  src={addImagePrefix(movie.PosterPath)} alt={movie.Title} className="h-[300px] w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="text-sm">{movie.ReleaseDate}</p>
                </div>
              </figure>
              <div className="card-body p-4 flex flex-col justify-between">
                <div>
                  <h2 className="card-title text-lg font-bold">{movie.Title}</h2>
                  <p className="text-gray-700 text-sm overflow-hidden overflow-ellipsis">{movie.Overview}</p>
                </div>
                <div>
                  <div className="flex gap-1.5 items-center mt-2">
                    <span className="icon-star-fill-micro text-yellow-500" />
                    <span className="text-neutral dark:text-neutral-content">
                      <span className="font-medium text-primary">
                        {movie.VoteAverage}
                      </span>
                      <span className="text-neutral-500">
                        / 10
                      </span>
                    </span>
                    <span className="text-neutral-500 text-sm">{movie.VoteCount} votes</span>
                  </div>
                  <div className="card-actions justify-end mt-2">
                    <Link to={`/movies/${movie.TmdbId}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}


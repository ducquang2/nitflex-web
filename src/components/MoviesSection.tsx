import { Link } from "react-router-dom";

import classNames from "classnames";
import dayjs from "dayjs";

import { SHORT_DATE_FORMAT } from "@libs/utils/constants";
import { addImagePrefix } from "@libs/utils/helpers";
import { MovieInfo } from "@libs/utils/types";

type MoviesSectionProps = {
  title: string;
  titleClassName?: string;
  movies: MovieInfo[];
  isLoading: boolean;
  rightHeader?: () => JSX.Element
}

const MoviesSection = (props: MoviesSectionProps) => {
  const { title, titleClassName, movies, isLoading, rightHeader } = props

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className={classNames("text-3xl font-bold", titleClassName)}>{title}</h2>

        {rightHeader && rightHeader()}
      </div>
      {isLoading ? (
        <div className="h-64 flex justify-center items-center">
          <span className="loading loading-bars loading-lg" />
        </div>
      ) : (
        <div className="carousel carousel-center w-full bg-neutral rounded-box space-x-4 p-4">
          {movies?.length && movies.map((movie) => (
            <div key={movie.Id} className="carousel-item w-1/3 md:w-1/4 rounded-box">
              <div className="card w-full bg-base-100 shadow-xl">
                <figure className="relative">
                  <img src={addImagePrefix(movie.PosterPath)} alt={movie.Title} className="h-[300px] w-full object-cover" />
                  <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                    <p className="text-sm">{dayjs(movie.ReleaseDate).format(SHORT_DATE_FORMAT)}</p>
                  </div>
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-lg font-bold">{movie.Title}</h2>
                  <p className="text-gray-700 text-sm truncate">{movie.Overview}</p>
                  <div className="card-actions justify-end mt-2">
                    <Link to={`/movies/${movie.TmdbId}`} className="btn btn-primary btn-sm btn-outline">
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
  )
}

export default MoviesSection;
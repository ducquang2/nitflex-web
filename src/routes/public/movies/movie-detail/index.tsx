import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import dayjs from "dayjs";

import { get_casts } from "@apis/casts";
import { get_movie } from "@apis/movies";

import { LONG_DATE_FORMAT } from "@libs/utils/constants";
import { addImagePrefix } from "@libs/utils/helpers";
import { Cast, Crew, MovieInfo } from "@libs/utils/types";

const MovieDetail = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState<MovieInfo>()
  const [casts, setCasts] = useState<{ Id: number, Cast: Array<Cast>, Crew: Array<Crew> }>()
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)

    const getMovie = async () => {
      if (id) {
        const responeMovie = await get_movie({ id })

        setIsLoading(false);
        setMovie(responeMovie);
      }
    }

    const getCasts = async () => {
      if (id) {
        const responeCasts = await get_casts({ movieId: id })

        setCasts(responeCasts.data);
      }
    }

    getMovie()
    getCasts()
  }, [id])

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="flex w-52 flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100dvh-5rem)] container mx-auto p-4">
      {movie ? (
        <div className="card w-full bg-base-100 shadow-xl">
          <h1 className="card-title text-2xl mb-6">{movie.Title}</h1>

          <figure>
            <img src={addImagePrefix(movie.poster_path)} alt="Movie Poster" className="h-[400px] rounded-lg" />
          </figure>
          <div className="card-body">
            <div className="flex gap-2 flex-wrap">
              {movie.Genres.map((genre) => (
                <div className="badge badge-primary badge-outline" key={genre.ID}>{genre.Name}</div>
              ))}
            </div>

            <p className="text-neutral-700">{movie.Overview}</p>

            <div className="flex gap-6 items-center">
              <div className="flex gap-1.5 items-center">
                <span className="icon-star-fill-micro text-yellow-500" />
                <span className="text-neutral-700">
                  <span className="font-medium">
                    {movie.vote_average}
                  </span>
                  <span className="text-neutral-500">
                    / 10
                  </span>
                </span>
                <span className="text-neutral-500 text-sm">{movie.vote_count} votes</span>
              </div>

              <button className="btn btn-primary btn-outline rounded-full min-h-8 h-8 py-0">
                <span className="icon-star-micro" />
                Rate
              </button>
            </div>

            <p className="text-neutral-700">Release Date: {dayjs(movie.release_date).format(LONG_DATE_FORMAT)}</p>
            <p className="text-neutral-700">Original Language: {movie.original_language}</p>
            <p className="text-neutral-700">Adult: {movie.Adult ? "Yes" : "No"}</p>
            <p className="text-neutral-700">Popularity: {movie.Popularity}</p>
            <p className="text-neutral-700">Video: {movie.Video ? "Yes" : "No"}</p>

            {casts && casts.Cast.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="flex gap-3 text-xl font-semibold items-center">
                  Casts
                  <span className="text-neutral-500 text-sm font-normal">
                    {casts.Cast.length}
                  </span>
                </h3>
                <div className="carousel carousel-center w-full glass rounded-box space-x-4 p-4">
                  {casts.Cast?.map((cast) => (
                    <Link to={`/casts/${cast.ID}`} key={cast.ID} className="carousel-item flex flex-col items-center">
                      <div className="avatar">
                        <div className="w-32 rounded-full md:w-40">
                          <img src={addImagePrefix(cast.profile_path)} alt={cast.Name} className="rounded-full bg-contain" />
                        </div>
                      </div>
                      <p className="text-neutral-700 font-bold text-sm">{cast.Name}</p>
                      <p className="text-neutral-500 truncate max-w-36 text-xs">{cast.Character}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="card-actions">
              <div className="flex gap-2">
                <button className="btn btn-primary">Add to Watchlist</button>
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
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import dayjs from "dayjs";

import { get_cast } from "@apis/casts";
import { get_movies } from "@apis/movies";

import Detail from "@components/Detail";

import { LONG_DATE_FORMAT } from "@libs/utils/constants";
import { addImagePrefix } from "@libs/utils/helpers";
import { CastInfo, Movie } from "@libs/utils/types";

const Cast = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [cast, setCast] = useState<CastInfo>()
  const [movies, setMovies] = useState<Array<Movie>>()

  useEffect(() => {
    setIsLoading(true);

    const getMovies = async () => {
      if (id) {
        const responeMovies = await get_movies({ actors: id });

        setMovies(responeMovies?.results);
      }
    }

    const getCast = async () => {
      if (id) {
        const responeCast = await get_cast({ id })

        setIsLoading(false);
        setCast(responeCast.data as CastInfo);
      }
    }

    getCast()
    getMovies()
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
      {cast ? (
        <div className="card w-full glass shadow-xl">
          <h1 className="card-title text-2xl m-3">{cast.name}</h1>

          <figure>
            <img src={addImagePrefix(cast.profile_path)} alt="Cast Profile" className="h-[400px] rounded-lg" />
          </figure>

          <div className="card-body">
            <p className="text-neutral dark:text-neutral-content line-clamp-5">{cast.biography}</p>

            <Detail title="Born on:">
              {dayjs(cast.birthday).format(LONG_DATE_FORMAT)}
            </Detail>

            <Detail title="Place of Birth:">
              {cast.place_of_birth}
            </Detail>

            <div className="flex flex-col gap-2">
              <h3 className="flex gap-3 text-xl font-semibold items-center">
                Actor
              </h3>

              {movies && movies.length > 0 && (
                <div className="collapse bg-base-200">
                  <input type="checkbox" />
                  <div className="collapse-title text-xl font-medium">Known for</div>
                  <div className="collapse-content space-y-2">
                    {movies?.map((movie) => (
                      <Link to={`/movies/${movie.id}`} key={movie.id} className="flex items-center gap-4">
                        <div className="w-16 rounded-full md:w-24">
                          <img src={addImagePrefix(movie.poster_path)} alt={movie.title} className="rounded-lg bg-contain" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-gray-700">{movie.title}</p>
                          <div className="flex gap-1.5 items-center">
                            <span className="icon-star-fill-micro text-yellow-500" />
                            <span className="text-neutral dark:text-primary">
                              <span className="font-medium text-primary">
                                {movie.vote_average}
                              </span>
                              <span className="text-neutral-500">
                                / 10
                              </span>
                            </span>
                            <span className="text-neutral-500 text-sm">{movie.vote_count} votes</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <h2>Cast not Found</h2>
      )}
    </div>
  )
}

export default {
  path: '/casts/:id',
  main: Cast,
}
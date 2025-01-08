import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import dayjs from "dayjs";

import { get_cast } from "@apis/casts";

import Detail from "@components/Detail";

import { LONG_DATE_FORMAT, YEAR_FORMAT } from "@libs/utils/constants";
import { addImagePrefix, parseGender } from "@libs/utils/helpers";
import { CastInfo } from "@libs/utils/types";

const Cast = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [cast, setCast] = useState<CastInfo>()

  useEffect(() => {
    setIsLoading(true);

    const getCast = async () => {
      if (id) {
        const responeCast = await get_cast({ id })

        setIsLoading(false);
        setCast(responeCast.data as CastInfo);
      }
    }

    getCast()
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
          <h1 className="card-title text-2xl m-3">{cast.Name}</h1>

          <figure>
            <img src={addImagePrefix(cast.ProfilePath)} alt="Cast Profile" className="h-[400px] rounded-lg" />
          </figure>

          <div className="card-body">
            <p className="text-neutral dark:text-neutral-content line-clamp-5">{cast.Biography}</p>

            <Detail title="Gender:">
              {parseGender(cast.Gender)}
            </Detail>

            <Detail title="Born on:">
              {dayjs(cast.Birthday).format(LONG_DATE_FORMAT)}
            </Detail>

            <Detail title="Place of Birth:">
              {cast.PlaceOfBirth}
            </Detail>

            {cast.MovieCredit.CastMovie && cast.MovieCredit.CastMovie.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="collapse bg-base-200">
                  <input type="checkbox" />
                  <div className="collapse-title text-xl font-medium">Known for</div>
                  <div className="collapse-content space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cast.MovieCredit.CastMovie?.map((movie) => (
                        <Link to={`/movies/${movie.Id}`} key={movie.Id} className="flex items-center gap-4 border border-primary rounded-es-lg">
                          <div className="w-14 rounded-full md:w-16">
                            <img src={addImagePrefix(movie.PosterPath)} alt={movie.Title} className="rounded-es-lg bg-contain min-w-14 md:min-w-16 md:min-h-24" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="text-neutral dark:text-neutral-content">{movie.Title}</p>
                            <div className="flex gap-1.5 items-center">
                              <span className="icon-star-fill-micro text-yellow-500" />
                              <span className="text-neutral dark:text-primary">
                                <span className="font-medium text-primary">
                                  {movie.VoteAverage}
                                </span>
                              </span>
                            </div>
                            <div className="text-neutral dark:text-neutral-content text-xs">{dayjs(movie.ReleaseDate).format(YEAR_FORMAT)}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
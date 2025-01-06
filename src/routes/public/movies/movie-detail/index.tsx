import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import dayjs from "dayjs";

import { get_casts } from "@apis/casts";
import { get_movie, get_movie_reviews } from "@apis/movies";

import Detail from "@components/Detail";

import { LONG_DATE_FORMAT } from "@libs/utils/constants";
import { addImagePrefix } from "@libs/utils/helpers";
import { Cast, Crew, MovieInfo, Review } from "@libs/utils/types";

const MovieDetail = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState<MovieInfo>()
  const [casts, setCasts] = useState<{ Id: number, Cast: Array<Cast>, Crew: Array<Crew> }>()
  const [reviews, setReviews] = useState<Array<Review>>()
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

    const getMovieReviews = async () => {
      if (id) {
        const responeReviews = await get_movie_reviews({ id })

        setReviews(responeReviews?.results);
      }
    }

    getMovie()
    getCasts()
    getMovieReviews()
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
        <div className="card w-full glass shadow-xl">
          <h1 className="card-title text-2xl m-3">{movie.Title}</h1>

          <figure>
            <img src={addImagePrefix(movie.poster_path)} alt="Movie Poster" className="h-[400px] rounded-lg" />
          </figure>
          <div className="card-body">
            <p className="text-neutral dark:text-neutral-content">{movie.Overview}</p>

            <div className="flex gap-6 items-center">
              <div className="flex gap-1.5 items-center">
                <span className="icon-star-fill-micro text-yellow-500" />
                <span className="text-neutral dark:text-neutral-content">
                  <span className="font-medium">
                    {movie.vote_average}
                  </span>
                  <span className="text-neutral-500">
                    / 10
                  </span>
                </span>
                <span className="text-neutral-500 text-sm">{movie.vote_count} votes</span>
              </div>

              <button className="btn btn-warning btn-outline rounded-full min-h-8 h-8 py-0">
                <span className="icon-star-micro" />
                Rate
              </button>
            </div>

            <Detail title="Genres:" titleClassName="min-w-fit">
              <div className="carousel carousel-center w-full rounded-box space-x-4">
                {movie.Genres.map((genre) => (
                  <div className="badge badge-neutral-content badge-outline min-w-fit flex-nowrap" key={genre.ID}>{genre.Name}</div>
                ))}
              </div>
            </Detail>

            <Detail title="Release Date:">
              {dayjs(movie.release_date).format(LONG_DATE_FORMAT)}
            </Detail>

            <Detail title="Original Language:">
              {movie.original_language}
            </Detail>

            <Detail title="Popularity:">
              {movie.Popularity}
            </Detail>

            <Detail title="Production Companies:" titleClassName="min-w-fit">
              <div className="carousel carousel-center rounded-box space-x-2">
                {movie.production_companies.map((comp) => (
                  <div className="badge badge-neutral-content badge-outline min-w-fit flex-nowrap" key={comp.ID}>{comp.Name}</div>
                ))}
              </div>
            </Detail>

            {casts && casts.Cast.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="flex gap-3 text-xl font-semibold items-center">
                  Casts
                  <span className="text-neutral-500 text-sm font-normal">
                    {casts.Cast.length}
                  </span>
                </h3>
                <div className="carousel carousel-center w-full shadow-inner rounded-box space-x-4 p-4">
                  {casts.Cast?.map((cast) => (
                    <Link to={`/casts/${cast.ID}`} key={cast.ID} className="carousel-item flex flex-col items-center">
                      <div className="avatar">
                        <div className="w-32 rounded-full md:w-40">
                          <img src={addImagePrefix(cast.profile_path)} alt={cast.Name} className="rounded-full bg-contain" />
                        </div>
                      </div>
                      <p className="text-neutral dark:text-neutral-content font-bold text-sm">{cast.Name}</p>
                      <p className="text-neutral-500 truncate max-w-36 text-xs">{cast.Character}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="card-actions">
              <div className="flex gap-2">
                <button className="btn btn-warning rounded-xl">Add to Watchlist</button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mt-2">Reviews</h2>
              <div className="flex flex-col gap-4">
                {reviews?.map((review) => (
                  <div key={review.ID} className="chat chat-start">
                    <div className="chat-header">
                      {review.Author}
                    </div>
                    <div className="chat-bubble">
                      <p className="break-words overflow-hidden  line-clamp-3">
                        {review.Content}
                      </p>
                      <Link
                        className="text-blue-500 inline-block mt-0"
                        to={review.URL}
                        target="_blank">
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h2>Movie not Found</h2>
      )
      }
    </div >
  );
};

export default {
  path: '/movies/:id',
  main: MovieDetail
}
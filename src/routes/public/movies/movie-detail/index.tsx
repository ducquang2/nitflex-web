import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";

import dayjs from "dayjs";

import { add_review, get_llm_movies, get_movie, get_movie_reviews, get_trailer } from "@apis/movies";

import Detail from "@components/Detail";

import { add_favorite, add_rating, add_to_watch_list } from "@apis/profile";
import MoviesSection from "@components/MoviesSection";
import { useToast } from "@libs/hooks/useToast";
import { LONG_DATE_FORMAT } from "@libs/utils/constants";
import { addImagePrefix, parseYoutubeLink } from "@libs/utils/helpers";
import { MovieInfo, Review } from "@libs/utils/types";

const MovieDetail = () => {
  const { id } = useParams();

  const toast = useToast();

  const [movie, setMovie] = useState<MovieInfo>()
  const [reviews, setReviews] = useState<Array<Review>>()
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState("");
  const [isGettingRelatedMovies, setIsGettingRelatedMovies] = useState(false);
  const [relatedMovies, setRelatedMovies] = useState<MovieInfo[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string>();

  useEffect(() => {
    setIsLoading(true);

    const getMovie = async () => {
      if (id) {
        const responeMovie = await get_movie({ id });
        setIsLoading(false);
        setMovie(responeMovie);

        if (responeMovie?.TmdbId) {
          const trailerResponse = await get_trailer({ id: responeMovie?.TmdbId.toString() });
          if (trailerResponse.length > 0) {
            setTrailerUrl(parseYoutubeLink(trailerResponse[0].key));
          }
        }
      }
    };

    getMovie();
  }, [id]);

  useEffect(() => {
    const getMovieReviews = async () => {
      if (movie?.Id) {
        const responeReviews = await get_movie_reviews({ id: movie.Id.toString() })

        setReviews(responeReviews);
      }
    }

    const getRelatedMovies = async () => {
      setIsGettingRelatedMovies(true);

      if (movie?.Title) {
        const response = await get_llm_movies({ query: movie?.Title });

        setIsGettingRelatedMovies(false);
        setRelatedMovies(response.results);
      }
    }

    getRelatedMovies()
    getMovieReviews()
  }, [movie])

  const handleAddToWatchList = async () => {
    if (!movie) return;

    try {
      const response = await add_to_watch_list({ movie_id: movie.TmdbId.toString() })

      if (response) {
        toast.success('Added to Watchlist');
      }

    } catch (error) {
      console.error(error);
      toast.error('Failed to add to Watchlist');
    }
  }

  const handleRating = async () => {
    if (!movie) return;

    try {
      const response = await add_rating({ movie_id: movie.TmdbId.toString(), rating: selectedRating });

      if (response) {
        toast.success('Rated Successfully!');
      }

    } catch (error) {
      console.error(error);
      toast.error('Failed to rate the movie');
    }
  }

  const handleAddToFavorite = async () => {
    if (!movie) return;

    try {
      const response = await add_favorite({ movie_id: movie.TmdbId.toString() });

      if (response) {
        toast.success('Added to Favorites');
      }

    } catch (error) {
      console.error(error);
      toast.error('Failed to add to Favorites');
    }
  }

  const handleAddReview = async () => {
    if (!movie || !reviewContent.trim()) return;

    try {
      const response = await add_review({
        movie_id: movie.Id.toString(),
        content: reviewContent
      });

      if (response) {
        toast.success('Review added successfully!');
        setReviewContent("");

        if (movie.Id) {
          const updatedReviews = await get_movie_reviews({ id: movie.Id.toString() });
          setReviews(updatedReviews);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add review');
    }
  };

  const showRatingModal = () => {
    if (document) {
      // @ts-expect-error - TS doesn't know that dialog is a valid element
      document.getElementById('rating_modal')?.showModal()
    }
  }

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

          <figure className="relative flex gap-3">
            <img src={addImagePrefix(movie.PosterPath)} alt="Movie Poster" className="h-[400px] rounded-lg" />
            {movie.Adult && (
              <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <p className="text-sm">18+</p>
              </div>
            )}
            {trailerUrl && (
              <div className="flex w-1/2 rounded-react-player">
                <ReactPlayer
                  url={trailerUrl}
                  width="100%"
                  height="400px"
                  controls
                />
              </div>
            )}
          </figure>
          <div className="card-body">
            <p className="text-neutral dark:text-neutral-content">{movie.Overview}</p>

            <div className="flex gap-6 items-center">
              <div className="flex gap-1.5 items-center">
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

              <button
                className="btn btn-warning btn-outline rounded-full min-h-8 h-8 py-0"
                onClick={showRatingModal}
              >
                <span className="icon-star-micro" />
                Rate
              </button>
            </div>

            <Detail title="Genres:" titleClassName="min-w-fit">
              <div className="carousel carousel-center w-full rounded-box space-x-4">
                {movie.Genres.map((genre, idx) => (
                  <div className="badge badge-neutral-content badge-outline min-w-fit flex-nowrap" key={idx}>{genre.Name}</div>
                ))}
              </div>
            </Detail>

            <Detail title="Release Date:">
              {dayjs(movie.ReleaseDate).format(LONG_DATE_FORMAT)}
            </Detail>

            <Detail title="Original Language:">
              {movie.OriginalLanguage}
            </Detail>

            <Detail title="Popularity:">
              {movie.Popularity}
            </Detail>

            <Detail title="Production Companies:" titleClassName="min-w-fit">
              <div className="carousel carousel-center rounded-box space-x-2">
                {movie.ProductionCompanies.map((comp) => (
                  <div className="badge badge-neutral-content badge-outline min-w-fit flex-nowrap" key={comp.Name}>{comp.Name}</div>
                ))}
              </div>
            </Detail>

            {movie.Credits.Cast && movie.Credits.Cast.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="flex gap-3 text-xl font-semibold items-center">
                  Casts
                  <span className="text-neutral-500 text-sm font-normal">
                    {movie.Credits.Cast.length}
                  </span>
                </h3>
                <div className="carousel carousel-center w-full shadow-inner rounded-box space-x-4 p-4">
                  {movie.Credits.Cast?.map((cast) => (
                    <Link to={`/casts/${cast.Id}`} key={cast.CastId} className="carousel-item flex flex-col items-center">
                      <div className="avatar">
                        <div className="w-32 rounded-full md:w-40">
                          <img src={addImagePrefix(cast.ProfilePath)} alt={cast.Name} className="rounded-full bg-contain" />
                        </div>
                      </div>
                      <p className="text-neutral dark:text-neutral-content font-bold text-sm">{cast.Name}</p>
                      <p className="text-neutral-500 truncate max-w-36 text-xs">{cast.Character}</p>
                    </Link>
                  )
                  )}
                </div>
              </div>
            )}

            <div className="card-actions">
              <div className="flex gap-2">
                <button
                  className="btn btn-warning rounded-xl"
                  onClick={handleAddToWatchList}>
                  <i className="icon-circle-plus-micro" />
                  Add to Watchlist
                </button>
                <button
                  className="btn btn-error rounded-xl"
                  onClick={handleAddToFavorite}>
                  <i className="icon-heart-micro" />
                  Add to Favorite
                </button>
              </div>
            </div>

            <MoviesSection
              title="Related Movies"
              isLoading={isGettingRelatedMovies}
              movies={relatedMovies}
              titleClassName="text-xl font-semibold mt-2"
            />

            <div>
              <h2 className="text-xl font-semibold mt-2">Reviews</h2>

              <div className="mt-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Add your review</span>
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      className="textarea textarea-bordered flex-1"
                      placeholder="Write your review here..."
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleAddReview}
                      disabled={!reviewContent.trim()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {reviews?.map((review) => (
                  <div key={review.Id} className="chat chat-start">
                    <div className="chat-header">
                      {review.Author}
                    </div>
                    <div className="chat-image avatar">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-10 rounded-full">
                          <span className="text-3xl">{review.Author.slice(0, 1)}</span>
                        </div>
                      </div>
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
      )}

      <dialog id="rating_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-primary">Rate the movie!</h3>
          <div className="rating mt-2">
            {[...Array(10)].map((_, index) => (
              <input
                key={index}
                type="radio"
                name="rating-1"
                className="mask mask-star"
                checked={selectedRating === index + 1}
                onChange={() => setSelectedRating(index + 1)}
              />
            ))}
          </div>
          <div className="modal-action">
            <button className="btn" onClick={handleRating}>Submit</button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default {
  path: '/movies/:id',
  main: MovieDetail
}
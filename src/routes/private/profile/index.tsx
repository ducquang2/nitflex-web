import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import classNames from 'classnames';

import { get_favorite_movies, get_user_profile, get_user_ratings, get_watch_list, remove_favorite, remove_from_watch_list } from '@apis/profile';
import MovieCard from '@components/MovieCard';
import { MovieInfo, Rating, User } from '@libs/utils/types';

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [watchList, setWatchList] = useState<MovieInfo[]>([]);
  const [favoriteList, setFavoriteList] = useState<MovieInfo[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [activeTab, setActiveTab] = useState<'ratings' | 'watchlist' | 'favorites'>('ratings');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const getWatchList = async () => {
      const watchListResp = await get_watch_list();
      setWatchList(watchListResp);
      setIsLoading(false);
    }

    const getFavoriteList = async () => {
      const favoriteListResp = await get_favorite_movies();
      setFavoriteList(favoriteListResp.data.Results);
      setIsLoading(false);
    }

    const getUserProfile = async () => {
      const userResp = await get_user_profile();
      setUser(userResp);
    }

    const getRatings = async () => {
      const ratingsResp = await get_user_ratings();
      setRatings(ratingsResp);
      setIsLoading(false);
    }

    getUserProfile();
    if (activeTab === 'watchlist') getWatchList();
    if (activeTab === 'favorites') getFavoriteList();
    if (activeTab === 'ratings') getRatings();
  }, [navigate, activeTab]);

  const handleRemoveFromWatchList = async (movieId: number) => {
    await remove_from_watch_list({ movie_id: movieId.toString() });
    setWatchList(watchList.filter(movie => movie.Id !== movieId));
  };

  const handleRemoveFromFavoriteList = async (movieId: number) => {
    await remove_favorite({ movie_id: movieId.toString() });
    setFavoriteList(favoriteList.filter(movie => movie.Id !== movieId));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'ratings':
        return (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl mb-2">My Ratings</h2>
              {isLoading ? (
                (<div className="flex justify-center items-center">
                  <span className="loading loading-infinity loading-lg" />
                </div>)
              ) :
                ratings?.length === 0 ? (
                  <div className="alert alert-warning">
                    <div>
                      <span>You haven't rated any movies yet.</span>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {ratings?.map((rating) => (
                      <li key={rating.MovieId}>
                        <MovieCard
                          movie={rating.Movie}
                          rating={rating.Rating}
                        />
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
        );

      case 'watchlist':
        return (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl mb-2">Watch List</h2>
              {isLoading ? (
                (<div className="flex justify-center items-center">
                  <span className="loading loading-infinity loading-lg" />
                </div>)
              ) :
                watchList?.length === 0 ? (
                  <div className="alert alert-warning">
                    <div>
                      <span>Your watch list is empty.</span>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {watchList?.map((movie) => (
                      <li key={movie.Id}>
                        <MovieCard
                          movie={movie}
                          onRemove={() => handleRemoveFromWatchList(movie.Id)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl mb-2">Favorite Movies</h2>
              {isLoading ? (
                (<div className="flex justify-center items-center">
                  <span className="loading loading-infinity loading-lg" />
                </div>)
              ) : favoriteList?.length === 0 ? (
                <div className="alert alert-warning">
                  <div>
                    <span>Your favorite movies list is empty.</span>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {favoriteList?.map((movie) => (
                    <li key={movie.Id}>
                      <MovieCard
                        movie={movie}
                        onRemove={() => handleRemoveFromFavoriteList(movie.Id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] container mx-auto p-4">
      <div className="card w-full glass shadow-xl">
        <h1 className="card-title text-2xl m-3">Profile</h1>

        <div className="card-body">
          {user && (
            <div className="card bg-base-100 shadow-xl mb-4">
              <div className="card-body">
                <h2 className="card-title">User Information</h2>
                <p><strong>Name:</strong> {user.Username}</p>
                <p><strong>Email:</strong> {user.Email}</p>
              </div>
            </div>
          )}

          <div className="tabs tabs-boxed mb-4">
            <button
              className={classNames("tab", { 'tab-active': activeTab === 'ratings' })}
              onClick={() => setActiveTab('ratings')}
            >
              Ratings
            </button>
            <button
              className={classNames("tab", { 'tab-active': activeTab === 'watchlist' })}
              onClick={() => setActiveTab('watchlist')}
            >
              Watch List
            </button>
            <button
              className={classNames("tab", { 'tab-active': activeTab === 'favorites' })}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default {
  path: '/profile',
  main: Profile,
}
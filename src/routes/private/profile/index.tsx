import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get_favorite_movies, get_user_profile, get_watch_list } from '@apis/profile';

import { addImagePrefix } from '@libs/utils/helpers';
import { MovieInfo, User } from '@libs/utils/types';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [watchList, setWatchList] = useState<MovieInfo[]>([]);
  const [favoriteList, setFavoriteList] = useState<MovieInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getWatchList = async () => {
      const watchListResp = await get_watch_list();
      setWatchList(watchListResp);
    }

    const getFavoriteList = async () => {
      const favoriteListResp = await get_favorite_movies();
      setFavoriteList(favoriteListResp.data.Results);
    }

    const getUserProfile = async () => {
      const userResp = await get_user_profile();
      setUser(userResp);
    }

    getUserProfile();
    getWatchList();
    getFavoriteList();
  }, [navigate]);

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl mb-2">Watch List</h2>
              <ul className="space-y-2">
                {watchList?.map((movie) => (
                  <li key={movie.Id} className="card card-side bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <figure>
                      <img src={addImagePrefix(movie.PosterPath)} alt={movie.Title} className="min-h-24 min-w-16 object-cover rounded-l-lg" />
                    </figure>
                    <div className="card-body p-4">
                      <h3 className="card-title">{movie.Title}</h3>
                      <p className="line-clamp-2">{movie.Overview}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl mb-2">Favorite Movies</h2>
              <ul className="space-y-2">
                {favoriteList?.map((movie) => (
                  <li key={movie.Id} className="card card-side bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <figure>
                      <img src={addImagePrefix(movie.PosterPath)} alt={movie.Title} className="min-h-24 min-w-16 object-cover rounded-l-lg" />
                    </figure>
                    <div className="card-body p-4">
                      <h3 className="card-title">{movie.Title}</h3>
                      <p className="line-clamp-2">{movie.Overview}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  path: '/profile',
  main: Profile,
}
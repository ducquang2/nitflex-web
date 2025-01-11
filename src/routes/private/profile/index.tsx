import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get_watch_list, get_favorite_movies } from '@apis/profile';

import { MovieInfo } from '@libs/utils/types';

const Profile = () => {
  // const [user, setUser] = useState<{ username: string } | null>(null);
  const [watchList, setWatchList] = useState<MovieInfo[]>([]);
  const [favoriteList, setFavoriteList] = useState<MovieInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getWatchList = async () => {
      const watchListResp = await get_watch_list();

      console.log(watchListResp);

      setWatchList(watchListResp);
    }

    const getFavoriteList = async () => {
      const favoriteListResp = await get_favorite_movies();
      setFavoriteList(favoriteListResp.data.Results);
    }

    getWatchList();
    getFavoriteList();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100dvh-5rem)] container mx-auto p-4">
      <div className="card w-full glass shadow-xl">
        <h1 className="card-title text-2xl m-3">Profile</h1>

        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl mb-2">Watch List</h2>
              <ul className="space-y-2">
                {watchList?.map((movie) => (
                  <li key={movie.Id} className="hover:bg-base-300 p-2 rounded-lg cursor-pointer">
                    {movie.Title}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl mb-2">Favorite Movies</h2>
              <ul className="space-y-2">
                {favoriteList?.map((movie) => (
                  <li key={movie.Id} className="hover:bg-base-300 p-2 rounded-lg cursor-pointer">
                    {movie.Title}
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
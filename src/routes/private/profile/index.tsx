import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get_watch_list } from '@apis/profile';

import { MovieInfo } from '@libs/utils/types';

const Profile = () => {
  // const [user, setUser] = useState<{ username: string } | null>(null);
  const [watchList, setWatchList] = useState<MovieInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getWatchList = async () => {
      const watchListResp = await get_watch_list();

      console.log(watchListResp);

      setWatchList(watchListResp);
    }

    getWatchList();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100dvh-5rem)] container mx-auto p-4">
      <div className="card w-full glass shadow-xl">
        <h1 className="card-title text-2xl m-3">Profile</h1>

        <div className="card-body">
          <h2 className="text-xl">Watch List</h2>
          <ul>
            {watchList?.map((movie) => (
              <li key={movie.Id}>
                {movie.Title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default {
  path: '/profile',
  main: Profile,
}
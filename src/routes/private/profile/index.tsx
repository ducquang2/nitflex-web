import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get_watch_list } from '@apis/profile';
import { useAuth } from '@components/AuthProvider';

const Profile = () => {
  const { token, setToken } = useAuth();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [watchList, setWatchList] = useState<Array<any>>([]);
  const navigate = useNavigate();

  useEffect(() => {

    const getWatchList = async () => {
      const watchListResp = await get_watch_list();

      setWatchList(watchListResp.data.results);
    }

    const fetchProfile = async () => {
      try {

        // const data = await response.json();
        // setUser(data);
      } catch (error) {
        // console.error(error);
        // navigate('/login');
      }
    };
    fetchProfile();

    getWatchList();
  }, [token, navigate]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100%-5rem)] flex items-center justify-center bg-base-200">
      <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Profile</h2>
          <p>Email: {user.username}</p>
          <button onClick={handleLogout} className="btn btn-primary mt-4">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  path: '/profile',
  main: Profile,
}
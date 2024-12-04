import { useAuth } from '@components/AuthProvider';

const Home = () => {
  const { token } = useAuth();

  return (
    <div className="hero h-[calc(100%-5rem)] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            NitFlex - Movies/Books recommendation web
          </h1>
          <div>
            {token ? (
              <p className="py-6">Welcome back, user!</p>
            ) : (
              <p className="py-6">
                A web application built with React, providing a seamless and secure user registration experience.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
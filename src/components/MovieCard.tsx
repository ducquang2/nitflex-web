import { Link } from 'react-router-dom';

import { addImagePrefix } from '@libs/utils/helpers';
import { MovieInfo } from '@libs/utils/types';

interface MovieCardProps {
  movie: MovieInfo;
  rating?: number;
  onRemove?: () => void;
}

const MovieCard = ({ movie, rating, onRemove }: MovieCardProps) => {
  return (
    <Link
      to={`/movies/${movie.Id}`}
      className="block card card-side bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 relative group"
    >
      <figure>
        <img
          src={addImagePrefix(movie.PosterPath)}
          alt={movie.Title}
          className="h-32 w-24 object-cover rounded-l-lg"
        />
      </figure>
      <div className="card-body p-4">
        <h3 className="card-title">{movie.Title}</h3>
        {rating && (
          <div className="flex items-center gap-2">
            <span className="icon-star-fill-micro text-yellow-500" />
            <span className="font-bold">{rating}</span>
            <span className="text-neutral-500">/10</span>
          </div>
        )}
        <p className="line-clamp-2">{movie.Overview}</p>
        {onRemove && (
          <button
            className="btn btn-error btn-sm absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
          >
            <i className="icon-trash-fill-micro" />
          </button>
        )}
      </div>
    </Link>
  );
};

export default MovieCard; 
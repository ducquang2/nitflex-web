import { Link } from "react-router-dom";

import { splitToSmallChunks } from "@libs/utils/helpers";
import { Movie } from "@libs/utils/types";

export { MovieList };

type MovieListProps = {
  images: Array<Movie>;
}

function MovieList(props: MovieListProps) {
  const { images } = props

  const gridImages = splitToSmallChunks([...images], 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {gridImages.map((collumn, index) => (
        <div className="grid gap-4" key={index}>
          {collumn.map((movie) => (
            <div key={movie.id}>
              <Link to={`/movies/${movie.id}`} className="text-blue-500">
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={movie.poster_path}
                  alt={movie.title}
                />
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}


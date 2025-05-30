import React from "react";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import { getTrendingMovies } from "../api/tmdb-api";
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import { Movie } from "../types/interfaces";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, { titleFilter, genreFilter } from "../components/movieFilterUI";

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};
const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};

const TrendingMoviesPage: React.FC = () => {
  const { data: movies = [], error, isLoading, isError } = useQuery<Movie[], Error>(
    "trending",
    getTrendingMovies
  );
  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering]
  );

  if (isLoading) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    const updatedFilterSet =
      type === "title"
        ? [changedFilter, filterValues[1]]
        : [filterValues[0], changedFilter];
    setFilterValues(updatedFilterSet);
  };

  const displayedMovies = filterFunction(movies);

  return (
    <>
      <PageTemplate
        title="Most trending Movies"
        movies={displayedMovies}
        action={(movie) => <AddToFavouritesIcon {...movie} />}
      />
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
      />
    </>
  );
};

export default TrendingMoviesPage;
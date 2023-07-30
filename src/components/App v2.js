import { useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import Main from "./Main/Main";

import Search from "./Navbar/Search";
import Logo from "./Navbar/Logo";
import NumResults from "./Navbar/NumResults";

import Box from "./Main/Box";

import MovieList from "./Main/ListBox/MovieList";

import WatchedSummary from "./Main/WatchedBox/WatchedSummary";
import WatchedList from "./Main/WatchedBox/WatchedList";

import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

import MovieDetail from "./Main/ListBox/MovieDetail";

const KEY = "8c7b56ba";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  const [query, setQuery] = useState("");

  // const tempQuery = "sex education";

  const handlDeleteWatchedMovie = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  const handleSelectMovie = (id) => {
    setSelectedID(selectedID === id ? null : id);
  };

  const handleCloseMovie = () => {
    setSelectedID(null);
  };

  const handleWatchedMovie = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setError("");
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("something went wrong with fetching movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message);
          console.log(e.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    handleCloseMovie();
    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        {/* Explitly passing the component as props */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} />
            </>
          }
        /> */}

        {/* //implicitly passing in component into the box with the children prop== component composition */}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetail
              watched={watched}
              apiKey={KEY}
              onMovieClose={handleCloseMovie}
              selectedID={selectedID}
              onAddWatched={handleWatchedMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                onDeleteWatchedMovie={handlDeleteWatchedMovie}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

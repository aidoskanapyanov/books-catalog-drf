import { useEffect, useState } from "react";
import {
  Link,
  RouterProvider,
  createBrowserRouter,
  useParams,
} from "react-router-dom";

const BookForm = () => {
  const { id } = useParams();
  const onSubmit = (e) => {
    e.preventDefault();
    const rating = e.target.elements.rating.value;
    const text = e.target.elements.text.value;
    fetch(`http://localhost:8000/books/${id}/write_a_review/`, {
      method: "POST",
      body: JSON.stringify({ rating, text }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("admin@admin.com:admin")}`,
      },
    });
    window.location.reload();
    alert("Review added!");
  };

  return (
    <div>
      <div className="py-2">Add your review:</div>
      <form className="rounded-md border p-4" onSubmit={onSubmit}>
        <label htmlFor="rating" className="block pb-2">
          Rating:
        </label>
        <input type="number" name="rating" className="rounded-sm border px-2" />
        <label htmlFor="text" className="block pb-2">
          Text:
        </label>
        <textarea name="text" className="w-full rounded-sm border p-2" />
        <button className="rounded-md bg-slate-700 px-3 py-2 text-white hover:bg-slate-700/80">
          Add review
        </button>
      </form>
    </div>
  );
};

const Book = () => {
  const [book, setBook] = useState();
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/books/${id}/`)
      .then((res) => res.json())
      .then((book) => setBook(book));
  }, [id]);

  if (!book) return <div>Loading</div>;

  return (
    <div className="mx-auto max-w-xl p-4">
      <div className="pb-4">
        <Link
          to="/"
          className="text-blue-500 underline underline-offset-2 hover:no-underline"
        >
          Go back to list
        </Link>
      </div>
      <div className="flex-col items-stretch justify-center rounded-lg border p-6">
        <div className="pb-4 text-3xl">{book.title}</div>
        <img className="pb-2" src={book.image_url} />
        <div>
          <span className="font-semibold">Average rating:</span>{" "}
          {parseFloat(book.average_rating).toFixed(2)}
        </div>
        <div className="pb-2">
          <span className="font-semibold">Publication date:</span>{" "}
          {book.publication_date}
        </div>
        <div>
          <div className="pb-2 font-semibold">Genres:</div>
          <div className="flex flex-wrap gap-2 pb-2 text-xs">
            {book.genres.map((genre) => {
              return (
                <div
                  key={genre}
                  className="rounded-lg border bg-gray-50 px-3 py-2"
                >
                  {genre}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="pb-2 font-semibold">Authors:</div>
          <div className="flex flex-wrap gap-2 pb-2 text-xs">
            {book.authors.map((author) => {
              return (
                <div
                  key={author}
                  className="rounded-lg border bg-gray-50 px-3 py-2"
                >
                  {author}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="font-semibold">Description:</div>
          <div className="pb-2">{book.description}</div>
        </div>
        <div>{book.is_favorite ? "⭐" : ""}</div>
      </div>
      <BookForm />
      <div className="py-4">Reviews:</div>
      <div className="flex flex-col items-stretch justify-center gap-2">
        {book.reviews.map((review) => {
          return (
            <div
              key={review.full_name}
              className="flex flex-col items-stretch justify-center gap-2 rounded-lg border p-4"
            >
              <div>{review.full_name}</div>
              <div>{review.text}</div>
              <div>{review.rating}/5</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BooksFilterForm = ({ setFilter }) => {
  const [authors, setAuthors] = useState();
  const [genres, setGenres] = useState();

  useEffect(() => {
    fetch("http://localhost:8000/authors/")
      .then((res) => res.json())
      .then((authors) => setAuthors(authors));

    fetch("http://localhost:8000/genres/")
      .then((res) => res.json())
      .then((genres) => setGenres(genres));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const start_date = e.target.elements.start_date.value;
    const end_date = e.target.elements.end_date.value;
    const author = e.target.elements.author.value;
    const genre = e.target.elements.genre.value;
    setFilter({
      publication_date__gte: start_date,
      publication_date__lte: end_date,
      authors__name__icontains: author,
      genres__name__icontains: genre,
    });
  };

  if (!authors) return <div>Loading</div>;
  if (!genres) return <div>Loading</div>;

  return (
    <div className="mx-auto my-8 flex max-w-sm flex-col items-stretch justify-center rounded-md border p-4 px-10">
      <div className="pb-4 text-xl font-semibold">Filter books by:</div>
      <form onSubmit={onSubmit}>
        <label htmlFor="start_date" className="block">
          Start date:
        </label>
        <input
          type="date"
          name="start_date"
          className="mb-4 border px-2"
        ></input>
        <label htmlFor="end_date" className="block">
          End date:
        </label>
        <input
          type="date"
          name="end_date"
          className="mb-4 block border px-2"
        ></input>
        <label htmlFor="author" className="block">
          Author:
        </label>
        <input list="authors" className="block border p-2" name="author" />
        <datalist id="authors">
          {authors.map((author) => {
            return <option key={author.name} value={author.name} />;
          })}
        </datalist>
        <label htmlFor="author" className="block">
          Genre:
        </label>
        <input list="genres" className="block border p-2" name="genre" />
        <datalist id="genres">
          {genres.map((genre) => {
            return <option key={genre.name} value={genre.name} />;
          })}
        </datalist>
        <button className="mt-2 rounded-md bg-slate-700 px-3 py-2 text-white hover:bg-slate-700/80">
          Filter
        </button>
      </form>
    </div>
  );
};

function Books() {
  const [url, setUrl] = useState("http://localhost:8000/books/");
  const [books, setBooks] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    console.log(url);

    const newUrl = new URL(url);
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        newUrl.searchParams.set(key, value);
      }
    }
    fetch(newUrl)
      .then((res) => res.json())
      .then((books) => setBooks(books));
  }, [url, filter]);

  if (!books) return <div>Loading</div>;

  return (
    <div className="mx-auto h-screen max-w-screen-xl p-4">
      <h1 className="pb-4 text-center text-4xl">Books catalog app</h1>
      <BooksFilterForm setFilter={setFilter} />
      <ul className="grid grid-cols-2 gap-4 pb-10 md:grid-cols-4">
        {books &&
          books.results!.map((book) => {
            return (
              <Link
                to={`/books/${book.id}`}
                key={book.id}
                className="rounded-lg border p-4 hover:shadow-md"
              >
                <div
                  key={book.id}
                  className="flex-col items-stretch justify-center"
                >
                  <div className="pb-4 text-xl">{book.title}</div>
                  <img className="pb-2" src={book.image_url} />
                  <div>
                    <span className="font-semibold">Average rating:</span>{" "}
                    {parseFloat(book.average_rating).toFixed(2)}
                  </div>
                  <div className="pb-2">
                    <span className="font-semibold">Publication date:</span>{" "}
                    {book.publication_date}
                  </div>
                  <div>
                    <div className="pb-2 font-semibold">Genres:</div>
                    <div className="flex flex-wrap gap-2 pb-2 text-xs">
                      {book.genres.map((genre) => {
                        return (
                          <div
                            key={genre}
                            className="rounded-lg border bg-gray-50 px-3 py-2"
                          >
                            {genre}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="pb-2 font-semibold">Authors:</div>
                    <div className="flex flex-wrap gap-2 pb-2 text-xs">
                      {book.authors.map((author) => {
                        return (
                          <div
                            key={author}
                            className="rounded-lg border bg-gray-50 px-3 py-2"
                          >
                            {author}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>{book.is_favorite ? "⭐" : "☆"}</div>
                </div>
              </Link>
            );
          })}
      </ul>
      <div className="flex items-center justify-center gap-4 pb-10">
        <button
          onClick={() => {
            if (books.previous === null) {
              alert("No previous page");
              return;
            }
            setUrl(books.previous);
          }}
          className="text-blue-500 underline underline-offset-2 hover:no-underline"
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (books.next === null) {
              alert("No next page");
              return;
            }
            setUrl(books.next);
          }}
          className="text-blue-500 underline underline-offset-2 hover:no-underline"
        >
          Next
        </button>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Books />,
  },
  {
    path: "/books/:id",
    element: <Book />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

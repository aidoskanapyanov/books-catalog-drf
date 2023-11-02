import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  Link,
  RouterProvider,
  useParams,
} from "react-router-dom";

const Book = () => {
  const [book, setBook] = useState();
  let { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/books/${id}/`)
      .then((res) => res.json())
      .then((book) => setBook(book));
  }, [id]);

  if (!book) return <div>Loading</div>;

  return (
    <div className="mx-auto max-w-xl p-4">
      <Link
        to="/"
        className="text-blue-500 underline underline-offset-2 hover:no-underline"
      >
        Go back to list
      </Link>
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
                <div className="rounded-lg border bg-gray-50 px-3 py-2">
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
                <div className="rounded-lg border bg-gray-50 px-3 py-2">
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
      <div className="py-4">Reviews:</div>
      <div className="flex flex-col items-stretch justify-center gap-2">
        {book.reviews.map((review) => {
          return (
            <div className="flex flex-col items-stretch justify-center gap-2 rounded-lg border p-4">
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

function Books() {
  const [url, setUrl] = useState("http://localhost:8000/books/");
  const [books, setBooks] = useState();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((books) => setBooks(books));
  }, [url]);

  if (books) console.log(books);

  return (
    <div className="h-screen p-4">
      <h1 className="pb-4 text-center text-4xl">Books catalog app</h1>
      <ul className="grid grid-cols-4 gap-4 pb-10">
        {books &&
          books.results.map((book) => {
            return (
              <Link
                to={`/books/${book.id}`}
                key={book.id}
                className="rounded-lg border p-4 hover:shadow-md"
              >
                <div className="flex-col items-stretch justify-center">
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
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
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
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
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
          onClick={() => setUrl(books.previous)}
          className="text-blue-500 underline underline-offset-2 hover:no-underline"
        >
          Previous
        </button>
        <button
          onClick={() => setUrl(books.next)}
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

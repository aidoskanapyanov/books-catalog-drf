# books-catalog-drf

Books catalog web app written in python, django-rest-framework

# Book Catalog Project Design Document

## Project Requirements

1.  Use Django Rest Framework (DRF)
2.  Write clean and well-structured code
3.  Implement a clean and organized architecture
4.  Utilize the SQLite database
5.  Create SEO-friendly endpoints (where necessary, optional)
6.  Optionally, use drf-yasg and Swagger for API documentation

## Project Description

The goal of this project is to create a Book Catalog web application with the ability to leave reviews and ratings for books. The catalog should categorize books by genres and authors. The main page should display a list of books with filtering options for genres, authors, and publication dates. The book list should include book title, genre, author, and average rating. Users should be able to click on a book to access its details, including the book description, publication date, and a list of reviews (including author, rating, and review text).

Users should also have the ability to mark books as favorites, and the book list should indicate which books are in the user's favorites.

Additionally, the project should include user registration and authentication via email, with two options: with confirmation and without confirmation. Content creation and management should be handled through the admin panel.

## Some implementation notes

- Client side is a very quick mockup with React. There are a lot of optimizations to be made (i.e. state management, query management, seo etc.)
- Backend api documentation doesn't show relevant info for some @action routes in viewsets. Mainly because some fieds are scoped out in `permissions.py` during the runtime.
- Filtering was done via string matching, which could be optimized by writing filters from scratch or doing foreign key matching.
- Client side uses Basic Auth for testing purposes. Can be improved with JWT auth and state management and persistence.
- Handle some potential n+1 queries.

## Running Locally

### Client

1. cd into client folder:

```sh
cd client
```

2. Install dependencies using pnpm:

```sh
pnpm install
```

3. Start the development server:

```sh
pnpm dev
```

### Backend

1. Install dependencies via poetry:

```sh
poetry install --no-root
```

2. Migrate:

```sh
python manage.py migrate
```

3. Setup mock data for the backend:

```sh
python manage.py runscript setup_mock_data
```

4. Start dev server:

```sh
python manage.py runserver
```

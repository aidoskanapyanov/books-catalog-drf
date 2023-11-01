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

## Project Components

1.  **Django Rest Framework (DRF):** The project will be built using DRF to create API endpoints for managing books, genres, authors, reviews, and user-related operations.
2.  **SQLite Database:** The project will use an SQLite database for data storage.
3.  **SEO Optimization:** SEO-friendly endpoints will be implemented where necessary to enhance search engine visibility.
4.  **drf-yasg and Swagger Documentation (Optional):** drf-yasg and Swagger can be integrated to provide API documentation for easier development and testing.
5.  **User Authentication:** The project will include user registration and authentication via email, with options for both confirmed and unconfirmed registration.
6.  **Admin Panel:** Content creation and management will be handled through the Django admin panel.

## Endpoints

- **GET /api/books:** Retrieve a list of books with filtering options.
- **GET /api/books/{book_id}:** Retrieve details for a specific book, including its reviews.
- **POST /api/books/{book_id}/reviews:** Add a review for a book.
- **PUT /api/books/{book_id}/reviews/{review_id}:** Update a review for a book.
- **DELETE /api/books/{book_id}/reviews/{review_id}:** Delete a review for a book.
- **POST /api/books/{book_id}/favorite:** Add a book to favorites.
- **DELETE /api/books/{book_id}/favorite:** Remove a book from favorites.
- **POST /api/auth/register:** Register a new user.
- **POST /api/auth/login:** Log in as a registered user.
- **GET /api/auth/logout:** Log out the currently authenticated user.

## Architecture

The project will follow the Model-View-Controller (MVC) architectural pattern, with Django and DRF for building the web application. The components will be organized as follows:

- **Models:** These will represent the data structures, including books, genres, authors, reviews, and user-related data.
- **Views:** These will define the API endpoints and handle user requests.
- **Serializers:** These will convert complex data types, such as queryset and model instances, to native Python data types.
- **URLs:** These will map URLs to view functions, defining the API endpoints.
- **Templates:** HTML templates may be used for rendering the front-end, if required.

## Database Schema

The database schema will include tables for books, genres, authors, reviews, users, and user favorites.

## Admin Panel

The Django admin panel will be used for managing and populating the catalog with book data, genres, authors, and user accounts.

This design document outlines the key aspects of the Book Catalog project, including its requirements, components, endpoints, architecture, and database schema. The project aims to provide a user-friendly web application for managing and reviewing books, with an optional integration of API documentation for developers.

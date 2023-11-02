import random

from faker import Faker

from app.models import Author, Book, Genre, Review, User, UserProfile


def setup_genres():
    _genres = [
        'Graphic novel',
        'New adult fiction',
        'Contemporary literature',
        'Literary fiction',
        'Satire',
        'Horror fiction',
        'Mystery',
        'Magical Realism',
        'Drama',
        'Spirituality',
    ]
    Genre.objects.bulk_create([Genre(name=genre) for genre in _genres])


def setup_authors():
    faker = Faker()
    _authors = [faker.name() for _ in range(20)]
    Author.objects.bulk_create([Author(name=author) for author in _authors])


def setup_books():
    faker = Faker()
    _books = []
    for i in range(200):
        _title = faker.sentence()
        _description = faker.text()
        _publication_date = faker.date_between()
        _image_url = faker.image_url(width=480, height=640)
        _book = Book(
            title=_title,
            description=_description,
            publication_date=_publication_date,
            image_url=_image_url,
        )
        _books.append(_book)

    _created_books = Book.objects.bulk_create(_books)
    _all_genres = list(Genre.objects.all())
    _all_authors = list(Author.objects.all())

    for book in _created_books:
        _genres = random.sample(_all_genres, random.randint(1, 5))
        _authors = random.sample(_all_authors, random.randint(1, 5))
        book.genres.set(_genres)
        book.authors.set(_authors)


def setup_users():
    faker = Faker()
    _users = []
    for i in range(200):
        user = User(
            first_name=faker.first_name(),
            last_name=faker.last_name(),
            email=faker.unique.ascii_safe_email(),
            password='12345678',
            is_active=True,
        )
        _users.append(user)
    User.objects.bulk_create(_users)


def setup_reviews():
    faker = Faker()
    _books = list(Book.objects.all())

    _users = list(User.objects.all())
    _user_profiles = UserProfile.objects.bulk_create(
        [UserProfile(user=user) for user in _users]
    )

    _reviews = []
    for book in _books:
        for i in range(random.randint(1, 10)):
            _user_profile = random.choice(_user_profiles)
            _rating = random.randint(1, 5)
            _text = faker.text()
            _review = Review(book=book, user=_user_profile, rating=_rating, text=_text)
            _reviews.append(_review)

    Review.objects.bulk_create(_reviews)


def run():
    setup_genres()
    setup_authors()
    setup_users()
    setup_books()
    setup_reviews()

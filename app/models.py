from django.db import models
from django.contrib.auth.models import User


class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    publication_date = models.DateField()
    genres = models.ManyToManyField(Genre)
    authors = models.ManyToManyField(Author)

    def __str__(self):
        return self.title


class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    text = models.TextField()


class FavoriteBook(models.Model):
    user = models.ForeignKey('UserProfile', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)


# Additional user profile model to store user favorites
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorite_books = models.ManyToManyField(Book, through='FavoriteBook')

    def __str__(self):
        return self.user.username

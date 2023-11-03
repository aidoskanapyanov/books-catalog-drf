from django_filters.rest_framework import DjangoFilterBackend
from rest_access_policy import AccessViewSetMixin
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from app.models import Book, Review, Author, Genre
from app.permissions import BookAccessPolicy, AuthorAccessPolicy, GenreAccessPolicy
from app.serializers import (
    BookSerializer,
    ReviewSerializer,
    AuthorSerializer,
    GenreSerializer,
)


class BookViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'publication_date': ['gte', 'lte'],
        'genres__name': ['icontains'],
        'authors__name': ['icontains'],
    }
    access_policy = BookAccessPolicy

    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        book = self.get_object()
        if request.user.userprofile.favorite_books.filter(id=book.id).exists():
            request.user.userprofile.favorite_books.remove(book)
        else:
            request.user.userprofile.favorite_books.add(book)
        return self.retrieve(request, pk)

    @action(detail=True, methods=['post'])
    def write_a_review(self, request, pk=None):
        book = self.get_object()
        _user_profile = request.user.userprofile
        _rating = request.data.get('rating')
        _text = request.data.get('text')
        serializer = ReviewSerializer(
            data={
                'book': book.id,
                'user': _user_profile.id,
                'rating': _rating,
                'text': _text,
            }
        )
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return self.retrieve(request, pk)


class AuthorViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    access_policy = AuthorAccessPolicy
    pagination_class = None


class GenreViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    access_policy = GenreAccessPolicy
    pagination_class = None

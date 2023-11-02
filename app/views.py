from django_filters.rest_framework import DjangoFilterBackend
from rest_access_policy import AccessViewSetMixin
from rest_framework import viewsets
from rest_framework.decorators import action
from app.models import Book, Review
from app.permissions import BookAccessPolicy
from app.serializers import BookSerializer


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
        user_profile = request.user.userprofile
        rating = request.data.get('rating')
        text = request.data.get('text')
        Review.objects.create(
            book=book,
            user=user_profile,
            rating=rating,
            text=text,
        )
        return self.retrieve(request, pk)

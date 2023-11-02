from django.db.models import Avg
from rest_access_policy import FieldAccessMixin
from rest_framework import serializers

from app.models import Book, Review, UserProfile
from app.permissions import BookAccessPolicy


class ReviewSerializer(serializers.ModelSerializer):
    book = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Book.objects.all()
    )
    user = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=UserProfile.objects.all()
    )
    text = serializers.CharField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    email = serializers.StringRelatedField(source='user.user.email', read_only=True)
    full_name = serializers.StringRelatedField(
        source='user.user.get_full_name', read_only=True
    )

    class Meta:
        model = Review
        fields = [
            'id',
            'email',
            'full_name',
            'text',
            'rating',
            'book',
            'user',
        ]


class BookSerializer(FieldAccessMixin, serializers.ModelSerializer):
    title = serializers.CharField(read_only=True)
    authors = serializers.StringRelatedField(many=True, read_only=True)
    genres = serializers.StringRelatedField(many=True, read_only=True)
    publication_date = serializers.DateField(read_only=True)
    image_url = serializers.CharField(read_only=True)
    average_rating = serializers.SerializerMethodField(read_only=True)
    description = serializers.CharField(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField(read_only=True)
    rating = serializers.IntegerField(write_only=True, min_value=1, max_value=5)
    text = serializers.CharField(write_only=True)

    def get_average_rating(self, obj):
        return obj.reviews.aggregate(Avg('rating'))['rating__avg']

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if not request:
            return False
        if not request.user.is_authenticated:
            return False
        return request.user.userprofile.favorite_books.filter(id=obj.id).exists()

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'authors',
            'genres',
            'publication_date',
            'image_url',
            'average_rating',
            'description',
            'reviews',
            'is_favorite',
            'rating',
            'text',
        ]
        access_policy = BookAccessPolicy

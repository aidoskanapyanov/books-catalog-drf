from django.db.models import Avg
from rest_access_policy import FieldAccessMixin
from rest_framework import serializers

from app.models import Book, Review
from app.permissions import BookAccessPolicy


class ReviewSerializer(serializers.ModelSerializer):
    text = serializers.CharField()
    rating = serializers.IntegerField()
    username = serializers.StringRelatedField(source='user.user.username')

    class Meta:
        model = Review
        fields = [
            'id',
            'username',
            'text',
            'rating',
        ]


class BookSerializer(FieldAccessMixin, serializers.ModelSerializer):
    title = serializers.CharField()
    authors = serializers.StringRelatedField(many=True)
    genres = serializers.StringRelatedField(many=True)
    publication_date = serializers.DateField()
    image_url = serializers.CharField()
    average_rating = serializers.SerializerMethodField()
    description = serializers.CharField()
    reviews = ReviewSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        return obj.reviews.aggregate(Avg('rating'))['rating__avg']

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if not request:
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
        ]
        access_policy = BookAccessPolicy

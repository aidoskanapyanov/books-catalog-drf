from rest_framework import serializers
from app.models import Book
from django.db.models import Avg


class BookSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=200)
    authors = serializers.StringRelatedField(many=True)
    genres = serializers.StringRelatedField(many=True)
    publication_date = serializers.DateField()
    image_url = serializers.CharField(max_length=500)
    average_rating = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        return obj.reviews.aggregate(Avg('rating'))['rating__avg']

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
        ]

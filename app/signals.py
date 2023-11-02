from django.db.models.signals import post_save
from django.dispatch import receiver

from app.models import UserProfile

from django.contrib.auth import get_user_model


User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        import ipdb

        ipdb.set_trace()
        UserProfile.objects.get_or_create(user=instance)

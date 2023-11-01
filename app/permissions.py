from rest_access_policy import AccessPolicy


class BookAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list", "retrieve"],
            "principal": "*",
            "effect": "allow",
        },
    ]

    @classmethod
    def scope_fields(cls, request, fields: dict, instance=None) -> dict:
        if isinstance(instance, list):
            fields.pop('description', None)
            fields.pop('reviews', None)
        return fields

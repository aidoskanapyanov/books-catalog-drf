from rest_access_policy import AccessPolicy


class BookAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list", "retrieve"],
            "principal": "*",
            "effect": "allow",
        },
        {
            "action": ["toggle_favorite", "write_a_review"],
            "principal": "authenticated",
            "effect": "allow",
        },
    ]

    @classmethod
    def scope_fields(cls, request, fields: dict, instance=None) -> dict:
        if isinstance(instance, list):
            fields.pop('description', None)
            fields.pop('reviews', None)
        if 'write_a_review' not in request.get_full_path():
            fields.pop('rating', None)
            fields.pop('text', None)
        return fields

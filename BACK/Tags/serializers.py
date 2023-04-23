from rest_framework import serializers

from Tags.models import Tag

class TagSerializer(serializers.ModelSerializer):

    class Meta:
        unique_together = ('categoria', 'user')
        model = Tag
        fields = (
            'categoria',
            'cor',
            'user'        
        )
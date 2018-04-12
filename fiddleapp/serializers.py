from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Song, Sequence, Beat, SynthPreset


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

# class PresetSerializer(serializers.ModelSerializer):
    # class Meta:
        # model = SynthPreset
        # fields = ('')

class BeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beat
        fields = ('note', 'velocity', 'duration', 'octave', 'mute')

class SequenceSerializer(serializers.ModelSerializer):
    beats = BeatSerializer(many=True)
    # preset = PresetSerializer(many=False)
    class Meta:
        model = Sequence
        fields = ('id', 'beats', 'arrangement_index', 'sequence_index')

class SongSerializer(serializers.ModelSerializer):
    sequences = SequenceSerializer(many=True)
    class Meta:
        model = Song
        fields = ('id', 'title', 'sequences', 'bpm')

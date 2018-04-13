from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Song, Sequence, Beat, SynthPreset


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class PresetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SynthPreset
        fields = ('oscillator_type', 'amplifier_attack', 'amplifier_decay', 'amplifier_sustain', 'amplifier_release', 'distortion', 'filter_type', 'filter_rolloff', 'filter_frequency', 'filter_q', 'filter_envelope_attack', 'filter_envelope_decay', 'filter_envelope_sustain', 'filter_envelope_release', 'filter_envelope_base_frequency', 'filter_envelope_octaves', 'filter_envelope_exponent', 'delay_time', 'delay_feedback', 'delay_wet', 'reverb_size', 'reverb_dampening', 'reverb_wet')

class BeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beat
        fields = ('note', 'velocity', 'duration', 'octave', 'mute')

class SequenceSerializer(serializers.ModelSerializer):
    beats = BeatSerializer(many=True)
    preset = PresetSerializer(many=False, required=False)
    class Meta:
        model = Sequence
        fields = ('id', 'beats', 'arrangement_index', 'preset', 'sequence_index')

class SongSerializer(serializers.ModelSerializer):
    sequences = SequenceSerializer(many=True)
    class Meta:
        model = Song
        fields = ('id', 'title', 'sequences', 'bpm')

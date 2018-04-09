# add relationships
from django.db import models


class SynthPreset(models.Model):
    # stores synthesizer component values
    #sequence = models.ForeignKey(Sequence, null=True, blank=True)
    name = models.CharField(max_length=35, default="Unnamed Preset")

    # oscillator properties
    oscillator_type = models.CharField(max_length=35)

    # amplifier section
    amp_attack = models.FloatField()
    amp_decay = models.FloatField()
    amp_sutain = models.FloatField()
    amp_release = models.FloatField()

    distortion = models.FloatField()

    filter_type = models.CharField(max_length=35, default="lowpass")
    filter_rolloff = models.SmallIntegerField()
    filter_q = models.FloatField()

    filter_env_attack = models.FloatField()
    filter_env_decay = models.FloatField()
    filter_env_sustain = models.FloatField()
    filter_env_release = models.FloatField()
    filter_env_base_frequency = models.PositiveSmallIntegerField()
    filter_env_octaves = models.PositiveSmallIntegerField()
    filter_env_attack_curve = models.CharField(max_length=30)
    filter_env_release_curve = models.CharField(max_length=30)
    filter_env_exponent = models.FloatField()

    delay_time = models.FloatField()
    delay_feedback = models.FloatField()
    delay_wet = models.FloatField()

    reverb_dampening = models.FloatField()
    reverb_size = models.FloatField()
    reverb_wet = models.FloatField()

    def __str__(self):
        return self.name

class Song(models.Model):
    title = models.CharField(max_length=50, default="untitled")
    bpm = models.PositiveSmallIntegerField(default=120)
    preset = models.ManyToManyField(SynthPreset, related_name='song')

    def __str__(self):
        return self.name


class Sequence(models.Model):
    name = models.CharField(max_length=35, default="untitled")
    length = models.PositiveSmallIntegerField(default=8)
    scale_type = models.CharField(max_length=50, default="Chromatic")
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    preset = models.ForeignKey(SynthPreset, null=True, blank=True, on_delete=models.SET_NULL)


class Beat(models.Model):
    pitch_int = models.CharField(max_length=2)
    octave = models.PositiveSmallIntegerField(default=3)
    velocity = models.SmallIntegerField(default=5)
    sequence = models.ForeignKey(Sequence, on_delete=models.CASCADE)

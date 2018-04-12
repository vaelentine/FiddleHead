# add relationships
from django.db import models


class SynthPreset(models.Model):
    # stores synthesizer component values
    #sequence = models.ForeignKey(Sequence, null=True, blank=True)
    name = models.CharField(max_length=35, default="Unnamed Preset", null=True, blank=True)
    # oscillator properties
    oscillator_type = models.CharField(max_length=35, null=True, blank=True)

    # amplifier section
    amp_attack = models.FloatField(null=True, blank=True)
    amp_decay = models.FloatField(null=True, blank=True)
    amp_sutain = models.FloatField(null=True, blank=True)
    amp_release = models.FloatField(null=True, blank=True)

    distortion = models.FloatField(null=True, blank=True)

    filter_type = models.CharField(max_length=35, default="lowpass", null=True, blank=True)
    filter_rolloff = models.SmallIntegerField(default=-24, null=True, blank=True)
    filter_q = models.FloatField(null=True, blank=True)

    filter_env_attack = models.FloatField(null=True, blank=True)
    filter_env_decay = models.FloatField(null=True, blank=True)
    filter_env_sustain = models.FloatField(null=True, blank=True)
    filter_env_release = models.FloatField(null=True, blank=True)
    filter_env_base_frequency = models.PositiveSmallIntegerField(default=80,null=True, blank=True)
    filter_env_octaves = models.PositiveSmallIntegerField(default=8,null=True, blank=True)
    filter_env_attack_curve = models.CharField(max_length=30, default='exponential',null=True, blank=True)
    filter_env_release_curve = models.CharField(max_length=30, default='exponential',null=True, blank=True)
    filter_env_exponent = models.FloatField(null=True, blank=True)

    delay_time = models.FloatField(null=True, blank=True)
    delay_feedback = models.FloatField(null=True, blank=True)
    delay_wet = models.FloatField(null=True, blank=True)

    reverb_dampening = models.FloatField(null=True, blank=True)
    reverb_size = models.FloatField(null=True, blank=True)
    reverb_wet = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name

class Song(models.Model):
    title = models.CharField(max_length=50, default="untitled", null=True, blank=True)
    bpm = models.PositiveSmallIntegerField(default=120, null=True, blank=True)

    def __str__(self):
        return self.name


class Sequence(models.Model):
    sequence_index = models.PositiveSmallIntegerField(null=True, blank=True)
    arrangement_index = models.PositiveSmallIntegerField(null=True, blank=True)
    name = models.CharField(max_length=35, default="untitled")
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    preset = models.ForeignKey(SynthPreset, null=True, blank=True, on_delete=models.SET_NULL)


class Beat(models.Model):
    mute = models.BooleanField(default=False)
    duration = models.CharField(max_length=5, null=True, blank=True)
    note = models.CharField(max_length=2, null=True, blank=True)
    octave = models.PositiveSmallIntegerField(default=3)
    velocity = models.SmallIntegerField(default=5)
    sequence = models.ForeignKey(Sequence, on_delete=models.CASCADE)

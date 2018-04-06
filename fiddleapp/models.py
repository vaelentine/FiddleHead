# add relationships
from django.db import models


class SynthPreset(models.Model):
    # stores synthesizer component values
    #sequence = models.ForeignKey(Sequence, null=True, blank=True)
    name = models.CharField(max_length=35, default="Unnamed Preset")

    # oscillator properties
    osc_waveform = models.CharField(max_length=35)

    # amplifier section
    amp_gain = models.FloatField()
    amp_attack = models.FloatField()
    amp_decay = models.FloatField()
    amp_sutain = models.FloatField()
    amp_release = models.FloatField()

    # distortion applied after amp envelope (filter gain)
    distortion_amount = models.FloatField()
    distortion_wet = models.FloatField()

    # filter sections
    filter_type = models.CharField(max_length=35, default="lowpass")
    filter_frequency = models.FloatField()
    filter_resonance = models.FloatField()
    filter_attack = models.FloatField()
    filter_decay = models.FloatField()
    filter_sustain = models.FloatField()
    filter_release = models.FloatField()

    # lfo section
    lfo_waveform = models.CharField(max_length=50, default="sine")
    lfo_frequency = models.FloatField()
    lfo_depth = models.FloatField()
    lfo_sync_st = models.BooleanField()
    lfo_destination = models.CharField(max_length=100, null=True, blank=True)


    chorus_depth = models.FloatField()
    chorus_frequency = models.FloatField()
    chorus_delay = models.FloatField()
    chorus_feedback = models.FloatField()
    chorus_wet = models.FloatField()

    fbdk_delay_time = models.FloatField()
    fdbk_delay_fdbk = models.FloatField()
    fdbk_delay_wet = models.FloatField()

    reverb_dampening = models.FloatField()
    reverb_size = models.FloatField()
    reverb_wet = models.FloatField()

    def __str__(self):
        return self.name


class Song(models.Model):
    name = models.CharField(max_length=50, default="untitled")
    bpm = models.PositiveSmallIntegerField(default=120)
    preset = models.ManyToManyField(SynthPreset, related_name='song', null=True, blank=True)

    def __str__(self):
        return self.name


class Sequence(models.Model):
    name = models.CharField(max_length=35, default="untitled")
    length = models.PositiveSmallIntegerField(default=8)
    scale_type = models.CharField(max_length=50, default="Chromatic")
    root_note = models.CharField(max_length=2, default='C')
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    preset = models.ForeignKey(SynthPreset, null=True, blank=True, on_delete=models.SET_NULL)


class Beat(models.Model):
    pitch_int = models.CharField(max_length=2)
    octave = models.PositiveSmallIntegerField(default=3)
    velocity = models.SmallIntegerField(default=5)
    sequence = models.ForeignKey(Sequence, on_delete=models.CASCADE)

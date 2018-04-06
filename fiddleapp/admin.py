from django.contrib import admin
from .models import SynthPreset, Beat, Sequence, Song

admin.site.register(SynthPreset)
admin.site.register(Beat)
admin.site.register(Sequence)
admin.site.register(Song)

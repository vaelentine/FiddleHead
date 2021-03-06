# Generated by Django 2.0.4 on 2018-04-12 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fiddleapp', '0004_auto_20180409_2335'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='beat',
            name='pitch_int',
        ),
        migrations.RemoveField(
            model_name='sequence',
            name='length',
        ),
        migrations.RemoveField(
            model_name='sequence',
            name='scale_type',
        ),
        migrations.RemoveField(
            model_name='song',
            name='preset',
        ),
        migrations.AddField(
            model_name='beat',
            name='duration',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.AddField(
            model_name='beat',
            name='mute',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='beat',
            name='note',
            field=models.CharField(blank=True, max_length=2, null=True),
        ),
        migrations.AddField(
            model_name='sequence',
            name='arrangement_index',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sequence',
            name='sequence_index',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='song',
            name='bpm',
            field=models.PositiveSmallIntegerField(blank=True, default=120, null=True),
        ),
        migrations.AlterField(
            model_name='song',
            name='title',
            field=models.CharField(blank=True, default='untitled', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='amp_attack',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='amp_decay',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='amp_release',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='amp_sutain',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='delay_feedback',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='delay_time',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='delay_wet',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='distortion',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_env_attack',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_env_attack_curve',
            field=models.CharField(blank=True, default='exponential', max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_env_base_frequency',
            field=models.PositiveSmallIntegerField(blank=True, default=80, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_env_decay',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_env_exponent',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_env_octaves',
            field=models.PositiveSmallIntegerField(blank=True, default=8, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_env_release',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_env_release_curve',
            field=models.CharField(blank=True, default='exponential', max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_env_sustain',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_q',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_rolloff',
            field=models.SmallIntegerField(blank=True, default=-24, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='filter_type',
            field=models.CharField(blank=True, default='lowpass', max_length=35, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='name',
            field=models.CharField(blank=True, default='Unnamed Preset', max_length=35, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='oscillator_type',
            field=models.CharField(blank=True, max_length=35, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='reverb_dampening',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='reverb_size',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='synthpreset',
            name='reverb_wet',
            field=models.FloatField(blank=True, null=True),
        ),
    ]

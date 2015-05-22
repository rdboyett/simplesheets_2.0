# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('classrooms', '__first__'),
        ('userInfo_profile', '0002_livemonitorsession'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='livemonitorsession',
            name='userInfo',
        ),
        migrations.AddField(
            model_name='livemonitorsession',
            name='classroom',
            field=models.ForeignKey(default=1, to='classrooms.Classroom'),
            preserve_default=False,
        ),
    ]

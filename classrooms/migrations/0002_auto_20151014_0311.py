# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('classrooms', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='classuser',
            name='lockedChanges',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='classuser',
            name='studentID',
            field=models.CharField(max_length=45, null=True, blank=True),
            preserve_default=True,
        ),
    ]

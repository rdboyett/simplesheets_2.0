# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userInfo_profile', '0005_auto_20150518_2027'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mygrade',
            name='pointsEarned',
            field=models.FloatField(),
            preserve_default=True,
        ),
    ]

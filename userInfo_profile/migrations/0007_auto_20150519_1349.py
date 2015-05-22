# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userInfo_profile', '0006_auto_20150519_1348'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mygrade',
            name='average',
            field=models.FloatField(),
            preserve_default=True,
        ),
    ]

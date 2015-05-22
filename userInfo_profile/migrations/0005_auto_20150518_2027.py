# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userInfo_profile', '0004_myanswer_partialcredit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myanswer',
            name='partialCredit',
            field=models.FloatField(null=True, blank=True),
            preserve_default=True,
        ),
    ]

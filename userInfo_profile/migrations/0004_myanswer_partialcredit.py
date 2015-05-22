# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userInfo_profile', '0003_auto_20150512_2028'),
    ]

    operations = [
        migrations.AddField(
            model_name='myanswer',
            name='partialCredit',
            field=models.IntegerField(null=True, blank=True),
            preserve_default=True,
        ),
    ]

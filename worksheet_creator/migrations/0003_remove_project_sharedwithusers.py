# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('worksheet_creator', '0002_auto_20150601_0248'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='sharedWithUsers',
        ),
    ]

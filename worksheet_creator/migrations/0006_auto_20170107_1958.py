# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('worksheet_creator', '0005_project_sharedwithusers'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='backimage',
            options={'ordering': ['imagePath']},
        ),
    ]

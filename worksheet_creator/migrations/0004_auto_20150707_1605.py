# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('worksheet_creator', '0003_remove_project_sharedwithusers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sharedwithuser',
            name='user',
        ),
        migrations.DeleteModel(
            name='SharedWithUser',
        ),
    ]

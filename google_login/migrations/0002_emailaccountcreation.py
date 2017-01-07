# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('google_login', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailAccountCreation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dateTime', models.DateTimeField(auto_now=True)),
                ('username', models.CharField(max_length=60)),
                ('email', models.EmailField(max_length=75)),
                ('bUsed', models.BooleanField(default=False)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]

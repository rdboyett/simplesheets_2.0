# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('worksheet_creator', '__first__'),
        ('userInfo_profile', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LiveMonitorSession',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('answers', models.ManyToManyField(to='userInfo_profile.MyAnswer', null=True, blank=True)),
                ('project', models.ForeignKey(to='worksheet_creator.Project')),
                ('userInfo', models.ForeignKey(to='userInfo_profile.UserInfo')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]

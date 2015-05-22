# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('worksheet_creator', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MyAnswer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('myAnswer', models.TextField(null=True, blank=True)),
                ('bCorrect', models.BooleanField(default=True)),
                ('workImagePath', models.FilePathField(null=True, blank=True)),
                ('answer', models.ForeignKey(to='worksheet_creator.FormInput')),
                ('project', models.ForeignKey(to='worksheet_creator.Project')),
            ],
            options={
                'ordering': ['project', 'userInfo'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MyGrade',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pointsPossible', models.IntegerField()),
                ('pointsEarned', models.IntegerField()),
                ('average', models.IntegerField()),
                ('timesGraded', models.IntegerField()),
                ('dateTime', models.DateTimeField(auto_now_add=True)),
                ('highestGrade', models.BooleanField(default=False)),
                ('project', models.ForeignKey(to='worksheet_creator.Project')),
            ],
            options={
                'ordering': ['project', 'userInfo'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('school', models.CharField(max_length=65, null=True, blank=True)),
                ('teacher_student', models.CharField(max_length=45, null=True, blank=True)),
                ('title', models.CharField(max_length=3, null=True, blank=True)),
                ('projects', models.ManyToManyField(to='worksheet_creator.Project', null=True, blank=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='mygrade',
            name='userInfo',
            field=models.ForeignKey(to='userInfo_profile.UserInfo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='myanswer',
            name='userInfo',
            field=models.ForeignKey(to='userInfo_profile.UserInfo'),
            preserve_default=True,
        ),
    ]

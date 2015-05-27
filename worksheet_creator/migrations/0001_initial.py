# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BackImage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('imagePath', models.FilePathField()),
                ('pageNumber', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='FormInput',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pageNumber', models.IntegerField()),
                ('inputType', models.CharField(max_length=45)),
                ('left', models.FloatField()),
                ('top', models.FloatField()),
                ('width', models.FloatField()),
                ('height', models.FloatField()),
                ('option1', models.CharField(max_length=45, null=True, blank=True)),
                ('option2', models.CharField(max_length=45, null=True, blank=True)),
                ('option3', models.CharField(max_length=45, null=True, blank=True)),
                ('option4', models.CharField(max_length=45, null=True, blank=True)),
                ('option5', models.CharField(max_length=45, null=True, blank=True)),
                ('correctAnswer', models.TextField(null=True, blank=True)),
                ('questionNumber', models.IntegerField()),
                ('points', models.IntegerField(default=1)),
                ('helpText', models.TextField(null=True, blank=True)),
                ('helpLink', models.URLField(null=True, blank=True)),
                ('workImagePath', models.FilePathField(null=True, blank=True)),
                ('bTeacherGraded', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['questionNumber'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('dateTime', models.DateTimeField(auto_now_add=True)),
                ('originalFileID', models.CharField(max_length=65, null=True, blank=True)),
                ('uploadedFileID', models.CharField(max_length=65, null=True, blank=True)),
                ('thumb', models.FilePathField(null=True, blank=True)),
                ('status', models.CharField(default=b'active', max_length=10)),
                ('numberOfRetry', models.IntegerField(default=2)),
                ('ownerID', models.IntegerField(null=True, blank=True)),
                ('backgroundImages', models.ManyToManyField(to='worksheet_creator.BackImage')),
                ('formInputs', models.ManyToManyField(to='worksheet_creator.FormInput', null=True, blank=True)),
            ],
            options={
                'ordering': ['dateTime', 'title'],
            },
            bases=(models.Model,),
        ),
    ]

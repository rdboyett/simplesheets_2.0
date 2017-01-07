# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('worksheet_creator', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SharedWithUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dateShared', models.DateTimeField(auto_now_add=True)),
                ('dateTouched', models.DateTimeField(auto_now_add=True)),
                ('copyCreated', models.BooleanField(default=False)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterModelOptions(
            name='project',
            options={'ordering': ['modifiedDate', 'title']},
        ),
        migrations.AddField(
            model_name='project',
            name='modifiedDate',
            field=models.DateTimeField(auto_now_add=True, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='project',
            name='shared',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='project',
            name='sharedWithUsers',
            field=models.ManyToManyField(to='worksheet_creator.SharedWithUser', null=True, blank=True),
            preserve_default=True,
        ),
    ]

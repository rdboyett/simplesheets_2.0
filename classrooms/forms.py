from django import forms

CHOICES = [('Teacher', 'Teacher'),('Student','Student')]

class ChangeTeacherForm(forms.Form):
    username = forms.CharField(label='Student or Teacher Username', max_length=100)
    teacherStudent = forms.ChoiceField(widget=forms.RadioSelect, choices=CHOICES)
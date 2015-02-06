from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class MyRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ('password1', 'password2')

class ContactForm(forms.Form):
    password1 = forms.CharField(max_length=30,
                        widget=forms.PasswordInput(attrs={'title': 'password', 'class':'form-control', 'placeholder':'Password...', 'autofocus':'true'}))
    password2 = forms.CharField(max_length=30,
                        widget=forms.PasswordInput(attrs={'title': 'repeat password', 'class':'form-control', 'placeholder':'Re-Type Password...'}))

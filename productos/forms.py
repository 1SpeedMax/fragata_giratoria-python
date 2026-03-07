from django import forms
from .models import Producto, UnidadMedida

class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = '__all__'
        widgets = {
            'fecha_registro': forms.DateInput(attrs={'type': 'date'}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['unidad_medida'].queryset = UnidadMedida.objects.all()
        self.fields['unidad_medida'].empty_label = "-- Selecciona una unidad --"
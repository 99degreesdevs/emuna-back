import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { PackageCustomDto } from '../dto/create-package.dto';

export function IsUniqueCategory(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isUniqueCategory',
      target: object.constructor,
      propertyName: propertyName, 
      options: validationOptions,
      validator: {
        validate(value: PackageCustomDto[], args: ValidationArguments) {
          if (!Array.isArray(value)) return false;

          const categories = value.map(item => item.category);
          const uniqueCategories = new Set(categories);
          return uniqueCategories.size === categories.length; // Devuelve true si todos son únicos
        },
        defaultMessage(args: ValidationArguments) {
          console.log('paso por aquí')
          return 'Las categorías de los ítems en un paquete deben ser únicas. Solo se permite incluir una de cada categoría.';
        },
      },
    });
  };
}

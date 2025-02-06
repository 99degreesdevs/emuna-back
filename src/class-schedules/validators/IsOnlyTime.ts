import { registerDecorator,  ValidationOptions } from 'class-validator';

export function IsOnlyTime(validationOptions?: ValidationOptions) {

  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `El formato y rango de -${propertyName}- va  de las  00:00:00 a 24:00:00, además de ser un string de 8 caracteres.`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) { 
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
          return typeof value === 'string' && regex.test(value) && value.length === 8 && typeof value === 'string';
        },
      },
    });
  };
}
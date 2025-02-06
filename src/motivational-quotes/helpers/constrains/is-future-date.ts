import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import * as moment from 'moment';


@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {



    // const date = new Date(value);
    // console.log("now",new Date())
    // console.log("###",date)
    // return date > new Date();


    const dateTocompare = moment(value);
    const currentDate = moment(); 


    return dateTocompare.isSameOrAfter(currentDate); 

  }

  defaultMessage(): string {
    return 'Date must be in the future';
  }
}

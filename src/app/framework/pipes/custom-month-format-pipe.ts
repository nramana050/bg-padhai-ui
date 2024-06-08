import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customMonthFormat'
})
export class CustomMonthFormatPipe implements PipeTransform {
  transform(value: string): string {
    // Check if the value is null
    if (value === null) {
      return ''; // Return an empty string or another default value
    }

    const monthAbbreviations = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];

    try {
      const dateObject = new Date(value);

      // Check if the date is valid
      if (isNaN(dateObject.getTime())) {
        return ''; // Return an empty string or another default value
      }

      const dayNumber = dateObject.getDate();
      const monthNumber = dateObject.getMonth();
      const yearNumber = dateObject.getFullYear();
      return dayNumber + " " + monthAbbreviations[monthNumber] + " " + yearNumber;
    } catch (error) {
      return ''; // Return an empty string or another default value
    }
  }
}

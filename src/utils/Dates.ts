
export function getBanDateString(current_date: Date): string {

    const current_month: number = current_date.getMonth() + 1;
    const current_day: number = current_date.getDate();
    const current_year: number = current_date.getFullYear();

    return `${current_month}-${current_day}-${current_year}`;
}

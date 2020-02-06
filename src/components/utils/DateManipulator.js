export function addDays(date1, days) {
    let result = new Date(date1);
    result.setDate(result.getDate() + days);
    return result;
}

export function subDays(date1, days) {
    let result = new Date(date1);
    result.setDate(result.getDate() - days);
    return result;
}
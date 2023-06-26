import ExtractData from "../extractData";

export default function getMonthDay(dia) {
    const fullDate = dia.split('T')[0];
    const partsDate = fullDate.split('-');
    const day = partsDate[2];
    const month = partsDate[1];
    return `${day}/${month}`;
}

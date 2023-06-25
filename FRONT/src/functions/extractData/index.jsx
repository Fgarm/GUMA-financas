import formatarData from "../formatData";

export default function ExtractData(dia) {
    const data = dia.split('T')[0];
    return formatarData(data);
};

export default function formatarData(data) {
    const partesData = data.split('-');
    const dia = partesData[2];
    const mes = partesData[1];
    const ano = partesData[0];
    return `${dia}/${mes}/${ano}`;
  }

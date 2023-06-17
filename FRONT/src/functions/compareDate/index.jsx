export default function compareDate(data){
    var dataAtual = new Date();
    var partesData = data.split('/');
    var diaFornecido = parseInt(partesData[0], 10);
    var mesFornecido = parseInt(partesData[1], 10) - 1; // Os meses em JavaScript são baseados em zero
    var anoFornecido = parseInt(partesData[2], 10);
    var dataFornecida = new Date(anoFornecido, mesFornecido, diaFornecido);

  if (
    dataFornecida.getDate() === dataAtual.getDate() &&
    dataFornecida.getMonth() === dataAtual.getMonth() &&
    dataFornecida.getFullYear() === dataAtual.getFullYear()
    ) {
      return true;
      } else {
        return false;
      }
  }

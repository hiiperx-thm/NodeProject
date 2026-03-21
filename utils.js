const nomArrelsRandom = [
  'datos',
  'usuario',
  'registro',
  'info',
  'resultado',
  'contenedor',
];

export const toXML = (data) => {
  // let textRebut = '{"key1":value1,"key2":value2,"key3":value3}';
  let textRebut = data;
  textRebut = textRebut.replaceAll('{', '');
  textRebut = textRebut.replaceAll('}', '');
  textRebut = textRebut.replaceAll('\"', '');

  let keyValues = textRebut.split(',');

  const indiceAleatorio = Math.floor(Math.random() * nomArrelsRandom.length);
  const arrelEscollida = nomArrelsRandom[indiceAleatorio];

  let xml = '';
  let continua = false;

  xml += `<${arrelEscollida}>\n`;

  for (let i = 0; i < keyValues.length; i++) {
    const keyValue = keyValues[i].split(':');

    if (keyValue.length === 2) {
      const tag = keyValue[0].trim();
      const value = keyValue[1].trim();
      xml += `  <${tag}>${value}</${tag}>\n`;
    } else {
      continua = true;
    }
  }

  continua
    ? (xml =
        'Error: El formato de entrada debe ser JSON válido. \nEjemplo: {"nombre": "Juan"}')
    : (xml += `</${arrelEscollida}>`);

  return xml;
};

export const toJson = (data) => {
  data = data.replace('<?xml version="1.0" encoding="UTF-8"?>', '').trim();

  let menorQ = [];
  let mayorQ = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i] == '<') menorQ.push(i);
    if (data[i] == '>') mayorQ.push(i);
  }

  let json = '{';
  let first = true;

  for (let i = 0; i < menorQ.length; i++) {
    let keyRaw = data.substring(menorQ[i] + 1, mayorQ[i]);

    if (keyRaw.includes('/')) continue;

    let value = data.substring(mayorQ[i] + 1, menorQ[i + 1]);

    if (value !== undefined && !value.includes('<') && value.trim() !== '') {
      if (!first) json += ',';

      let formattedValue = isNaN(value) ? `"${value.trim()}"` : value.trim();
      json += `"${keyRaw.trim()}":${formattedValue}`;
      first = false;
    }
  }

  json += '}';
  return json;
};

// @flow

const random = require('./randomData');

export type Property = {
  name: string,
  dataType: Array<string>,
  description: string,
};

export type ThingOrActionClass = {
  class: string,
  description: string,
  properties: Array<Property>,
};

const minimumNumberOfProperties = 5;
const maximumNumberOfProperties = 15;
const primitiveDataTypes = ['number', 'string', 'boolean', 'int', 'date'];

function randomSingleItemFromWords(words: Array<string>) {
  return words[Math.floor(Math.random() * words.length)];
}

function capitalizeWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// randomProperty creates a property with one of the allowed primitive types
// ignores references for now
function randomProperty(words: Array<string>): Property {
  return {
    name: randomSingleItemFromWords(words).toLowerCase(),
    dataType: [randomSingleItemFromWords(primitiveDataTypes)],
    description: 'No property description, either ;-)',
  };
}

function randomProperties(
  min: number,
  max: number,
  words: Array<string>,
): Array<Property> {
  const amount = Math.floor(Math.random() * (max - min) + min);
  const properties: Array<Property> = [];

  // filter words for lowercase words only
  const lowerCaseWords = words.filter(word => word.charAt(0).match(/[a-z]/));
  for (let i = 0; i < amount; i += 1) {
    properties.push(randomProperty(lowerCaseWords));
  }
  return properties;
}

// clasFromName can be used for both thing classes, as well as
// action classes
function classFromName(
  className: string,
  words: Array<string>,
): ThingOrActionClass {
  return {
    class: capitalizeWord(className),
    description: 'No description on this auto-generated thing',
    properties: randomProperties(
      minimumNumberOfProperties,
      maximumNumberOfProperties,
      words,
    ),
  };
}

function valueForType(type: string): string | number | boolean {
  switch (type) {
    case 'int': {
      return random.int();
    }
    case 'number': {
      return random.number();
    }
    case 'string': {
      return random.word();
    }
    case 'boolean': {
      return random.bool();
    }
    case 'date': {
      return random.date();
    }
    default:
      throw new Error(`unrecognized type: ${type}`);
  }
}

function vertexFromClass(schemaClass: ThingOrActionClass) {
  const props = schemaClass.properties.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.name]: valueForType(cur.dataType[0]),
    }),
    {},
  );

  return {
    class: schemaClass.class,
    ...props,
  };
}

module.exports = {
  classFromName,
  vertexFromClass,
  primitiveDataTypes,
};

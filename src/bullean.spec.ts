import Bullean from './bullean';

describe('new Bullean().parse()', () => {
  it('should parse a show if expression', () => {
    const bullean = new Bullean();
    const result = bullean.parse('hello=world');
    expect(result).toMatchObject({
      operator: '=',
      value: 'world',
      left: {
        name: 'hello',
        type: 'identifier'
      }
    });
  });

  it('should parse a complex show if expression', () => {
    const bullean = new Bullean();
    const result = bullean.parse('hello=world&&howdy=texas||foo=bar');
    expect(result).toMatchObject({
      operator: 'or',
      predicates: [
        {
          operator: 'and',
          predicates: [
            {
              left: {
                name: 'hello',
                type: 'identifier'
              },
              operator: '=',
              value: 'world'
            },
            {
              left: {
                name: 'howdy',
                type: 'identifier'
              },
              operator: '=',
              value: 'texas'
            }
          ]
        },
        {
          left: {
            name: 'foo',
            type: 'identifier'
          },
          operator: '=',
          value: 'bar'
        }
      ]
    });
  });

  it('should support order of operations', () => {
    const bullean = new Bullean();
    const result = bullean.parse('hello=world&&(howdy=texas||foo=bar)');
    expect(result).toMatchObject({
      operator: 'and',
      predicates: [
        {
          left: {
            name: 'hello',
            type: 'identifier'
          },
          operator: '=',
          value: 'world'
        },
        {
          operator: 'or',
          predicates: [
            {
              left: {
                name: 'howdy',
                type: 'identifier'
              },
              operator: '=',
              value: 'texas'
            },
            {
              left: {
                name: 'foo',
                type: 'identifier'
              },
              operator: '=',
              value: 'bar'
            }
          ]
        }
      ]
    });
  });
});

describe('new Bullean().eval()', () => {
  it('should correctly evaluate true', () => {
    const bullean = new Bullean({
      hello: 'world',
      howdy: 'texas'
    });
    const result = bullean.eval('hello=world');
    expect(result).toBe(true);
  });

  it('should correctly evaluate && to false', () => {
    const bullean = new Bullean({
      hello: 'world',
      howdy: 'texas'
    });
    const result = bullean.eval('hello=world&&howdy=texas');
    expect(result).toBe(false);
  });

  it('should correctly evaluate || to true', () => {
    const bullean = new Bullean({
      hello: 'world',
      howdy: 'texas'
    });
    const result = bullean.eval('hello=world||howdy=texas');
    expect(result).toBe(true);
  });
});

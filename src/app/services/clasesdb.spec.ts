import { User } from './clasesdb.ts';

//expect() evalúa el resultado de una operación. toBeTruthy es una validación-matcher que verficia que no sea Null,Undef o False.

describe('User', () => {
    it('should create an instance', () => {
      expect(new User()).toBeTruthy();
    });
  });
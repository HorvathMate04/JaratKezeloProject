import { describe, it, expect, beforeEach } from 'vitest';
import { JaratKezelo, NegativKesesException } from './JaratKezelo';

describe('JaratKezelo', () => {
    let jaratKezelo: JaratKezelo;

    beforeEach(() => {
        jaratKezelo = new JaratKezelo();
    });

    it('új járatot kell létrehoznia késés nélkül', () => {
        const indulas = new Date('2023-06-01T12:00:00Z');
        jaratKezelo.ujJarat('AB123', 'BUD', 'JFK', indulas);
        const aktualisIndulas = jaratKezelo.mikorIndul('AB123');
        expect(aktualisIndulas).toStrictEqual(indulas);
    });

    it('hibaüzenetet kell küldenie, ha létező járatszámot próbál hozzáadni', () => {
        jaratKezelo.ujJarat('AB123', 'BUD', 'JFK', new Date('2023-06-01T12:00:00Z'));
        expect(() => {
            jaratKezelo.ujJarat('AB123', 'BUD', 'JFK', new Date('2023-06-01T15:00:00Z'));
        }).toThrow('A(z) AB123 járatszám már létezik.');
    });

    it('képesnek kell lennie késést hozzáadni egy járathoz', () => {
        const indulas = new Date('2023-06-01T12:00:00Z');
        jaratKezelo.ujJarat('AB123', 'BUD', 'JFK', indulas);
        jaratKezelo.keses('AB123', 30);
        const vartIndulas = new Date(indulas.getTime());
        vartIndulas.setMinutes(indulas.getMinutes() + 30);
        const aktualisIndulas = jaratKezelo.mikorIndul('AB123');
        expect(aktualisIndulas).toStrictEqual(vartIndulas);
    });

    it('nem engedheti negatív késés hozzáadását', () => {
        jaratKezelo.ujJarat('AB123', 'BUD', 'JFK', new Date('2023-06-01T12:00:00Z'));
        jaratKezelo.keses('AB123', 30);
        expect(() => {
            jaratKezelo.keses('AB123', -40);
        }).toThrow(NegativKesesException);
    });

    it('vissza kell adnia az adott repülőtérről induló járatokat', () => {
        jaratKezelo.ujJarat('AB123', 'BUD', 'JFK', new Date('2023-06-01T12:00:00Z'));
        jaratKezelo.ujJarat('CD456', 'BUD', 'LHR', new Date('2023-06-01T14:00:00Z'));
        jaratKezelo.ujJarat('EF789', 'JFK', 'LHR', new Date('2023-06-01T16:00:00Z'));

        const jaratok = jaratKezelo.jaratokRepuloterrol('BUD');
        expect(jaratok).toEqual(['AB123', 'CD456']);
    });

    it('hibaüzenetet kell küldenie, ha nem létező járathoz próbál késést hozzáadni', () => {
        expect(() => {
            jaratKezelo.keses('XY999', 30);
        }).toThrow('A(z) XY999 járatszámú járat nem található.');
    });

    it('hibaüzenetet kell küldenie, ha nem létező járat indulási idejét próbálja lekérdezni', () => {
        expect(() => {
            jaratKezelo.mikorIndul('XY999');
        }).toThrow('A(z) XY999 járatszámú járat nem található.');
    });
});

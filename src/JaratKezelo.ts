class NegativKesesException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NegativKesesException";
    }
}

class Jarat {
    jaratSzam: string;
    repterHonnan: string;
    repterHova: string;
    indulas: Date;
    keses: number;

    constructor(jaratSzam: string, repterHonnan: string, repterHova: string, indulas: Date) {
        this.jaratSzam = jaratSzam;
        this.repterHonnan = repterHonnan;
        this.repterHova = repterHova;
        this.indulas = indulas;
        this.keses = 0;
    }
}

class JaratKezelo {
    private jaratok: Map<string, Jarat>;

    constructor() {
        this.jaratok = new Map();
    }

    ujJarat(jaratSzam: string, repterHonnan: string, repterHova: string, indulas: Date): void {
        if (this.jaratok.has(jaratSzam)) {
            throw new Error(`A(z) ${jaratSzam} járatszám már létezik.`);
        }
        const ujJarat = new Jarat(jaratSzam, repterHonnan, repterHova, indulas);
        this.jaratok.set(jaratSzam, ujJarat);
    }

    keses(jaratSzam: string, keses: number): void {
        const jarat = this.jaratok.get(jaratSzam);
        if (!jarat) {
            throw new Error(`A(z) ${jaratSzam} járatszámú járat nem található.`);
        }
        jarat.keses += keses;
        if (jarat.keses < 0) {
            jarat.keses -= keses;
            throw new NegativKesesException("A késés nem lehet negatív.");
        }
    }

    mikorIndul(jaratSzam: string): Date {
        const jarat = this.jaratok.get(jaratSzam);
        if (!jarat) {
            throw new Error(`A(z) ${jaratSzam} járatszámú járat nem található.`);
        }
        const indulasTenyleges = new Date(jarat.indulas);
        indulasTenyleges.setMinutes(indulasTenyleges.getMinutes() + jarat.keses);
        return indulasTenyleges;
    }

    jaratokRepuloterrol(repter: string): string[] {
        const jaratok: string[] = [];
        for (const jarat of this.jaratok.values()) {
            if (jarat.repterHonnan === repter) {
                jaratok.push(jarat.jaratSzam);
            }
        }
        return jaratok;
    }
}

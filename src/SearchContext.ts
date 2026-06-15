export class  SearchContext {
    notReferencedCount: number;
    ifTagSyntaxErrorCount: number;

    constructor() {
        this.notReferencedCount = 0;
        this.ifTagSyntaxErrorCount = 0;
    }

    reset() {
        const  initialValue = new SearchContext();
        Object.assign(this, initialValue);
    }
}

declare global {export const  gSearchContext: SearchContext} (globalThis as any).
gSearchContext = new SearchContext();

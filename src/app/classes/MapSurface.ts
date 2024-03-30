import { Vector } from "../vectors/Vector";

export class MapSurface {
    public width: number;
    public height: number;
    public padding: number;

    constructor(width: number, height: number, padding: number = 0) {
        this.width = width;
        this.height = height;
        this.padding = padding;
    }

    public getRandomPosition(): Vector {
        return new Vector(this.getRandomX(), this.getRandomY());
    }

    private getRandomX(): number {
        return this.width * Math.random();
    }

    private getRandomY(): number {
        return this.height * Math.random();
    }
}
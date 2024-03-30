import { MapPosition } from "./MapPosition";

export class MapConnection {
    public positionA: MapPosition;
    public positionB: MapPosition;
    public lenght: number;

    constructor(positionA: MapPosition, positionB: MapPosition) {
        this.positionA = positionA;
        this.positionB = positionB;
        this.lenght = this.positionB.distance(this.positionA);
    }
}
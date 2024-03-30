import { MapPosition } from "./MapPosition";

export class Area {
    public connectionCount: number;
    public mapPosition: MapPosition|undefined;

    constructor(connectionCount: number) {
        this.connectionCount = connectionCount;
    }

    static getAllPossibleAreas(): Array<Area> {

        const allPossibleAreas = [];

        for (let i = 0; i < 3; i++) {
            allPossibleAreas.push(new Area(5));
        }

        for (let i = 0; i < 6; i++) {
            allPossibleAreas.push(new Area(4));
        }

        for (let i = 0; i < 10; i++) {
            allPossibleAreas.push(new Area(3));
        }

        for (let i = 0; i < 30; i++) {
            allPossibleAreas.push(new Area(2));
        }

        return allPossibleAreas.sort((a: Area, b: Area) => b.connectionCount - a.connectionCount);
    }

    public setPosition(position: MapPosition) {
        // first set position
        this.mapPosition = position;

        // then trim connections that are not needed
        this.mapPosition.connections = this.mapPosition.connections.slice(0, this.connectionCount);
    }
}
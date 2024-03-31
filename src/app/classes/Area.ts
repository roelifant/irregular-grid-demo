import { MapPosition } from "./MapPosition";

export class Area {
    public name: string;
    public connectionCount: number;
    public mapPosition: MapPosition|undefined;

    public get adjacentAreas() {
        return this.mapPosition?.connections.map(con => con.positionB.area);
    }

    constructor(name: string, connectionCount: number) {
        this.name = name;
        this.connectionCount = connectionCount;
    }

    static getAllPossibleAreas(): Array<Area> {

        const allPossibleAreas = [];

        for (let i = 0; i < 1; i++) {
            allPossibleAreas.push(new Area('test area with six connections', 6));
        }

        for (let i = 0; i < 3; i++) {
            allPossibleAreas.push(new Area('test area with five connections', 5));
        }

        for (let i = 0; i < 6; i++) {
            allPossibleAreas.push(new Area('test area with four connections', 4));
        }

        for (let i = 0; i < 10; i++) {
            allPossibleAreas.push(new Area('test area with three connections', 3));
        }

        for (let i = 0; i < 30; i++) {
            allPossibleAreas.push(new Area('test area with two connections', 2));
        }

        return allPossibleAreas.sort((a: Area, b: Area) => b.connectionCount - a.connectionCount);
    }

    public setPosition(position: MapPosition) {
        // first set position
        this.mapPosition = position;
        this.mapPosition.area = this;

        // then trim connections that are not needed
        this.mapPosition.connections = this.mapPosition.connections.slice(0, this.connectionCount);
    }
}
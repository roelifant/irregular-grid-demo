import { Vector } from "../vectors/Vector";
import { MapPosition } from "./MapPosition";
import { MapSurface } from "./MapSurface";

export class GameMap {
    public surface: MapSurface;
    public positions: Array<MapPosition>;

    constructor(width: number, height: number, padding: number = 0) {
        // create surface
        this.surface = new MapSurface(width, height, padding);

        let pointCount = 50;
        const points: Array<Vector> = [];

        // get correctly distanced points
        for (let i = 0; i < pointCount; i++) {
            const newPoint = this.surface.getRandomPosition();
            const tooClosePoint = points.find(point => point.distance(newPoint) < padding);
            if(!!tooClosePoint) {
                pointCount++;
                continue;
            }
            points.push(newPoint);
        }

        // make positions for all points
        this.positions = points.map(point => new MapPosition(point));

        // make connectors for all positions
        this.positions.forEach(position => position.createConnections(this.positions))
    }
}
import { Vector } from "../vectors/Vector";
import { MapPosition } from "./MapPosition";
import { MapSurface } from "./MapSurface";

export class GameMap {
    public surface: MapSurface;
    public positions: Array<MapPosition>;

    constructor(width: number, height: number, positionCount: number, minPointDistance: number, padding: number = 0) {
        // create surface
        this.surface = new MapSurface(width, height, padding);

        let pointCount = positionCount;
        const points: Array<Vector> = [];
        const emergencyBreak = 1000;

        // get correctly distanced points
        for (let i = 0; i < pointCount; i++) {
            if(i > emergencyBreak) break;

            const newPoint = this.surface.getRandomPosition();
            const tooClosePoint = points.find(point => {
                if(point.distance(newPoint) < minPointDistance) {
                    return true;
                }

                // check borders
                if(newPoint.x < padding || newPoint.y < padding) {
                    return true;
                }
                if(newPoint.x > this.surface.width - padding || newPoint.y > this.surface.height - padding) {
                    return true;
                }
            });
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
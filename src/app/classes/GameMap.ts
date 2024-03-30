import { Vector } from "../vectors/Vector";
import { Area } from "./Area";
import { MapPosition } from "./MapPosition";
import { MapSurface } from "./MapSurface";

export class GameMap {
    public surface: MapSurface;
    public positions: Array<MapPosition>;
    public positionCount: number;

    constructor(width: number, height: number, positionCount: number, minPointDistance: number, padding: number = 0) {
        this.positionCount = positionCount;
        
        // create surface
        this.surface = new MapSurface(width, height, padding);

        let pointCount = this.positionCount;
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
        this.positions.forEach(position => position.createConnections(this.positions));

        // now sort positions based on average connection distance
        this.positions = this.positions.sort((a: MapPosition, b: MapPosition) => {
            return a.averageConnectionDistance! - b.averageConnectionDistance!
        });

        this.assignAreasToPositions();
    }

    private assignAreasToPositions() {
        const areas = Area.getAllPossibleAreas();

        for (let i = 0; i < this.positionCount; i++) {
            const area = areas[i];
            const position = this.positions[i];

            area.setPosition(position);
        }
    }
}
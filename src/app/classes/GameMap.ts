import { Vector } from "../vectors/Vector";
import { Area } from "./Area";
import { MapPosition } from "./MapPosition";
import { MapSurface } from "./MapSurface";

export class GameMap {
    public surface: MapSurface;
    public positions: Array<MapPosition> = [];
    public positionCount: number;

    public get areas() {
        return this.positions.map(pos => pos.area);
    }

    constructor(width: number, height: number, positionCount: number, minPointDistance: number, padding: number = 0) {
        this.positionCount = positionCount;

        // create surface
        this.surface = new MapSurface(width, height, padding);

        // generate the rest
        this.generate(minPointDistance, padding);
    }

    private generate(minPointDistance: number, padding: number, attempts: number = 10) {

        for (let i = 0; i < attempts; i++) {

            this.positions = [];
            let points: Array<Vector> | null = null;

            // 10 attempts
            for (let i = 0; i < 10; i++) {
                points = this.generatePoints(this.positionCount, minPointDistance, padding, 1000);
                if (!!points) {
                    break;
                }
                console.log('failed to generate... trying again...');
            }

            if (!points) {
                throw Error('Failed to generate the map!');
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

            // TODO: evaluate the generated map here, and break when succesful
            console.log('succesfully generated map');
            break;
        }

        console.log('map was flawed... continue anyways');

    }

    private generatePoints(pointCount: number, minPointDistance: number, padding: number, maxCycles: number = 1000): Array<Vector> | null {
        const points: Array<Vector> = [];
        let cycles = 0;

        // get correctly distanced points
        for (let i = 0; i < pointCount; i++) {
            cycles++;
            if (cycles > maxCycles) return null;

            const newPoint = this.surface.getRandomPosition();
            const tooClosePoint = points.find(point => {
                if (newPoint.distance(point) < minPointDistance) {
                    return true;
                }
            });

            // check borders
            let inPadding = false;
            if (newPoint.x < padding || newPoint.y < padding) {
                inPadding = true;
            }
            if (newPoint.x > this.surface.width - padding || newPoint.y > this.surface.height - padding) {
                inPadding = true;
            }

            const pointArrayPrediction = [...points.map(vector => vector.copy())];
            pointArrayPrediction.push(newPoint.copy());

            if (
                !!tooClosePoint ||
                inPadding
            ) {
                // retry
                pointCount++;
                continue;
            }

            points.push(newPoint);
        }

        console.log('succesfully generated points in ' + cycles + ' cycles');

        return points;
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
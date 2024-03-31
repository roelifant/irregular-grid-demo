import { Vector } from "../vectors/Vector";
import { Area } from "./Area";
import { MapConnection } from "./MapConnection";
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

    private generate(minPointDistance: number, padding: number, attempts: number = 50) {

        for (let i = 0; i < attempts; i++) {

            this.positions = [];
            let points: Array<Vector> | null = null;

            // 10 attempts
            for (let i = 0; i < 100; i++) {
                points = this.generatePoints(this.positionCount, minPointDistance, padding, 1000);
                if (!!points) {
                    break;
                }
                console.log('failed to generate points... trying again...');
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
            if(this.evaluate()) {
                console.log('succesfully generated map');
                break;
            }
            if(i<100) {
                console.log('bad evaluation... trying again...');
            } else {
                console.log('map was still flawed... continue anyways');
            }       
        }
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

    private evaluate(): boolean
    {
        // check if all positions are connected
        if(!this.checkIfHasOverlaps()) {
            console.log('potential overlap found');
            return false;
        }

        // check if a position is on a connection
        if(!this.checkIfConnected()) {
            console.log('might not be connected');
            return false;
        }

        return true;
    }

    private checkIfHasOverlaps() {
        // this method does seem to make a difference in reducing overlap cases, but still often fails to detect the overlap

        // loop over positions
        for (const position of this.positions) {
            // get closest other positions
            let closestPositions = this.positions.sort((a: MapPosition, b: MapPosition) => {
                return a.position.distance(position.position) - b.position.distance(position.position);
            }).slice(0, this.positions.length);

            closestPositions.shift();

            // get all relevant connections from closest point
            const connections: Array<MapConnection> = [];
            for (const closePos of closestPositions) {
                closePos.connections
                    .filter(con => {
                        return !con.positionA.position.matches(position.position) && !con.positionB.position.matches(position.position)
                    })
                    .forEach(con => connections.push(con));
            }

            // figure out if current point is on any of the connections
            for (const connection of connections) {
                const pointOnLine = position.position.projectToLine(connection.positionA.position, connection.positionB.position);

                const distanceDiff = Math.abs((pointOnLine.distance(connection.positionA.position) + pointOnLine.distance(connection.positionB.position)) - (connection.positionA.position.distance(connection.positionB.position)));
                if(distanceDiff > 0) {
                    continue;
                }

                if(pointOnLine.distance(position.position) <= (15 * 2)) {
                    return false;
                }
            }
        }

        return true;
    }

    private checkIfConnected(): boolean {
        // check if all points can reach this
        const reachPoint = this.positions[0];
        const goodPoints: Array<Vector> = [];

        for (const point of this.positions) {

            // check if found already
            const foundGoodPoint = goodPoints.find(v => v.matches(point.position));
            if(!!foundGoodPoint) continue;

            let reached = false;
            const allConnectedPoints: Array<Vector> = [];
            this.loopThroughtConnectedPositions(point, (mapPosition) => {
                allConnectedPoints.push(mapPosition.position);
                if(reached) return;
                if(mapPosition.position.matches(reachPoint.position)) {
                    reached = true;
                }
            });
            if(!reached) return false;
            allConnectedPoints.forEach(p => goodPoints.push(p));
        }

        return true;
    }

    private loopThroughtConnectedPositions(mapPosition: MapPosition, callback: (pos: MapPosition) => void, visited: Array<Vector> = [], maxDepth = Math.ceil(this.positions.length/2))
    {
        maxDepth--;

        if(maxDepth < 0) {
            return;
        }

        // check if this has already been visited
        const foundVisited = visited.find(vec => vec.matches(mapPosition.position));

        if(!!foundVisited) {
            // console.log('found visited');
            return;
        }

        // console.log('looping through new map position');

        // add to visited
        const newVisited = [...visited.map(vec => vec.copy())];
        newVisited.push(mapPosition.position.copy());

        // console.log(visited.length);
        // console.log(newVisited.length);

        // execute callback
        callback(mapPosition);

        // loop through connected positions
        for (const conn of mapPosition.connections) {
            const foundVisited = visited.find(vec => vec.matches(conn.positionB.position));
            if(!!foundVisited) continue;
            this.loopThroughtConnectedPositions(conn.positionB, callback, newVisited, maxDepth);
        }
    }
}
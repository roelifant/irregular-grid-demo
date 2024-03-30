import { Vector } from "../vectors/Vector";
import { MapConnection } from "./MapConnection";

export class MapPosition {
    public position: Vector;
    public connections: Array<MapConnection>;

    constructor(position: Vector) {
        this.position = position;
        this.connections = [];
    }

    public distance(mapPosition: MapPosition): number {
        return this.position.distance(mapPosition.position);
    }

    public createConnections(allPositions: Array<MapPosition>) {
        this.connections = [];

        // generate connections to all the other positions
        allPositions.forEach(position => {
            if(position.position.matches(this.position))  {
                return;
            }

            this.connections.push(new MapConnection(this, position));
        });

        // now sort the connections based on length
        this.connections = this.connections.sort((a: MapConnection, b: MapConnection) => {
            return a.lenght - b.lenght;
        });
    }
}
import { Application, Container, Graphics } from "pixi.js";
import { GameMap } from "./GameMap";

export class MapRender {
    public canvas: HTMLCanvasElement;
    public map: GameMap;
    public pixiApp: Application;

    private positionContainer!: Container;
    private connectionContainer!: Container;

    constructor(canvas: HTMLCanvasElement, map: GameMap) {
        this.canvas = canvas;
        this.map = map;

        this.pixiApp = new Application();
    }

    public async init() {
        await this.pixiApp.init({
            canvas: this.canvas,
            resizeTo: this.canvas,
            resolution: window.devicePixelRatio || 1
        });

        this.positionContainer = new Container;
        this.connectionContainer = new Container;

        this.pixiApp.stage.addChild(this.connectionContainer);
        this.pixiApp.stage.addChild(this.positionContainer);

        this.drawPositions();
        this.drawConnections();
    }

    private drawPositions() {
        this.removeAllPositionRenders();

        this.map.positions.forEach(position => {
            const circle = (new Graphics())
            .circle(0, 0, 20)
            .fill(0xcfcfcf);

            this.positionContainer.addChild(circle);

            circle.position.x = position.position.x;
            circle.position.y = position.position.y;
        });
    }

    private drawConnections() {
        this.removeAllConnectionRenders();

        for (const position of this.map.positions) {
            for (const connection of position.connections) {
                const line = (new Graphics())
                    .moveTo(connection.positionA.position.x, connection.positionA.position.y)
                    .lineTo(connection.positionB.position.x, connection.positionB.position.y)
                    .stroke({
                        color: 'white',
                        width: 3
                    });
                
                this.connectionContainer.addChild(line);
            }
        }
    }

    private removeAllPositionRenders() {
        this.positionContainer.children.forEach(child => child.destroy());
    }

    private removeAllConnectionRenders() {
        this.connectionContainer.children.forEach(child => child.destroy());
    }
}
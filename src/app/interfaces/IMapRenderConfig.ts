import { GameMap } from "../classes/GameMap";

export interface IMapRenderConfig {
    canvas: HTMLCanvasElement,
    map: GameMap,
    pointSize: number,
    connectionWidth: number,
}
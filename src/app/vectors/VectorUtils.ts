export class VectorUtils {

    public degreesToRadians(degrees: number): number {
        return degrees * (Math.PI/180);
    }

    public radiansToDegrees(radians: number): number {
        return radians * (180/Math.PI);
    }

    public roundToNDecimals(value: number, N: number) {
        const factor = (N*10);
        return Math.round(value * factor)/factor;
    }
}
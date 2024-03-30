export class VectorUtils {

    public degreesToRadians(degrees: number): number {
        return degrees * (Math.PI/180);
    }

    public radiansToDegrees(radians: number): number {
        return radians * (180/Math.PI);
    }
}
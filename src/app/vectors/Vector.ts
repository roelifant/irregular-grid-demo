import { IPoint } from "./VectorInterfaces";
import { VectorUtils } from "./VectorUtils";

export class Vector {

    public components: Array<number>;

    static utils: VectorUtils = new VectorUtils();

    public get x(): number {
        return this.components[0];
    }

    public set x(x: number) {
        this.components[0] = x;
    }

    public get y(): number {
        if(this.components.length < 2) throw new Error('vector has no y component');
        return this.components[1];
    }

    public set y(y: number) {
        if(this.components.length < 2) throw new Error('vector has no z component');
        this.components[1] = y;
    }

    public get z(): number {
        return this.components[2];
    }

    public set z(z: number) {
        this.components[2] = z;
    }

    public get length(): number {
        let res = 0;
        this.components.forEach(component => {
            res += (component * component);
        });
        return Math.sqrt(res);
    }

    constructor(...components: Array<number>) {
        if(components.length === 0) throw new Error('vector was given no components');
        this.components = components
    }

    static from(param: number|IPoint|Vector) {
        if(param instanceof Vector) {
            return Vector.fromVector(param);
        }

        if(typeof param === 'number') {
            return Vector.fromAngle(param);
        }

        if(typeof param === 'object') {
            if(param.hasOwnProperty('x') && param.hasOwnProperty('y')) {
                return Vector.fromPoint(param);
            }
        }

        throw new Error('Could not create Vector');
    }

    static fromPoint(point: IPoint) {
        if(!!point.z) return new Vector(point.x, point.y, point.z);
        return new Vector(point.x, point.y);
    }

    /**
     * angle in degrees
     *
     * @param angle
     */
    static fromAngle(angle: number) {
        let radians = this.utils.degreesToRadians(angle);
        return new Vector(Math.cos(radians), Math.sin(radians));
    }

    static fromVector(vector: Vector) {
        return new Vector(...vector.components);
    }

    public add(vector: Vector) {
        const { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] + component)
        )
    }

    public subtract(vector: Vector) {
        const { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] - component)
        )
    }

    public scale(scalar: number) {
        return new Vector(...this.components.map(component => component * scalar));
    }

    public divide(scalar: number) {
        return new Vector(...this.components.map(component => component / scalar));
    }

    public normalize() {
        if(this.length === 0) throw Error('cannot be normalised because length is 0');
        return this.divide(this.length);
    }

    public normalizeOrRemain() {
        try {
            return this.normalize()
        } catch (e) {
            return this;
        }
    }

    /**
     * Dot product. Turns two vectors into a single number.
     *
     * @param vector
     */
    public dot(vector: Vector): number {
        if (this.components.length !== vector.components.length) {
            throw Error("Vectors must have the same amount of components!");
        }
        let res = 0;
        this.components.forEach((component: number, index: number) => {
            res += (component * vector.components[index]);
        });
        return res;
    }

    public angle(): number {
        if (this.components.length > 2) {
            throw Error('This method only works for two-dimensional vectors!');
        }
        const origin = new Vector(0, -1)
        const radian = Math.acos(this.dot(origin) / (this.length * origin.length))
        if (this.y * origin.x > this.x * origin.y) {
            return radian * (180 / Math.PI);
        }
        return ((Math.PI * 2) - radian) * (180 / Math.PI);
    }

    public angleTo(vector: Vector): number {
        if(this.components.length > 2 || vector.components.length > 2) {
            throw Error('This method only works for two-dimensional vectors');
        }

        const diff = this.subtract(vector);
        const theta = Math.atan2(diff.x, diff.y);
        return theta * (180 / Math.PI);
    }

    public distance(vector: Vector): number {
        if(this.components.length > 2 || vector.components.length > 2) {
            throw Error('This method only works for two-dimensional vectors!');
        }
        return Math.sqrt(Math.pow((this.x - vector.x), 2) + Math.pow((this.y - vector.y), 2));
    }

    public rotate(radians: number) {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        return new Vector(
            (cos*this.x) - (sin*this.y),
            (sin*this.x) + (cos*this.y),
        );
    }
    

    public flipComponent(component: number): Vector {
        if(component < 1 || component > this.components.length) throw Error('Vector does not have a '+component+'th component');
        
        const vector = this.copy()
        vector.components[component - 1] = -vector.components[component - 1];
        
        return vector;
    }

    public rotateAroundAnchor(radians: number, anchor: Vector) {
        // first get direction from point to anchor
        const direction = this.subtract(anchor);

        // then rotate that direction the desired angle (radian)
        const rotatedDirection = direction.rotate(radians);
        return rotatedDirection.add(anchor);
    }

    /**
     * Will get the pependicular vector for a 2D vector
     */
    public perpendicular2D() {
        return new Vector(-this.y, this.x);
    }

    public cross(vector: Vector) {
        if(!(this.components.length === 3) || !(vector.components.length === 3)) {
            throw Error('Cross product can only be calculated for 3D vectors!')
        }

        return new Vector(
            this.components[1] * vector.components[2] - this.components[2] * vector.components[1],
            this.components[2] * vector.components[0] - this.components[0] * vector.components[2],
            this.components[0] * vector.components[1] - this.components[1] * vector.components[0]
        )
    }

    public map(callback: CallableFunction): Vector {
        const components = [...this.components];
        const result: Array<number> = [];
        components.forEach(component => result.push(callback(component)));
        return new Vector(...result);
    }

    /**
     * 
     * output the vector as a point (x, y, z);
     * 
     * @returns IPoint
     */
    public toPoint(): IPoint {
        if(this.components.length < 2) throw new Error('Not enough components for point');
        if(this.components.length > 2) return {x: this.x, y: this.y, z: this.z};
        return {x: this.x, y: this.y};
    }

    /**
     * 
     * Is the vector within a certain distance of another vector?
     * 
     * @param vector 
     * @param distance 
     * @returns boolean
     */
    public isNear(vector: Vector, distance: number): boolean {
        return vector.distance(this) <= distance;
    }

    /**
     * Get the vector for a point vector that is mirrored over another point vector
     * 
     * @param reflectionPoint 
     * @returns vector
     */
    public reflectOverPoint(reflectionPoint: Vector): Vector {
        const distance = this.distance(reflectionPoint);
        const dir = reflectionPoint.subtract(this).normalizeOrRemain();
        return this.add(dir.scale(distance*2));
    }

    /**
     * calculate the mid point between 2 points
     *
     * @param positionVector
     */
    public middle(positionVector: Vector) {
        return this.add(positionVector).divide(2);
    }

    public flipX(): Vector{
        return this.flipComponent(1);
    }

    public flipY(): Vector{
        return this.flipComponent(2);
    }

    public flipZ(): Vector{
        return this.flipComponent(3);
    }

    /**
     * log all components + length
     */
    public log() {
        const components: any = {};
        if(this.components.length <= 3) {
            components['x'] = this.x;
            if(this.components.length > 1) components['y'] = this.y;
            if(this.components.length > 2) components['z'] = this.z;
        } else {
            this.components.forEach((comp, index) => {
                components[index] = comp;
            });
        }

        const object = {
            components: this.components.length,
            length: this.length,
            ...components,
        };
        console.table(object);
    }

    copy() {
        return Vector.fromVector(this);
    }
}
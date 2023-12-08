export default class MathUtils {
    static gcd  (a: number, b: number): number {
        // if (i2 === 0) return i1;
        return a ? MathUtils.gcd(b % a, a) : b;
    }
    static lcm  (a: number, b: number): number {
        return a * b / MathUtils.gcd(a, b);
    }
}

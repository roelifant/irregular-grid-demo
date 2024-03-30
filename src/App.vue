<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MapSurface } from "./app/classes/MapSurface";
import { Vector } from './app/vectors/Vector';

const canvas = ref<null|HTMLCanvasElement>();

onMounted(() => {
    // create grid here
    const surface = new MapSurface(canvas.value.clientWidth, canvas.value.clientHeight, 50);

    const pointCount = 50;
    const points: Array<Vector> = [];

    for (let i = 0; i < pointCount; i++) {
        points.push(surface.getRandomPosition());
    }

    console.log(points);
})
</script>

<template>
    <canvas class="canvas" ref="canvas"> </canvas>
</template>

<style scoped>
.canvas {
    background-color: black;
    width: 100vw;
    height: 100vh;
}
</style>

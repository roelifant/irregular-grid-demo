<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GameMap } from "./app/classes/GameMap";
import { MapRender } from "./app/classes/MapRender";

const canvas = ref<null | HTMLCanvasElement>();
const loading = ref(true);

const createMap = async (canvas: HTMLCanvasElement) => {

    const map = new GameMap({
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        positions: 30,
        minimalPositionDistance: 100,
        padding: 50,
        pointSize: 20,
        generationStrengthPercent: .25,
    });

    await map.generate();

    const render = new MapRender({
        canvas: canvas,
        map: map,
        pointSize: 40,
        connectionWidth: 5
    });
    await render.init();

    // test the adjacent areas
    // map.areas.forEach(area => {
    //     console.log('adjacent areas for '+area!.name);
    //     console.log(area?.adjacentAreas);
    // })
    loading.value = false;
}

onMounted(() => {
    if (!canvas.value) {
        throw new Error('could not access canvas element!');
    }

    createMap(canvas.value);
});
</script>

<template>
    <p v-if="loading">Loading...</p>
    <canvas class="canvas" ref="canvas"> </canvas>
</template>

<style scoped>
.canvas {
    background-color: black;
    width: 100vw;
    height: 100vh;
}
p {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    color: white;
    font-size: 3rem;
    font-family: sans-serif;
}
</style>

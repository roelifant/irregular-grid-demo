<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GameMap } from "./app/classes/GameMap";
import { MapRender } from "./app/classes/MapRender";

const canvas = ref<null|HTMLCanvasElement>();

onMounted(async () => {
    const map = new GameMap(
        canvas.value.clientWidth,
        canvas.value.clientHeight,
        40,
        70,
        50);
    const render = new MapRender(canvas.value, map);
    await render.init();

    // test the adjacent areas
    // map.areas.forEach(area => {
    //     console.log('adjacent areas for '+area!.name);
    //     console.log(area?.adjacentAreas);
    // })
});
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

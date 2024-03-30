<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GameMap } from "./app/classes/GameMap";

const canvas = ref<null|HTMLCanvasElement>();

onMounted(() => {
    const map = new GameMap(canvas.value.clientWidth, canvas.value.clientHeight, 50);
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

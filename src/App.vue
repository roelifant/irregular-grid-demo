<script setup lang="ts">
import { ref, onMounted } from 'vue';

const canvas = ref<null|HTMLCanvasElement>();

onMounted(() => {
    // create grid here
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

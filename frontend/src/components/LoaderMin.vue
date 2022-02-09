<template>
 <div class="loader-box">
    <img class="loader" src="@/assets/spinner.png">
 </div>
</template>

<script>
export default {
  name: 'LoaderMin',
}
</script>

<style scoped>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% {  transform: rotate(359deg); }
}
.loader {
    animation: spin 2s linear infinite;
    width: 20px;
}
.loader-box{
    /* margin-top: 50px; */
    text-align: center;
    display: inline-block;
    margin-left: 20px;
}
</style>
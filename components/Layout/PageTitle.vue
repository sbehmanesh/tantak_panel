<template>
  <div class="page_titel py-3 pr-3 rounded-t-lg mb-1">
    <span class="white--text font_medium pr-14 font_24 white-space_nowrap">
      {{ $store.state.page_title }}
    </span>
  </div>
</template>

<script>
export default {}
</script>
<style scoped>
.page_titel{
  background-image: radial-gradient(circle at 0 0, #ffa300 , #fd5800 100%);
}
</style>

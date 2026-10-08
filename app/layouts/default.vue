<script lang="ts" setup>

</script>

<template>
  <div>
    <UHeader />
    <UMain>
      <UContainer>
        <slot />
      </UContainer>
    </UMain>
    <slot />
    <UFooter />
  </div>
</template>

<style>

</style>

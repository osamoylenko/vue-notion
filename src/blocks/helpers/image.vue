<template>
  <div v-if="f.block_aspect_ratio" :style="style">
    <component
      v-if="hasImageComponent"
      :is="imageOptions.component"
      class="notion-image-inset"
      :alt="alt || 'Notion image'"
      v-bind="imageProps"
      :style="imgStyle"
    />
    <img
      v-else
      class="notion-image-inset"
      :alt="alt || 'Notion image'"
      v-bind="imageProps"
      :style="imgStyle"
    />
  </div>
  <component
    v-else-if="hasImageComponent"
    :is="imageOptions.component"
    :alt="alt || 'Notion image'"
    v-bind="imageProps"
    :style="imgStyle"
  />
  <div v-else :style="style"> 
    <img :alt="alt" v-bind="imageProps" :style="imgStyle" />
  </div>
</template>

<script>
import { Blockable, blockComputed } from "@/lib/blockable";

const alignmentMap = {
  'left': 'flex-start',
  'center': 'center',
  'right': 'flex-end'
}

export default {
  extends: Blockable,
  name: "NotionImage",
  computed: {
    ...blockComputed,
    hasImageComponent() {
      return !!this.imageOptions?.component;
    },
    imageProps() {
      const { component, ...attrs } = this.imageOptions || {};
      return {
        ...attrs,
        [this.imageOptions?.src || "src"]: this.src,
      };
    },

    style() {
      return {
        display: 'flex',
        justifyContent: alignmentMap[this.format?.block_alignment || 'center']
      }
    },

    imgStyle() {
      let [width, height] = ['100%', 'auto'];

      if (!this.format?.block_full_width && !this.format?.block_page_width) {
        if (this.f.block_width > 1) {
          const fullWidth = 704 * (this.parent?.value?.format?.column_ratio || 1)
          width = `${this.f.block_width / fullWidth * 100}%`;
        } else if (this.f.block_height > 1) {
          [width, height] = ['auto', `${this.f.block_height}px`]
        }
      }

      return {
        position: "relative",
        maxWidth: '100%',
        width,
        height,
      };
    },
  },
};
</script>

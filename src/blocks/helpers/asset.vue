<template>
  <div :style="style">
    <iframe class="notion-image-inset" :src="src" :allow="embedAllow" :style="iframeStyle"/>
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
  name: "NotionAsset",
  computed: {
    ...blockComputed,
    src() {
      return this.type === "figma"
        ? this.properties.source[0][0]
        : this.f.display_source;
    },

    style() {
      return {
        display: 'flex',
        justifyContent: alignmentMap[this.format?.block_alignment || 'center']
      }
    },

    iframeStyle() {
      const aspectRatio = this.f.block_aspect_ratio 
                  || this.f.block_height / this.f.block_width;

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
        aspectRatio: 1 / aspectRatio,
        position: "relative",
        maxWidth: '100%',
        width,
        height
      };
    },
  },
};
</script>

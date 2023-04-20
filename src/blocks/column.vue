<template>
  <Fragment>
    <div class="notion-column" :style="columnStyle">
      <slot />
    </div>
    <div class="notion-spacer" :style="spacerStyle" />
  </Fragment>
</template>

<script>
import { Fragment } from "vue-fragment";

const baseWidth = 46; // todo: add magic numbers to a config json

export default {
  name: "NotionColumn",
  props: ["format"],
  components: { Fragment },
  computed: {
    columnStyle() {
      let column_ratio = this.format?.column_ratio
        ? this.format.column_ratio
        : 0.5;
      const columns = Number((1 / column_ratio).toFixed(0));
      const totalWidth = (columns - 1) * baseWidth;
      return {
        width: `calc((100% - ${totalWidth}px) * ${column_ratio})`,
      };
    },
    spacerStyle() {
      return { width: `${baseWidth}px` };
    },
  },
};
</script>

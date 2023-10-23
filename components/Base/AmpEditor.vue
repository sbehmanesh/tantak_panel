<template>
  <div>
    <amp-labale
      :text="text"
      :color="color"
      :disabled="disabled"
      test-tag="labale"
      :required="required"
      :textClass="textClass"
      :help_text="help_text"
      :starRight="starRight"
      v-if="text && showLable"
    />
    <trumbowyg :config="config" v-model="inp_value"  ref="editor" />
  </div>
</template>

<script>
import Trumbowyg from "vue-trumbowyg";
export default {
  components: {Trumbowyg},
  props: {
    value: {
      required: false
    },
    text: {
      type: String,
      required: false
    },
    color: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    textClass: {
      type: String,
      default: ""
    },
    help_text: {
      type: String,
      default: ""
    },
    starRight: {
      type: Boolean,
      default: false
    },
    showLable: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    ruleItem: [],
    inpRules: {},
    model_value:'',
    inp_value: "",
    required: false,
    end_render: false,
    config: {
      btns: [
        ["viewHTML"],
        ["undo", "redo"],
        ["strong", "em", "del", "fontsize"],
        ["emoji", "foreColor", "backColor"],
        ["superscript", "subscript"],
        ['historyUndo', 'historyRedo'],
        ["link"],
        ["insertImage"],
        ["justifyRight", "justifyLeft", "justifyCenter", "justifyFull"],
        ["unorderedList", "orderedList"],
        ["horizontalRule"],
        ["removeformat", "formatting"],
        ["fullscreen"]
      ]
    }
  }),
  watch: {
    value() {
      this.inp_value = this.value;
    },
    inp_value() {
      this.$emit("input", this.inp_value);
    },
  },
  mounted() {
    this.setRules();
    if (this.value_inp) {
      this.inp_value = this.value_inp;
    }
    if (this.value) {
      this.inp_value = this.value;
    }
    this.end_render = true;
  },
  methods: {
    setRules() {
      this.ruleItem = [];
      let inpRules = this.$inpRules();
      if (typeof this.rules == "string") {
        this.rules.split(",").forEach(element => {
          if (typeof inpRules[element] != "undefined") {
            if (element == "require") {
              this.required = true;
            }
            this.ruleItem.push(inpRules[element]);
          }
        });
      } else if (typeof this.rules == "function") {
        this.ruleItem.push(this.rules);
      }
    },
  }
};
</script>

<style scoped >
.trumbowyg_container{
  display: none;
  z-index: -1;
}
.trumbowyg-button-pane {
  z-index: 0;
}
.trumbowyg-editor-visible{
  z-index: 11
}
</style>

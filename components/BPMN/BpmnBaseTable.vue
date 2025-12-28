<template>
  <v-card class="bpmn-base-table elevation-2">
    <div class="bpmn-base-table__header">
      <div>
        <div class="bpmn-base-table__title">
          {{ tableTitle }}
        </div>
      </div>
    </div>

    <v-divider class="my-2" />

    <div class="bpmn-base-table__content">
      <v-alert
        v-if="!report_slug && !is_loading"
        dense
        outlined
        type="info"
        class="mb-4"
      >
        برای مشاهده گزارش اسلاگ معتبری وارد کنید.
      </v-alert>

      <v-alert
        v-else-if="error_message && !is_loading"
        dense
        outlined
        type="error"
        class="mb-4"
      >
        {{ error_message }}
      </v-alert>

      <v-skeleton-loader
        v-else-if="is_loading"
        class="mt-4"
        type="table-heading, list-item-three-line"
      />

      <template v-else-if="hasColumns">
        <BaseTable
          v-bind="forwardedAttrs"
          v-on="$listeners"
          :headers="tableHeaders"
          localData
          :rootBody="rootRequestBody"
          :dataArray="[]"
          :bpmn-url="resolvedBpmnUrl"
          :BTNactions="resolvedRowActions"
          ref="bpmnTable"
        />
      </template>

      <v-alert
        v-else
        dense
        outlined
        type="warning"
        class="mt-4"
      >
        ستونی برای این گزارش تعریف نشده است.
      </v-alert>
    </div>
  </v-card>
</template>

<script>
import AmpButton from "~/components/Base/AmpButton.vue";
import BaseTable from "~/components/DataTable/BaseTable.vue";

const DEFAULT_ACTION_PALETTE = {
  do: {
    text: "انجام",
    color: "primary",
    icon: "play_arrow",
  },
  history: {
    text: "تاریخچه",
    color: "info",
    icon: "history",
  },
};

export default {
  name: "BpmnBaseTable",
  components: { AmpButton, BaseTable },
  inheritAttrs: false,
  props: {
    report_slug: {
      type: String,
      default: null,
    },
    auto_load: {
      type: Boolean,
      default: true,
    },
    only_me: {
      type: Boolean,
      default: true,
    },
    row_actions: {
      type: Array,
      default: null,
    },
    extra_row_actions: {
      type: Array,
      default: () => [],
    },
    action_palette: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    is_loading: false,
    error_message: null,
    report_meta: null,
    column_definitions: [],
    table_rows: [],
    fixed_filters: {},
    available_action_keys: [],
    bpmn_url: null,
    rootRequestBody: {},
  }),
  computed: {
    hasColumns() {
      return this.column_definitions.length > 0;
    },
    tableTitle() {
      if (this.report_meta && this.report_meta.title) {
        return this.report_meta.title;
      }
      return "گزارش BPMN";
    },
    tableHeaders() {
      let headers = this.column_definitions.map((column_item) => {
        const header_text = column_item.helper
          ? `${column_item.label} (${column_item.helper})`
          : column_item.label;
        const column_path = this.resolveColumnPath(column_item);
        return {
          text: header_text,
          value: this.resolveHeaderValue(column_item, column_path),
          sortable: false,
          filterable: false,
          dataPath: column_path,
          sort: column_item.meta?.sort,
          width: column_item.meta?.width,
        };
      });
      headers.sort(function(a,b){ return a.sort > b.sort })
      return headers;
    },
    forwardedAttrs() {
      const attrs = { ...this.$attrs };
      if (Object.prototype.hasOwnProperty.call(attrs, "bpmn-url")) {
        delete attrs["bpmn-url"];
      }

      return attrs;
    },
    resolvedBpmnUrl() {
      if (Object.prototype.hasOwnProperty.call(this.$attrs, "bpmn-url")) {
        return this.$attrs["bpmn-url"];
      }
      console.log('bpmn_url here',this.bpmn_url)
      return this.bpmn_url;
    },
    shouldUseLocalData() {
      const attr_values = this.$attrs || {};
      const has_url_attr = Object.prototype.hasOwnProperty.call(
        attr_values,
        "url"
      );
      const has_bpmn_url_attr = Object.prototype.hasOwnProperty.call(
        attr_values,
        "bpmn-url"
      );
      const local_data_attr = attr_values["local-data"];

      if (typeof local_data_attr !== "undefined") {
        if (typeof local_data_attr === "boolean") {
          return local_data_attr;
        }
        if (typeof local_data_attr === "string") {
          if (local_data_attr.length === 0) {
            return true;
          }
          return local_data_attr === "true";
        }
        return Boolean(local_data_attr);
      }

      if (this.bpmn_url) {
        return false;
      }

      return !has_url_attr && !has_bpmn_url_attr;
    },
    resolvedRowActions() {
      if (Array.isArray(this.row_actions) && this.row_actions.length) {
        return this.row_actions;
      }
      const default_actions = this.buildDefaultActions(
        this.available_action_keys
      );
      return [...default_actions, ...this.normalizedExtraActions];
    },
    normalizedExtraActions() {
      if (!Array.isArray(this.extra_row_actions)) {
        return [];
      }
      return this.extra_row_actions
        .filter((action_item) => Boolean(action_item))
        .map((action_item) => {
          const show_fun =
            typeof action_item.show_fun === "function"
              ? action_item.show_fun
              : () => true;
          const disab_fun =
            typeof action_item.disab_fun === "function"
              ? action_item.disab_fun
              : () => false;
          const fun =
            typeof action_item.fun === "function"
              ? action_item.fun
              : () => {};

          return {
            text: action_item.text || "---",
            color: action_item.color || "primary",
            icon: action_item.icon || null,
            show_fun,
            disab_fun,
            fun,
          };
        });
    },
  },
  watch: {
    only_me: {
      immediate: true,
      handler(value) {
        this.rootRequestBody = {
          only_me: value,
        };
      },
    },
    report_slug: {
      immediate: true,
      handler(new_value) {
        if (new_value && this.auto_load) {
          this.fetchReportDefinition();
        } else if (!new_value) {
          this.resetState();
        }
      },
    },
    column_definitions() {
      this.requestTableDataIfReady();
    },
    is_loading(new_value) {
      if (!new_value) {
        this.requestTableDataIfReady();
      }
    },
  },
  methods: {
    async fetchReportDefinition() {
      if (!this.report_slug) {
        this.error_message = "اسلاگ گزارش معتبر نیست.";
        return;
      }

      this.is_loading = true;
      this.error_message = null;
      try {
        const response_data = await this.$reqApi("bpmn-dynamic-list/show", {
          slug: this.report_slug,
        });
        const model_data = response_data?.model || null;
        this.report_meta = model_data;
        this.column_definitions = this.normalizeColumns(
          model_data?.columns || {}
        );
        this.fixed_filters = model_data?.fixed_filters || {};
        this.bpmn_url = this.buildBpmnUrl(model_data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load BPMN report definition:", error);
        this.error_message = "بارگذاری گزارش با خطا روبه‌رو شد.";
      } finally {
        this.is_loading = false;
      }
    },
    normalizeColumns(column_map) {
      const normalized_columns = [];
      const column_entries = Object.entries(column_map || {});

      column_entries.forEach(([label, column_definition]) => {
        const is_actions = label === "actions";
        if (is_actions) {
          this.available_action_keys = Array.isArray(column_definition)
            ? column_definition
            : [];
          return;
        }
        const key = column_definition?.path || label;

        normalized_columns.push({
          key,
          label: is_actions ? "عملیات" : label,
          helper: "",
          meta: column_definition,
        });
      });

      return normalized_columns;
    },
    buildBpmnUrl(model_data) {
      const process_id = model_data?.process_id;
      if (!process_id) {
        return null;
      }
      const pmql_expression = `(process_id = ${process_id})`;
      const encoded_pmql = encodeURIComponent(pmql_expression);
      return `/requests?include=data,activeTasks,user&pmql=${encoded_pmql}`;
    },
    buildDefaultActions(action_keys = []) {
      if (!action_keys.length) {
        return [];
      }
      return action_keys.map((action_key) => {
        const palette_item =
          this.action_palette[action_key] ||
          DEFAULT_ACTION_PALETTE[action_key] ||
          {};
        const action_text = palette_item.text || action_key;
        const action_color = palette_item.color || "primary";
        const action_icon = palette_item.icon || null;

        return {
          text: action_text,
          color: action_color,
          icon: action_icon,
          show_fun:
            typeof palette_item.show_fun === "function"
              ? palette_item.show_fun
              : () => true,
          disab_fun:
            typeof palette_item.disab_fun === "function"
              ? palette_item.disab_fun
              : () => false,
          fun: (row_item) =>
            this.$emit("action", { action: action_key, row: row_item }),
        };
      });
    },
    resolveColumnPath(column_item) {
      if (!column_item) {
        return null;
      }
      return column_item.meta?.path || column_item.key || null;
    },
    resolveHeaderValue(column_item, column_path = null) {
      const resolvedPath =
        column_path !== null && column_path !== undefined
          ? column_path
          : this.resolveColumnPath(column_item);

      const has_nested_path =
        typeof resolvedPath === "string" && resolvedPath.includes(".");
      
      const has_options =
        column_item.meta && typeof column_item.meta.options === "object";

      if (!has_nested_path && !has_options) {
        return resolvedPath;
      }

      return (row_item) => {
        const base_value = has_nested_path
          ? this.getNestedValue(row_item, resolvedPath)
          : row_item[resolvedPath];
  
        return this.formatColumnValue(base_value, column_item.meta);
      };
    },
    getNestedValue(row_item, column_path) {
      if (!row_item || !column_path) {
        return null;
      }

      return column_path.split(".").reduce((current_value, segment) => {
        if (current_value === null || typeof current_value === "undefined") {
          return null;
        }

        const is_array = Array.isArray(current_value);
        const numeric_index = Number(segment);
        const is_valid_index =
          is_array &&
          Number.isInteger(numeric_index) &&
          numeric_index >= 0 &&
          numeric_index < current_value.length;

        if (is_valid_index) {
          return current_value[numeric_index];
        }

        if (
          current_value &&
          Object.prototype.hasOwnProperty.call(current_value, segment)
        ) {
          return current_value[segment];
        }

        return null;
      }, row_item);
    },
    formatColumnValue(value, column_meta = {}) {
      if (
        value !== null &&
        typeof value !== "undefined" &&
        Object.prototype.hasOwnProperty(column_meta,'options') &&
        Object.prototype.hasOwnProperty.call(column_meta.options, value)
      ) {
        return column_meta.options[value];
      }
      
      if (
        value !== null &&
        typeof value !== "undefined" &&
        column_meta.type == "number"
      ) {
        return this.$price(value);
      }

      return value;
    },
    resetState() {
      this.report_meta = null;
      this.column_definitions = [];
      this.table_rows = [];
      this.error_message = null;
      this.fixed_filters = {};
      this.available_action_keys = [];
      this.bpmn_url = null;
    },
    requestTableDataIfReady() {
      if (this.is_loading || !this.hasColumns) {
        return;
      }
      this.$nextTick(() => {
        const tableRef = this.$refs.bpmnTable;
        if (tableRef && typeof tableRef.getDataFromApi === "function") {
          tableRef.getDataFromApi();
        }
      });
    },
  },
  beforeMount() {
    this.fetchReportDefinition();
  },
  mounted() {
    this.requestTableDataIfReady();
  }
};
</script>

<style scoped>
.bpmn-base-table {
  padding: 24px;
  border-radius: 12px;
  background-color: #ffffff;
}

.bpmn-base-table__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.bpmn-base-table__title {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
}

.bpmn-base-table__subtitle {
  font-size: 14px;
  color: #777777;
}

.bpmn-base-table__subtitle span {
  font-weight: 600;
  color: #333333;
}

.bpmn-base-table__content {
  margin-top: 8px;
}

</style>

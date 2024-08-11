<template>
  <div class="pa-4">
    <div class="text-left py-2">
      <amp-button
        icon="add"
        text="جدید"
        color="#ff9e00"
        v-if="createUrl"
        @click="$router.push(createUrl)"
      />
      <amp-button
        icon="add"
        text="جدید"
        color="#ff9e00"
        v-if="createShowFun"
        @click="createFun()"
      />

      <amp-button
        v-for="btn in extraBtn"
        :key="btn.id"
        :color="btn.color"
        :icon="btn.icon"
        :text="btn.text"
        @click="btn.fun()"
      />
      <amp-button v-if="emitData" :text="emitData" @click="emitDataTable" />
    </div>
    <v-data-table
      ref="myTable"
      class="b-success elevation-1"
      :page.sync="page"
      :items="items_end"
      :loading="loading"
      hide-default-header
      hide-default-footer
      :headers="header_end"
      :items-per-page="page_row"
    >
      <template v-slot:header="{ props }">
        <FilterItem
          :headers="props.headers"
          :local="local"
          :excel="excel"
          :pdf="pdf"
          class="header_bg"
          :create-fun="createFun"
          :storeState="storeState"
          :moreTD="moreTD_header"
          v-if="$vuetify.breakpoint.mdAndUp"
          v-on:exportpdf="exportTable($event)"
          v-on:Excel="exportTable($event)"
          v-on:allFilterItems="getDataFromApi()"
          v-on:changeSortEmit="changeSort($event)"
          :no_refresh="no_refresh"
          :no_filter="no_filter"
          :no_filter_actions="no_filter_actions"
        />
      </template>
      <template v-slot:item="data">
        <tr
          @click="onRowClick(data.item)"
          :class="[
            getColor(data),
            rowPointer ? 'pointer' : '',
            $vuetify.breakpoint.mdAndUp ? '' : 'bt-tr-mobile b-light_purple',
          ]"
        >
          <td
            v-if="$vuetify.breakpoint.mdAndUp"
            width="55px"
            class="text-center"
          >
            <v-skeleton-loader type="image" height="20px" v-if="loading" />
            <span v-else>
              <span class="font_l">{{ data.item.row_index }}</span>
            </span>
          </td>
          <td
            v-for="(header, header_index) in data.headers"
            :key="header_index"
            :width="header.width ? header.width : 'auto'"
            :class="[rowPointer ? 'pointer' : '']"
          >
            <v-skeleton-loader type="image" height="20px" v-if="loading" />
            <div
              v-else
              :class="$vuetify.breakpoint.mdAndUp ? '' : 'center-div px-2 py-1'"
            >
              <div v-if="!$vuetify.breakpoint.mdAndUp">{{ header.text }}:</div>
              <v-spacer v-if="!$vuetify.breakpoint.mdAndUp" />
              <div v-if="header.type == 'checkbox'">
                <v-checkbox
                  v-if="header.show_box ? header.show_box(data.item) : true"
                  color="success"
                  :value="data.item.id"
                  v-model="selectedItem"
                  class="small-input center-checkbox"
                />
              </div>
              <div v-else-if="header.type == 'phone'" cols="6" class="ltr-item">
                <v-icon
                  class="font_16"
                  color="green"
                  @click="openCallDialog(header.value(data.item))"
                >
                  call
                </v-icon>
                <span test-tag="string_type" class="font_l">{{
                  header.value(data.item)
                }}</span>
              </div>

              <div v-else>
                <TableItem
                  :header="header"
                  :body="data.item"
                  @refreshTable="getDataFromApi()"
                />
              </div>
            </div>
          </td>
          <td v-if="btn_actions.length > 0">
            <v-skeleton-loader type="image" height="20px" v-if="loading" />
            <template v-else v-for="(btn, index) in btn_actions">
              <v-btn
              small
              class="white--text"
                :title="btn.text"
                :color="btn.color"
                :key="index + btn.text"
                :class="['py-3', 'ma-1', 'pa-2']"
                @click="btn.fun(data.item)"
                v-if="btn.show_fun(data.item)"
                :disabled="btn.disab_fun(data.item)"
              >
                <span style="font-size: 12px">{{ btn.text }}</span>
                <v-icon v-if="btn.icon" class="mr-1" size="16">{{
                  btn.icon
                }}</v-icon>
              </v-btn>
            </template>
          </td>
          <td v-if="action_items.length > 0" class="text-center border_b1">
            <span>
              <v-skeleton-loader type="image" height="20px" v-if="loading" />
              <div v-else>
                <v-menu
                  bottom
                  left
                  v-if="url != '/user/filter/' || data.item.id != 1"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="url == '/user/filter/' && data.item.id == 2"
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <template v-for="(action, index) in action_items">
                      <v-list-item
                        :key="index"
                        @click="action.fun(data.item)"
                        v-if="action.show_fun(data.item)"
                      >
                        <v-list-item-title>
                          {{ action.text }}
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-menu>
              </div>
            </span>
          </td>
          <td v-if="moreTD_items"></td>
        </tr>
      </template>
    </v-data-table>
    <TableFooter
      v-if="!footer"
      :total_item="total_item"
      :page="page"
      :page_count="page_count"
      @changePageRow="page_row = $event"
      @changePage="page = $event"
    />
    <AmpDelete
      :deleteUrl="autoDelete"
      :id="delete_dialog.item"
      @deleteItem="removeItem"
      v-model="delete_dialog.show"
    />
  </div>
</template>

<script>
import AmpDelete from "~/components/Base/AmpDelete.vue";
import TableItem from "~/components/DataTable/TableItem.vue";
import FilterItem from "~/components/DataTable/FilterItem.vue";
import TableFooter from "~/components/DataTable/TableFooter.vue";

export default {
  components: { FilterItem, TableItem, AmpDelete, TableFooter },
  props: {
    value: {
      type: Array,
    },
    no_refresh: {
      type: Boolean,
    },
    createShowFun: {
      type: Boolean,
      default: false,
    },
    createFun: {
      type: Function,
      default: () => {},
    },
    no_filter: {
      type: Boolean,
    },
    no_filter_actions: {
      type: Boolean,
    },
    bodyRequest: {
      type: Object,
    },
    title: {
      type: String,
      default: "",
    },
    excel: {
      type: Boolean,
      default: false,
    },
    pdf: {
      type: Boolean,
      default: false,
    },
    rowPointer: {
      type: Boolean,
      default: false,
    },
    rowClick: {
      type: Function,
      default: (item) => {},
    },
    localData: {
      type: Boolean,
    },
    dataArray: {
      type: Array,
    },
    table_key: {
      type: String,
    },
    // { store: ***, state: *** }
    storeState: {
      type: Object,
    },
    headers: {
      type: Array,
      required: true,
    },
    footer: { type: Boolean, required: false },
    url: {
      type: String,
      required: false,
    },
    createUrl: {
      type: String,
    },
    actions: {
      type: Array,
      default: () => [],
    },
    btn: {
      type: Boolean,
    },
    actionsList: {
      type: Array,
    },
    BTNactions: {
      type: Array,
    },
    autoUpdate: {
      type: String,
    },
    autoDelete: {
      type: String,
    },
    rootBody: {
      default: () => ({}),
    },
    filters: {
      default: () => ({}),
    },
    method: {
      type: String,
      default: "post",
    },
    autoLoad: {
      type: Boolean,
      default: true,
    },
    rowColor: {
      type: Function,
      default: (item) => {},
    },
    extraBtn: {
      type: Array,
      default: () => [],
    },
    pageRow: {
      type: Number,
    },
    perPage: {
      type: Number,
    },
    sortBy: {
      type: String,
      default: "created_at",
    },
    emitData: {
      default: "",
    },
  },
  data: () => ({
    page: 1,
    local: false,
    sort_by: "",
    desserts: [],
    totalCol: [],
    page_row: 50,
    page_count: 1,
    total_item: 0,
    loading: false,
    sort_desc: true,
    sort_by_type: "",
    selectedItem: [],
    timeInterval: false,
    store_state_items: [],
    pageInfo: null,
    delete_dialog: { show: false, item: null },
    call_dialog: { item: null, show: false },
  }),
  computed: {
    items_end() {
      if (this.localData) {
        let page = this.$store.state.dataTable.pageInfo.page;
        let perPage = this.$store.state.dataTable.pageInfo.paginate_num;
        let from = page * perPage - perPage;
        let to = page * perPage;
        return this.desserts.slice(from, to);
      } else {
        return this.desserts;
      }
    },
    header_end() {
      let items = this.headers.map((x) => {
        if (x.total) {
          this.totalCol.push({ value: x.value, total: 0 });
        }
        let type = "string";
        let filterCol = x.value;
        let fun_class = () => {};
        let filterType = "string";

        if (typeof x.type != "undefined") {
          type = x.type;
        }
        if (typeof x.filterType != "undefined") {
          filterType = x.filterType;
        }
        if (typeof x.fun_class != "undefined") {
          fun_class = x.fun_class;
        }
        let disableSort = x.disableSort;
        let icon = "search-outline";

        if (x.filterType == "date") {
          icon = "event_note";
        } else if (x.filterType == "integer") {
          icon = "checklist";
        }
        if (typeof x.filterCol != "undefined") {
          filterCol = x.filterCol;
        } else if (typeof x.value == "function") {
          disableSort = true;
        }
        let h_items = [];
        if (x.items) {
          h_items = x.items;
        }

        let sortIcon = "filter_list_off";
        if (this.sort_by == filterCol) {
          if (this.sort_desc) {
            sortIcon = "arrow_upward";
          } else {
            sortIcon = "arrow_downward";
          }
        }
        return {
          ...x,
          filterCol,
          fun_class,
          icon: icon,
          type: type,
          disableSort,
          text: x.text,
          items: h_items,
          value: x.value,
          color: x.color,
          width: x.width,
          icon2: x.icon2,
          sortIcon: sortIcon,
          disabled: x.disabled,
          function: x.function,
          getColor: x.getColor,
          filterType: filterType,
          filterable: x.filterable,
          iconCustomer: x.iconCustomer,
        };
      });
      return [...items];
    },
    btn_actions() {
      let items = [];
      if (this.BTNactions) {
        let actions = [...this.BTNactions];
        actions.forEach((element) => {
          items.push(element);
        });
      }
      if (this.autoUpdate && this.btn) {
        items.push({
          text: "ویرایش",
          color: "warning",
          fun: (body) => {
            this.$router.push(this.autoUpdate + "/" + body.id);
          },
        });
      }
      if (this.autoDelete && this.btn) {
        items.push({
          text: "حذف",
          color: "error",
          fun: (body) => {
            if (this.url == "/user/filter/" && (body.id == 1 || body.id == 2)) {
            } else {
              this.delete_dialog.show = true;
              this.delete_dialog.item = body.id;
            }
          },
        });
      }
      return items.map((x) => {
        let disab_fun = () => {
          return false;
        };
        let show_fun = () => {
          return true;
        };
        if (x.disab_fun) {
          disab_fun = x.disab_fun;
        }
        if (x.show_fun) {
          show_fun = x.show_fun;
        }
        return {
          ...x,
          show_fun,
          disab_fun,
        };
      });
    },
    action_items() {
      let items = [];
      if (this.autoUpdate && this.btn == false) {
        items.push({
          text: "ویرایش",
          fun: (body) => {
            this.$router.push(this.autoUpdate + "/" + body.id);
          },
        });
      }
      if (this.autoDelete && this.btn == false) {
        items.push({
          text: "حذف",
          fun: (body) => {
            if (this.url == "/user/filter/" && (body.id == 1 || body.id == 2)) {
            } else {
              this.delete_dialog.show = true;
              this.delete_dialog.item = body.id;
            }
          },
        });
      }
      items = [...items, ...this.actions];
      if (this.actionsList) {
        let actionsList = [...this.actionsList];
        actionsList.forEach((element) => {
          items.push(element);
        });
      }
      return items.map((x) => {
        let disab_fun = () => {
          return false;
        };
        let show_fun = () => {
          return true;
        };
        if (x.disab_fun) {
          disab_fun = x.disab_fun;
        }
        if (x.show_fun) {
          show_fun = x.show_fun;
        }
        return {
          ...x,
          show_fun,
          disab_fun,
        };
      });
    },
    moreTD_items() {
      if (this.action_items.length > 0 || this.btn_actions.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    moreTD_header() {
      if (this.action_items.length > 0 && this.btn_actions.length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    dataArray() {
      if (this.localData) {
        this.getDataFromApi();
      }
    },
    sort_by() {
      let pageInfo = {
        page: this.$store.state.dataTable.pageInfo.page,
        sortBy: this.sort_by,
        orderBy: this.$store.state.dataTable.pageInfo.orderBy,
        paginate_num: this.$store.state.dataTable.pageInfo.paginate_num,
      };
      this.$store.dispatch("dataTable/getPageInfo", pageInfo);
      this.sort_by = this.$store.state.dataTable.pageInfo.sortBy;
      if (!this.localData) {
        this.getDataFromApi();
      }
    },
    sort_desc() {
      let pageInfo = {
        page: this.$store.state.dataTable.pageInfo.page,
        sortBy: this.$store.state.dataTable.pageInfo.sortBy,
        orderBy: this.sort_desc,
        paginate_num: this.$store.state.dataTable.pageInfo.paginate_num,
      };
      this.$store.dispatch("dataTable/getPageInfo", pageInfo);
      this.sort_desc = this.$store.state.dataTable.pageInfo.orderBy;
      if (!this.localData) {
        this.getDataFromApi();
      }
    },
    page() {
      this.page = this.$store.state.dataTable.pageInfo.page;
      if (!this.localData) {
        this.getDataFromApi();
      }
    },
    page_row() {
      if (!this.localData) {
        this.getDataFromApi();
      }
    },
    filters: {
      deep: true,
      handler() {
        this.getDataFromApi();
      },
    },
    rootBody: {
      deep: true,
      handler() {
        this.getDataFromApi();
      },
    },
    selectedItem() {
      this.$emit("input", this.selectedItem);
    },
    value() {
      this.selectedItem = this.value;
    },
  },
  beforeMount() {
    this.$store.dispatch("dataTable/setPage", 1);
    if (this.localData && this.storeState) {
      this.$store.dispatch("dataTable/get_store_state", this.storeState);
      this.store_state_items =
        this.$store.state[this.storeState.store][this.storeState.state];
    }
    if (this.localData && this.perPage) {
      this.$store.dispatch("dataTable/setPaginateNum", this.perPage);
      this.pageInfo = this.$store.state.dataTable.pageInfo;
    }
  },
  mounted() {
    this.page = 1;
    if (this.sortBy) {
      this.sort_by = this.sortBy;
    } else {
      this.sort_by = this.$store.state.dataTable.pageInfo.sortBy;
    }
    this.sort_desc = this.$store.state.dataTable.pageInfo.orderBy;
    this.page_row = this.$store.state.dataTable.pageInfo.paginate_num;

    if (this.pageRow) {
      this.page_row = this.pageRow;
    }

    this.horizontalScroll();
  },
  methods: {
    getDataFromApi() {
      // getTableKey
      if (this.table_key) {
        this.$store.dispatch("dataTable/getTableKey", this.table_key);
      } else {
        this.$store.dispatch(
          "dataTable/getTableKey",
          this.$router.currentRoute.path
        );
      }
      this.loading = true;
      if (this.localData) {
        // paginate سمت کلاینت
        if (this.dataArray || this.storeState) {
          let items = [];
          this.local = true;
          if (this.dataArray) {
            items = this.dataArray.map((x) => ({
              ...x,
            }));
          }
          if (this.storeState) {
            items = this.store_state_items.map((x) => ({
              ...x,
            }));
          }
          //-------- فیلتر در حالت آفلاین
          let headers = this.headers;
          let filter_items = this.$store.state.dataTable.filters;
          let page = this.$store.state.dataTable.page;
          for (let key in filter_items) {
            headers.forEach((header) => {
              if (header.filterCol == key) {
                if (filter_items[key].op == "between") {
                  let first = filter_items[key].value[0];
                  let second = filter_items[key].value[1];
                  items = items.filter((x) => {
                    const test = this.$toJalali(
                      x[key],
                      "jYYYY/jMM/jDD",
                      "YYYY-MM-DD"
                    );
                    if (test > first && second > test) {
                      return true;
                    }
                    return false;
                  });
                }
                if (filter_items[key].op == ">") {
                  if (header.filterType == "date") {
                    let date = this.$toJalali(
                      filter_items[key].value,
                      "jYYYY/jMM/jDD",
                      "YYYY-MM-DD"
                    );
                    items = items.filter((x) => {
                      let mDate = this.$toJalali(
                        x[key],
                        "jYYYY/jMM/jDD",
                        "YYYY-MM-DD"
                      );
                      if (date < mDate) {
                        return true;
                      }
                      return false;
                    });
                  } else {
                    items = items.filter((x) => {
                      const element = filter_items[key].value;
                      if (element < x[key]) {
                        return true;
                      }
                      return false;
                    });
                  }
                }
                if (filter_items[key].op == "<") {
                  if (header.filterType == "date") {
                    let date = this.$toJalali(
                      filter_items[key].value,
                      "jYYYY/jMM/jDD",
                      "YYYY-MM-DD"
                    );
                    items = items.filter((x) => {
                      let mDate = this.$toJalali(
                        x[key],
                        "jYYYY/jMM/jDD",
                        "YYYY-MM-DD"
                      );
                      if (date < mDate) {
                        return false;
                      }
                      return true;
                    });
                  } else {
                    items = items.filter((x) => {
                      const element = filter_items[key].value;
                      if (element < x[key]) {
                        return false;
                      }
                      return true;
                    });
                  }
                }
                if (filter_items[key].op == "=") {
                  if (header.filterType == "date") {
                    let date = this.$toJalali(
                      filter_items[key].value,
                      "jYYYY/jMM/jDD",
                      "YYYY-MM-DD"
                    );

                    items = items.filter((x) => {
                      const element = date;
                      let mDate = this.$toJalali(
                        x[key],
                        "jYYYY/jMM/jDD",
                        "YYYY-MM-DD"
                      );
                      if (element == mDate) {
                        return true;
                      }
                      return false;
                    });
                  } else {
                    items = items.filter((x) => {
                      const element = filter_items[key].value;
                      if (element == x[key]) {
                        return true;
                      }
                      return false;
                    });
                  }
                }
                if (filter_items[key].op == "iexact") {
                  if (header.filterType == "integer") {
                    items = items.filter((x) => {
                      const element = filter_items[key].value;
                      if (x[key] != element) {
                        return true;
                      }
                      return false;
                    });
                  } else if (
                    header.filterType == "string" ||
                    header.filterType == undefined
                  ) {
                    items = items.filter((x) => {
                      const element = filter_items[key].value;
                      if (element && !x[key].includes(element)) {
                        return true;
                      }
                      return false;
                    });
                  }
                }
                if (filter_items[key].op == "LIKE") {
                  items = items.filter((x) => {
                    const element = filter_items[key].value;
                    if (typeof x[key] == "number") {
                      if (element && !x[key].toString().includes(element)) {
                        return false;
                      }
                    } else if (element && !x[key].includes(element)) {
                      return false;
                    }
                    return true;
                  });
                }
                if (filter_items[key].op == "start") {
                  items = items.filter((x) => {
                    const value = filter_items[key].value.replace("%", "");
                    const element = value;
                    let length = value.length;
                    let test;
                    if (typeof x[key] == "number") {
                      test = x[key].toString().slice(0, length);
                    } else {
                      test = x[key].slice(0, length);
                    }
                    if (element === test) {
                      return true;
                    }
                    return false;
                  });
                }
                if (
                  filter_items[key].op == "LIKE" &&
                  filter_items[key].value[filter_items[key].value.length - 1] ==
                    "%"
                ) {
                  // end
                  items = items.filter((x) => {
                    let element = filter_items[key].value.slice(
                      0,
                      filter_items[key].value.length - 1
                    );
                    let length = element.length;
                    let Xlength = x[key].length;
                    let test = x[key].slice(Xlength - length, Xlength);
                    if (element == test) {
                      return true;
                    }
                    return false;
                  });
                }
              }
              this.total_item = this.desserts.length;
            });
          } //-------- فیلتر در حالت آفلاین
          this.desserts = items;
          this.desserts = this.desserts.map((x, x_index) => ({
            ...x,
            row_index: x_index + 1,
          }));

          this.total_item = this.desserts.length;
          let page_count = parseInt(Math.ceil(this.total_item / this.page_row));
          this.page_count = page_count || 1;

          this.loading = false;
          //-------- مرتب سازی در حالت آفلاین
          if (this.sort_by) {
            if (this.sort_by_type == "date") {
              let test = this.sort_by;
              if (this.sort_desc) {
                this.desserts.sort(function (a, b) {
                  let da = new Date(a[test]),
                    db = new Date(b[test]);
                  return da - db;
                });
              } else if (!this.sort_desc) {
                this.desserts.sort(function (a, b) {
                  let da = new Date(a[test]),
                    db = new Date(b[test]);
                  return db - da;
                });
              }
            }
            let sortCol = this.sort_by;
            if (this.sort_by_type == "integer") {
              if (this.sort_desc) {
                this.desserts.sort(function (a, b) {
                  return a[sortCol] - b[sortCol];
                });
              } else if (!this.sort_desc) {
                this.desserts.sort(function (a, b) {
                  return b[sortCol] - a[sortCol];
                });
              }
            }
            if (
              this.sort_by_type == "string" ||
              this.sort_by_type == "select"
            ) {
              if (this.sort_desc) {
                this.desserts.sort(function (a, b) {
                  let fa = a[sortCol].toLowerCase(),
                    fb = b[sortCol].toLowerCase();
                  if (fa < fb) {
                    return -1;
                  }
                  if (fa > fb) {
                    return 1;
                  }
                  return 0;
                });
              } else if (!this.sort_desc) {
                this.desserts.sort(function (a, b) {
                  let fa = a[sortCol].toLowerCase(),
                    fb = b[sortCol].toLowerCase();
                  if (fa > fb) {
                    return -1;
                  }
                  if (fa < fb) {
                    return 1;
                  }
                  return 0;
                });
              }
            }
          } //-------- مرتب سازی در حالت آفلاین
        }
        if (this.url) {
          //اطلاعات از سرور گرفته میشود ولی مرتب سازی و پیجینیت نمیشود
          let form = {
            filters: this.$store.state.dataTable.filters,
            sortBy: this.$store.state.dataTable.pageInfo.sortBy,
            orderBy: !this.$store.state.dataTable.pageInfo.orderBy,
          };
          if (this.filters) {
            for (const key in this.filters) {
              form.filters[key] = this.filters[key];
            }
          }
          for (const key in this.rootBody) {
            const element = this.rootBody[key];
            if (form[key]) {
              form[key] += "," + element;
            } else {
              form[key] = element;
            }
          }
          this.$reqApi(this.url, form)
            .then((response) => {
              {
                this.desserts = response.map((x, x_index) => ({
                  ...x,
                  row_index: x_index + 1,
                }));
                this.total_item = response.length;
              }
              let page_count = parseInt(
                Math.ceil(this.total_item / this.page_row)
              );
              this.page_count = page_count || 1;
              this.$emit("getData", response);
              this.loading = false;
            })
            .catch((error) => {
              this.desserts = [];
              this.loading = false;
            });
        }
      } else {
        let filters = {};
        let filter_items = this.$store.state.dataTable.filters;
        for (const key in filter_items) {
          if (filter_items[key].op == "between") {
            filters[key] = {
              op: filter_items[key].op,
              from: filter_items[key].value[0],
              to: filter_items[key].value[1],
            };
          } else {
            filters[key] = filter_items[key];
          }
        }
        // paginate سمت سرور
        // تست orderBy
        let sort_by = this.$store.state.dataTable.pageInfo.sortBy;
        let form = {
          filters,
          paginate: true,
          paginate_num: this.$store.state.dataTable.pageInfo.paginate_num,
          sortBy: sort_by,
          orderBy: !this.$store.state.dataTable.pageInfo.orderBy
            ? "ASC"
            : "DESC",
          page: this.$store.state.dataTable.pageInfo.page,
          row_number: this.$store.state.dataTable.pageInfo.paginate_num,
        };
        if (this.filters) {
          for (const key in this.filters) {
            form.filters[key] = this.filters[key];
          }
        }
        if (this.bodyRequest) {
          for (const key in this.bodyRequest) {
            form.filters[key] = this.bodyRequest[key];
          }
        }
        for (const key in this.rootBody) {
          const element = this.rootBody[key];
          if (form[key]) {
            if (key == "sortBy") {
              if (sort_by.length == 0) {
                form[key] = element;
              } else {
                form[key] = sort_by;
              }
            } else {
              form[key] += "," + element;
            }
          } else {
            form[key] = element;
          }
        }

        if (this.pageRow) {
          form["row_number"] = this.pageRow;
          form["paginate_num"] = this.pageRow;
        }
        this.$reqApi(this.url, form)
          .then((response) => {
            if (response) {
              this.desserts = response.model.data.map((x, x_index) => ({
                ...x,
                row_index: x_index + 1 + (this.page - 1) * this.page_row,
              }));

              this.total_item = response.model.total;
            }
            let page_count = parseInt(
              Math.ceil(this.total_item / this.page_row)
            );
            this.page_count = page_count || 1;
            this.$emit("getData", response);
            this.loading = false;
          })
          .catch((error) => {
            this.desserts = [];
            this.loading = false;
          });
      }

      // جمع یک col
      for (let i = 0; i < this.totalCol.length; i++) {
        this.totalCol[i].total = 0;
      }
      this.desserts.forEach((element) => {
        for (let i = 0; i < this.totalCol.length; i++) {
          this.totalCol[i].total += Number(element[this.totalCol[i].value]);
        }
      });
      for (let i = 0; i < this.totalCol.length; i++) {
        if (this.totalCol[i].total) {
          this.totalCol[i].total = this.totalCol[i].total.toFixed(2);
        }
      }
      // جمع یک col
    },

    async exportTable(type) {
      if (this.localData) {
        if (type == "pdf") {
          this.$exportPDF(this.headers, this.desserts);
        } else if (type == "excel") {
          this.$exportCSV(this.headers, this.desserts);
        }
      } else {
        // *********excel server req********
        let filters = this.$store.state.dataTable.filters;
        filters;
        let form = {
          filters,
          sortBy: this.sort_by,
          orderBy: !this.sort_desc,
        }; // ---default filter
        if (this.filters) {
          for (const key in this.filters) {
            form.filters[key] = this.filters[key];
          }
        }
        if (this.bodyRequest) {
          for (const key in this.bodyRequest) {
            form.filters[key] = this.bodyRequest[key];
          }
        }
        for (const key in this.rootBody) {
          const element = this.rootBody[key];
          if (form[key]) {
            if (key == "sortBy") {
              if (sort_by.length == 0) {
                form[key] = element;
              } else {
                form[key] = sort_by;
              }
            } else {
              form[key] += "," + element;
            }
          } else {
            form[key] = element;
          }
        }
        this.$reqApi(this.url + "?row_number=" + this.total_item, form)
          .then((response) => {
            let xlsxRows = [];
            if (response) {
              xlsxRows = response.model.data.map((x) => ({
                ...x,
              }));
            }
            if (type == "pdf") {
              this.$exportPDF(this.headers, xlsxRows);
            } else if (type == "excel") {
              this.$exportCSV(this.headers, xlsxRows);
            }
          })
          .catch((error) => {
            this.$toast.error("خطا در دریافت اطلاعات");
          });
      }
    },
    onRowClick(row) {
      this.rowClick(row);
    },
    changeSort(x) {
      if (x.disableSort) {
        return;
      }
      if (x.value == "row_index") {
        return;
      }
      if (this.sort_by == x.value) {
        this.sort_desc = !this.sort_desc;
      } else {
        this.sort_by = x.value;
        this.sort_by_type = x.type;
        this.sort_desc = true;
      }

      this.getDataFromApi();
    },
    redirectToPage(url, id = null) {
      let redirect = url;
      if (id) {
        redirect += "/" + id;
      }
      this.$router.push(redirect);
    },
    removeItem(item) {
      this.getDataFromApi();
      this.$emit("deleteItem", item);
    },
    getColor(data) {
      if (this.rowColor) {
        return this.rowColor(data);
      }
      return data.index % 2 == 0 ? "table_even" : "lightcolor";
    },
    horizontalScroll() {
      const slider = document.querySelector(".v-data-table__wrapper");
      let startX;
      let scrollLeft;
      let isDown = false;

      slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("active");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });
      slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.classList.remove("active");
      });
      slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("active");
      });
      slider.addEventListener("mousemove", (e) => {
        if (isDown) {
          let x = e.pageX - slider.offsetLeft;
          let walk = (x - startX) * 1;
          slider.scrollLeft = scrollLeft - walk;
        }
      });
    },
    openCallDialog(username) {
      this.$reqApi("message/issabel-request-call", { username: username }).then(
        (res) => {
          
        }
      ).catch((err)=>{
        console.log(err);
      })
      this.call_dialog.show = true;
      this.call_dialog.item = username;
    },
    emitDataTable() {
      this.$emit("emitDataTable", this.desserts);
    },
  },
};
</script>

<style>
.v-data-table--mobile > .v-data-table__wrapper tbody {
  display: contents !important;
}
.v-data-table__wrapper {
  position: relative;
}
.items {
  position: relative;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  cursor: pointer;
}
.items.active {
  cursor: grabbing;
  cursor: -webkit-grabbing;
  transform: scale(1);
}
/* -------------------- */
.header-text {
  font-size: 15px;
  margin-top: 7px;
  text-align: center;
}
.search-input {
  padding-top: 0;
  margin-top: 0;
  height: 50px;
}
.imageShow {
  margin: 5px;
}
.valueItem {
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  direction: rtl;
}
.dataTableCard {
  padding: 20px;
  height: 100%;
}
.titleDataTable {
  margin-bottom: 25px;
  margin-top: -50px;
  border-radius: 7px !important;
}
.dataTableCardText {
  height: 60px !important;
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  padding: 0 !important;
}
.dataTableCardText > span {
  font-size: 22px;
  margin: auto;
}

.search-input > .v-input__control {
  min-height: 40px !important;
}
td {
  text-align: center;
  padding: 0 !important;
}
th {
  padding: 0 !important;
}
tfoot > tr > th {
  padding: 0 !important;
}
.bt-tr-mobile {
  margin-top: 4px;
  display: grid !important;
}
.bt-tr-mobile > td {
  height: auto !important;
  border-bottom: #c1c1c1 solid 1px !important;
}
.header_bg {
  background-color: #fd5800;
}
</style>

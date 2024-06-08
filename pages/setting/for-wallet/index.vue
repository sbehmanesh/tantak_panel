<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoUpdate="/setting/for-wallet"
      createUrl="/setting/for-wallet/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "for_wallet" },
    title: "لیست بابت های کیف پول",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: "عنوان ", value: "value" }];
  },
};
</script>

<template>
  <div class="bpmn-dashboard-test">
    <BpmnBaseTable 
      report_slug="gzarsh-tst-1-1" 
      :only_me="false"  
    />
  </div>
</template>

<script>
import BpmnBaseTable from "~/components/BPMN/BpmnBaseTable.vue";

export default {
  components: {
    BpmnBaseTable,
  },
};
</script>

<style scoped>
.bpmn-dashboard-test {
  padding: 16px;
}
</style>

<template>
  <div class="bpmn-dashboard-test">
    <BpmnBaseTable 
      report_slug="sbd-hay-khryd" 
      :only_me="false"
      :extra_row_actions="tipaxRowActions"
      @action="action"
    />

    <TaskActionDialog
      v-model="taskActionDialog"
      :task="selectedTask"
      @cancel="onTaskDialogCancel"
      @completed="handleTaskCompleted"
    />

    <TaskHistoryDialog
      v-model="historyDialog"
      :task="selectedTask"
      :process_request_id="processRequestId"
    />

    <TipaxDialog
      v-model="tipax_dialog"
      :basket-row="selected_basket_row"
    />
  </div>
</template>

<script>
import TipaxDialog from "~/components/BPMN/TipaxDialog.vue";
import BpmnBaseTable from "~/components/BPMN/BpmnBaseTable.vue";
import TaskActionDialog from "~/components/BPMN/TaskActionDialog.vue";
import TaskHistoryDialog from "~/components/BPMN/TaskHistoryDialog.vue";

export default {
  data: () => ({
    selectedTask: null,
    historyDialog: false,
    processRequestId: null,
    taskActionDialog: false,
    tipax_dialog: false,
    selected_basket_row: null,
  }),
  components: {
    BpmnBaseTable,
    TaskActionDialog,
    TaskHistoryDialog,
    TipaxDialog,
  },
  methods: {
    action(event){
      if(event.action == "history"){
        this.historyDialog = true
        this.processRequestId = event.row.id
        this.selectedTask = event.row.active_tasks[0]
      }else if(event.action == "do"){
        this.taskActionDialog = true
        this.selectedTask = event.row.active_tasks[0]
      }
    },
    onTaskDialogCancel() {
      this.taskActionDialog = false
      this.selectedTask = null
    },
    handleTaskCompleted() {
      this.taskActionDialog = false
      this.selectedTask = null
    },
    openTipaxDialog(row_item) {
      this.selected_basket_row = row_item || null
      this.tipax_dialog = true
      console.log('selected_basket_row',this.selected_basket_row)
    },
  },
  computed: {
    tipaxRowActions() {
      return [
        {
          text: "ثبت در تیپاکس",
          color: "deep-purple",
          icon: "local_shipping",
          show_fun: (row_item) => Boolean(row_item?.id),
          fun: (row_item) => this.openTipaxDialog(row_item),
        },
      ]
    },
  },
  watch: {
    tipax_dialog(value) {
      if (!value) {
        this.selected_basket_row = null
      }
    },
  },
};
</script>

<style scoped>
.bpmn-dashboard-test {
  padding: 16px;
}
</style>

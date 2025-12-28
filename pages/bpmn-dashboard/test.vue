<template>
  <div class="bpmn-dashboard-test">
    <BpmnBaseTable 
      report_slug="gzarsh-tst-1-1" 
      :only_me="false"
      @action="action"
    />

    <TaskActionDialog
      v-model="taskActionDialog"
      :task="selectedTask"
      @cancel="onTaskDialogCancel"
      @completed="handleTaskCompleted"
    />

    <TaskHistoryDialog v-model="historyDialog" :task="selectedTask" />
  </div>
</template>

<script>
import BpmnBaseTable from "~/components/BPMN/BpmnBaseTable.vue";
import TaskActionDialog from "~/components/BPMN/TaskActionDialog.vue";
import TaskHistoryDialog from "~/components/BPMN/TaskHistoryDialog.vue";

export default {
  data: () => ({
    selectedTask: null,
    historyDialog: false,
    taskActionDialog: false,
  }),
  components: {
    BpmnBaseTable,
    TaskActionDialog,
    TaskHistoryDialog,
  },
  methods: {
    action(event){
      if(event.action == "history"){
        this.historyDialog = true
        this.selectedTask = event.row
      }else if(event.action == "do"){
        this.taskActionDialog = true
        this.selectedTask = event.row
      }
    },
    onTaskDialogCancel() {
      this.taskActionDialog = false
      this.selectedTask = null
    },
    handleTaskCompleted() {
      this.taskActionDialog = false
      this.selectedTask = null
    }
  }
};
</script>

<style scoped>
.bpmn-dashboard-test {
  padding: 16px;
}
</style>

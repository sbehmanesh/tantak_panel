<template>
  <div class="bpmn-dashboard-test">
    <BpmnBaseTable 
      report_slug="gzarsh-tst-1-1" 
      :only_me="false"
      @action="action"
    />
  </div>

  <TaskActionDialog
    v-model="taskActionDialog"
    :task="selectedTask"
    :variables="taskVariables"
    :form-data="taskFormData"
    :loading="processingTask"
    @cancel="onTaskDialogCancel"
    @submit="confirmTaskAction"
    @action="handleTaskFormAction"
  />

  <TaskHistoryDialog v-model="historyDialog" :task="selectedTask" />
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
    }
  }
};
</script>

<style scoped>
.bpmn-dashboard-test {
  padding: 16px;
}
</style>

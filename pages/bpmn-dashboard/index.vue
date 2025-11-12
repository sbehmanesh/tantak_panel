<template>
  <div>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="12" class="mt-2">
        <!-- Header with Start Process Button -->
        <v-row class="justify-space-between align-center ml-2">
          <v-col cols="12" md="12" class="text-left">
            <amp-button
              text="شروع فرآیند جدید"
              color="primary"
              icon="play_arrow"
              @click="openProcessList"
            />
          </v-col>
        </v-row>

        <!-- Tasks Table -->
        <BaseTable
          :headers="taskHeaders"
          bpmn-url="/tasks"
          localData
          :loading="loadingTasks"
          :BTNactions="taskActions"
          :filters="taskFilters"
          @getData="getTasksData"
          ref="tasksTable"
        />

        <!-- Process List Dialog -->
        <v-dialog v-model="processListDialog" persistent max-width="800px">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">لیست فرآیندها</span>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="processSearch"
                append-icon="search"
                label="جستجو در فرآیندها"
                single-line
                hide-details
                class="shrink"
              ></v-text-field>
            </v-card-title>
            <v-card-text class="pa-0">
              <ProcessList 
                :processes="filteredProcesses"
                :loading="loadingProcesses"
                @start-process="startProcess"
                @close-dialog="processListDialog = false"
              />
            </v-card-text>
          </v-card>
        </v-dialog>

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
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProcessList from '~/components/BPMN/ProcessList.vue'
import TaskActionDialog from '~/components/BPMN/TaskActionDialog.vue'

export default {
  components: {
    ProcessList,
    TaskActionDialog
  },
  data() {
    return {
      loadingTasks: false,
      loadingProcesses: false,
      processingTask: false,
      tasks: [],
      processes: [],
      selectedProcess: null,
      selectedTask: null,
      processListDialog: false,
      taskActionDialog: false,
      taskVariables: [],
      taskFormData: {},
      processSearch: '',
      
      taskHeaders: [
        {
          text: "نام وظیفه",
          value: "element_name",
          sortable: true
        },
        {
          text: "فرآیند",
          value: (body) => {
            if (body.process) {
              return body.process.name;
            }
            return "";
          }
        },
        {
          text: "تاریخ ایجاد",
          value: "created_at",
          sortable: true,
          filterType: "date",
          value: (body) => body.created_at ? this.$toJalali(body.created_at) : ""
        }
      ],
      
      taskActions: [
        {
          color: "primary",
          icon: "play_arrow",
          text: "انجام وظیفه",
          fun: (task) => this.completeTask(task),
          show_fun: (task) => {
            return task.status === 'ACTIVE'
          }
        },
        {
          color: "info",
          icon: "info",
          text: "جزئیات",
          fun: "details",
          fun: (task) => this.showTaskDetails(task),
        }
      ],
      
      taskFilters: {
        status: {
          op: "in",
          value: ["in_progress", "pending"]
        }
      }
    }
  },
  
  computed: {
    filteredProcesses() {
      let filteredProcessList = []
      if (this.processSearch){
        const search = this.processSearch.toLowerCase()
        filteredProcessList = this.processes.filter(process => 
          process.name?.toLowerCase().includes(search) ||
          process.description?.toLowerCase().includes(search) ||
          process.key?.toLowerCase().includes(search)
        )
      }else{
        filteredProcessList = this.processes
      }
      
      let finalProcessList = []
      filteredProcessList.forEach(item => {
        item.start_events.forEach(start_event => {
          finalProcessList.push({
              'process':item,
              'start_event_id': start_event.id,
              'start_event_name': start_event.name,
          })
        })
      })
      console.log('finalProcessList',finalProcessList)
      return finalProcessList
    }
  },
  
  async mounted() {
    this.$store.dispatch('setPageTitle', 'داشبورد BPMN')
    this.$refs.tasksTable.getDataFromApi()
  },
  
  methods: {
    async loadProcesses() {
      this.loadingProcesses = true
      try {
        // Get available processes
        const response = await this.$reqBpmn('/start_processes', 'get', {
          perPage: 100,
          status: 'active'
        })
        
        this.processes = response.data || response
      } catch (error) {
        this.$toast.error('خطا در بارگذاری لیست فرآیندها')
        console.error('Error loading processes:', error)
      } finally {
        this.loadingProcesses = false
      }
    },

    async openProcessList() {
      this.processListDialog = true
      this.processSearch = ''
      if (this.processes.length === 0) {
        await this.loadProcesses()
      }
    },

    async startProcess(process) {
      this.selectedProcess = process.process
      this.processListDialog = false

      try {
        // Start the process - ProcessMaker typically starts with default variables
        const startResponse = await this.$reqBpmn(
          `/process_events/${process.process.id}?event=${process.start_event_id}`, 
          'post', 
          {}
        )
        
        this.$toast.success(`فرآیند "${process.process.name}" با موفقیت شروع شد`)
        
        // Reload tasks to see if new task is assigned
        await this.loadTasks()
        
      } catch (error) {
        this.$toast.error('خطا در شروع فرآیند')
        console.error('Error starting process:', error)
      }
    },

    async handleTaskAction(action, task) {
      if (action.fun === 'complete') {
        await this.completeTask(task)
      } else if (action.fun === 'details') {
        this.showTaskDetails(task)
      }
    },

    async completeTask(task) {
      this.selectedTask = task
      
      try {
        // Get task variables and form
        const taskData = await this.$reqBpmn(`/tasks/${task.id}?include=screen,data`, 'get')
        const screenConfig = taskData?.screen?.config || []
        const items = Array.isArray(screenConfig) && screenConfig.length > 0
          ? screenConfig[0]?.items || []
          : []

        this.taskVariables = Array.isArray(items) ? items : []
        const initialData = taskData?.data || {}
        this.taskFormData = {}

        this.taskVariables.forEach((variable) => {
          const name = variable?.config?.name
          if (!name) {
            return
          }
          const hasExistingValue = Object.prototype.hasOwnProperty.call(initialData, name)
          const value = hasExistingValue ? initialData[name] : undefined
          this.$set(this.taskFormData, name, this.normalizeFieldValue(value, variable))
        })
        
        this.taskActionDialog = true
      } catch (error) {
        this.$toast.error('خطا در دریافت اطلاعات وظیفه')
        console.error('Error getting task details:', error)
      }
    },

    async confirmTaskAction() {
      this.processingTask = true
      try {
        // Complete the task with form data
        await this.$reqBpmn(
          `/tasks/${this.selectedTask.id}/complete`, 
          'post', 
          this.taskFormData
        )
        
        this.$toast.success('وظیفه با موفقیت انجام شد')
        this.taskActionDialog = false
        
        // Reload tasks
        await this.loadTasks()
        
      } catch (error) {
        this.$toast.error('خطا در انجام وظیفه')
        console.error('Error completing task:', error)
      } finally {
        this.processingTask = false
      }
    },

    showTaskDetails(task) {
      console.log('task',task)
      this.$toast.info(`جزئیات وظیفه: ${task.element_name}`)
    },
    normalizeFieldValue(value, variable) {
      const component = variable?.component
      const config = variable?.config || {}

      if (component === 'FormCheckbox') {
        if (value === undefined || value === null || value === '') {
          return Boolean(config.initiallyChecked)
        }
        if (typeof value === 'string') {
          return ['true', '1', 'on', 'yes'].includes(value.toLowerCase())
        }
        if (typeof value === 'number') {
          return value === 1
        }
        return Boolean(value)
      }

      if (component === 'FormSelectList') {
        if (config.options?.allowMultiSelect) {
          if (Array.isArray(value)) {
            return value
          }
          if (value === undefined || value === null || value === '') {
            return []
          }
          return [value]
        }
        if (value === undefined || value === null) {
          return config.fieldValue ?? ''
        }
        return value
      }

      if (component === 'FileUpload') {
        if (config.multipleUpload) {
          if (Array.isArray(value)) {
            return value
          }
          if (!value) {
            return []
          }
          return [value]
        }
        if (value === undefined || value === null) {
          return config.fieldValue ?? ''
        }
        return value
      }

      if (value === undefined || value === null) {
        return config.fieldValue ?? ''
      }
      return value
    },
    onTaskDialogCancel() {
      this.taskActionDialog = false
    },
    handleTaskFormAction(button) {
      console.debug('Task form action triggered', button)
    },

    getTasksData(event) {
      // Handle table data if needed
      if (event && event.model && event.model.data) {
        this.tasks = event.model.data
      }
    }
  }
}
</script>

<style scoped>
.class-bg {
  background: linear-gradient(to left, #384e58e7, #607d8baf, #8597a1cc);
}
</style>

<template>
  <v-row class="justify-center mt-5">
    <v-col cols="12" md="8" class="pa-0">
      <v-stepper  v-model="e1" class="elevation-0">
        <v-col cols="12" md="12" class="pa-0">
              <v-stepper-header>
                  <v-stepper-step
                    :editable="e1 > 1 || valid_step1 ? true : false"
                    color="blue-grey"
                    :complete="e1 > 1"
                    step="1"
                  >
                    <span> مشخصات فردی </span>
                  </v-stepper-step>

                  <v-stepper-step
                    :editable="e1 > 2 || valid_step2 ? true : false"
                    color="blue-grey"
                    :complete="e1 > 2"
                    step="2"
                  >
                    مشخصات تماس
                  </v-stepper-step>

                  <v-stepper-step
                    :editable="e1 > 3 || valid_step3 ? true : false"
                    color="blue-grey"
                    step="3"
                    :complete="e1 > 3"
                  >
                    تحصیالت</v-stepper-step
                  >
                  <v-stepper-step
                    :editable="e1 > 4 || valid_step4 ? true : false"
                    color="blue-grey"
                    step="4"
                    :complete="e1 > 4"
                  >
                    تجربه و سوابق کار</v-stepper-step
                  >
                  <v-stepper-step
                    :editable="e1 > 5 || valid_step5 ? true : false"
                    color="blue-grey"
                    step="5"
                    :complete="e1 > 5"
                  >
                    مهارت ها</v-stepper-step
                  >
                  <v-stepper-step
                    :editable="e1 > 6 || valid_step6 ? true : false"
                    color="blue-grey"
                    step="6"
                    :complete="e1 > 6"
                  >
                    اطلاعات پایه
                  </v-stepper-step>
                  <v-stepper-step
                    :editable="e1 > 7 || valid_step7 ? true : false"
                    color="blue-grey"
                    step="7"
                  >
                    حقوق درخواستی
                  </v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>

                  <v-stepper-content step="1">
                    <v-form v-model="valid_step1">
                      <v-row class="d-flex justify-center my-1">
                        <v-col cols="6" class="text-center">
                          <h1 class="pt-1">
                            <small class="blue-grey--text">
                              چنانچه کاربرمورد نظر در لیست کاربران وجود نداشت
                              کاربر جدید ثبت میشود
                            </small>
                          </h1>
                          <v-divider class="mt-1"></v-divider>
                        </v-col>

                        <v-col cols="12" md="12" class="pa-0">
                          <UserSelectForm
                            text="کاربر مورد نظر را انتخاب کنید"
                            v-model="user"
                            url="user"
                            :role-id="[]"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-input
                            text="نام"
                            v-model="form.first_name"
                            rules="require"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-input
                            text="نام خانوادگی"
                            v-model="form.last_name"
                            rules="require"
                          />
                        </v-col>

                        <v-col class="pa-0" cols="12" md="6">
                          <amp-jdate
                            text="تاریخ تولد"
                            rules="require"
                            :is-number="true"
                            v-model="form.birth_date"
                          />
                        </v-col>
                        <v-col cols="12" md="6" class="pa-0">
                          <amp-input
                            text="کد ملی"
                            rules="nationalCode,require"
                            :is-number="true"
                            v-model="form.national_code"
                          />
                        </v-col> </v-row
                    ></v-form>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <v-form v-model="valid_step2">
                      <v-row class="my-1">
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-input
                            class="ltr-item"
                            text=" شماره همراه "
                            rules="phone,require"
                            v-model="form.phone_number"
                          />
                        </v-col>
                        <v-col cols="12" md="6" class="pa-0">
                          <amp-input
                            text="آدرس الکترونیکی"
                            rules="email"
                            dir="ltr"
                            v-model="form.email"
                        /></v-col>

                        <v-col cols="12" md="12" class="pa-0">
                          <amp-textarea
                            text="آدرس دقیق محل سکونت کاربر"
                            v-model="form.address"
                            rules="require"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-stepper-content>

                  <v-stepper-content step="3">
                    <v-form v-model="valid_step3">
                      <v-row class="d-flex justify-center my-1">
                        <v-col class="pa-0" cols="12" md="4">
                          <amp-input
                            text="آخرین مدرک تحصیلی"
                            v-model="form.highest_degree"
                            rules="require"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="4">
                          <amp-input
                            text=" رشته تحصیلی"
                            v-model="form.field_study"
                            rules="require"
                          />
                        </v-col>

                        <v-col cols="12" md="4" class="pa-0">
                          <amp-input
                            text=" معدل"
                            cClass="ltr-item"
                            v-model="form.average"
                          />
                        </v-col>

                        <v-col class="pa-0" cols="12" md="12">
                          <amp-input
                            text="محل تحصیل"
                            rules="require"
                            v-model="form.educational_institution"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-stepper-content>
                  <v-stepper-content step="4">
                    <v-form v-model="valid_step4">
                      <v-row class="d-flex justify-center my-1">
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-input
                            text="  محل کار قبلی"
                            v-model="form.previous_workplace"
                            rules="require"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-input
                            text="  وظایف"
                            v-model="form.job_responsibilities"
                            rules="require"
                          />
                        </v-col>

                        <v-col class="pa-0" cols="12" md="6">
                          <amp-input
                            text="  میزان حقوق دریافتی (ریال)"
                            is-price
                            cClass="ltr-item"
                            v-model="form.salary_received"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-input
                            text="علت جدایی"
                            rules="require"
                            v-model="form.separation_reason"
                          />
                        </v-col>
                        <v-col cols="12" md="6" class="pa-0">
                          <amp-jdate
                            text=" مدت زمان اشتغال شروع از"
                            rules="require"
                            :is-number="true"
                            v-model="form.employment_start_date"
                          />
                        </v-col>
                        <v-col cols="12" md="6" class="pa-0">
                          <amp-jdate
                            text="تا"
                            rules="require"
                            :is-number="true"
                            v-model="form.employment_end_date"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-stepper-content>
                  <v-stepper-content step="5">
                    <v-form v-model="valid_step5">
                      <v-row class="d-flex justify-center my-1">
                        <v-col class="" cols="12" md="12">
                          <v-btn
                            @click="addItems('skills')"
                            height="38"
                            color="blue-grey lighten-1"
                            block
                            outlined
                            class="mb-3"
                          >
                            <h1>مهارت های فنی و نرم افزاری</h1>
                            <v-icon class="mr-6"
                              >control_point_duplicate</v-icon
                            >
                          </v-btn>
                          <v-row class="mt-5">
                            <v-col
                              class="pa-0 text-start"
                              cols="12"
                              md="6"
                              v-for="(x, i) in skills_user"
                              :key="i"
                            >
                              <amp-input
                                v-model="x.text"
                                :placeholder="`${i + 1}`"
                              ></amp-input>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col class="" cols="12" md="12">
                          <v-btn
                            @click="addItems('languages')"
                            height="38"
                            color="blue-grey lighten-1"
                            block
                            outlined
                            class="mb-3"
                          >
                            <h1>تسلط بر زبان های خارجی و میزان تسلط</h1>
                            <v-icon class="mr-6"
                              >control_point_duplicate</v-icon
                            >
                          </v-btn>
                          <v-row class="mt-5">
                            <v-col
                              cols="12"
                              v-for="(x, i) in languages"
                              :key="i"
                              class="d-flex pa-0 align-center"
                            >
                              <v-col class="pa-0 text-start" cols="12" md="9">
                                <amp-input
                                  v-model="x.lang"
                                  :placeholder="`${i + 1}`"
                                ></amp-input>
                              </v-col>
                              <v-col cols="12" md="3" class="pa-0">
                                <amp-autocomplete
                                  placeholder="سطح تسلط"
                                  v-model="x.level"
                                  :items="language_level"
                                ></amp-autocomplete>
                              </v-col>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col class="pa-0" cols="12" md="12">
                          <amp-textarea
                            text="  تشریح مهارت ها "
                            v-model="form.description_skills"
                            rules="require"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-stepper-content>
                  <v-stepper-content step="6">
                    <v-form v-model="valid_step6">
                      <v-row class="d-flex justify-center my-1">
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-select
                            text="شیفت کاری"
                            v-model="form.work_shift"
                            :items="work_shift"
                            rules="require"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-select
                            text="وضعیت تاهل "
                            v-model="form.marital_status"
                            :items="marital_status"
                            rules="require"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-select
                            text=" وضعیت خدمت وظیفه"
                            v-model="form.military_service_status"
                            :items="military_service_status"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="6">
                          <AmpUploadFileNew
                            title="آپلود حداقل یک مدرک شناسایی عکس دار "
                            multiple
                            v-model="form.file"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="12">
                          <amp-textarea
                            text="درصورت وضعیت سلامتی نا سالم بیماری را شرح دهید"
                            v-model="form.description_disease"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-stepper-content>
                  <v-stepper-content step="7">
                    <v-form v-model="valid_step7">
                      <v-row class="d-flex justify-center my-1">
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-input
                            text="میزان حقوق درخواستی (ریال)"
                            is-price
                            v-model="form.requested_salary"
                            rules="require"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-select
                            text="شامل اضافه کار"
                            v-model="form.overtime"
                            :items="$store.state.static.bool_text"
                            rules="require"
                          />
                        </v-col>

                        <v-col class="pa-0" cols="12" md="6">
                          <amp-select
                            text="شامل پاداش است"
                            v-model="form.reward"
                            :items="$store.state.static.bool_text"
                            rules="require"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="6">
                          <amp-select
                            text="عنوان شغلی "
                            v-model="form.job_position_id"
                            :items="job_position"
                            rules="require"
                          />
                        </v-col>
                        <v-col class="pa-0" cols="12" md="12">
                          <AmpUploadFileNew
                            title="بارگذری فایل pdf"
                            v-model="form.pdf_path"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-stepper-content>
                </v-stepper-items>

                  <v-row class="align-center justify-center mx-10 my-4">
                    <v-btn @click="redirectPage" color="red lighten-2">
                      <span class="white--text mx-1">انصراف</span>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      v-if="e1 > 1"
                      @click="e1--"
                      color="red lighten-2"
                      class="mx-2"
                    >
                      <v-icon color="white">chevron_right</v-icon>
                      <span class="white--text">برگشت</span>
                    </v-btn>
                    <v-btn
                      v-if="e1 < 7"
                      :disabled="!Boolean(check_validations)"
                      color="blue-grey"
                      @click="e1++"
                    >
                      <span class="white--text mx-1">بعدی</span>
                      <v-icon color="white">chevron_left</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="e1 == 7"
                      :disabled="!Boolean(check_validations)"
                      color="blue-grey"
                      @click="submit"
                    >
                      <span class="white--text mx-1">ثبت اطلاعات</span>
                    </v-btn>
                  </v-row>
             
          
        </v-col>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: {
    UserSelectForm,
  },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid_step1: false,
    valid_step2: false,
    valid_step3: false,
    valid_step4: false,
    valid_step5: false,
    valid_step6: false,
    valid_step7: false,

    e1: 1,
    loading: false,
    createUrl: "/employment-form/insert",
    updateUrl: "/employment-form/update",
    showUrl: "/employment-form/show",
    work_shift: [
      { text: "صبح", value: "morning" },
      { text: "عصر", value: "evening" },
      { text: "هردو", value: "both" },
    ],
    marital_status: [
      { text: "مجرد", value: "single" },
      { text: "متاهل", value: "married" },
    ],

    military_service_status: [
      { text: "دارای کارت پایان خدمت", value: "completed_service" },
      { text: "معافیت پزشکی", value: "medical_exemption" },
      {
        text: "معافیت های موقت مثل تحصیلی",
        value: "temporary_education_deferment",
      },
      { text: "هیچکدام", value: "none" },
    ],
    languages: [],
    job_position: [],
    language_level: [
      { text: "1", value: "1" },
      { text: "2", value: "2" },
      { text: "3", value: "3" },
      { text: "4", value: "4" },
      { text: "5", value: "5" },
    ],
    user: [],
    skills_user: [],
    selected: {},
    form: {
      first_name: "",
      last_name: "",
      birth_date: "",
      national_code: "",
      phone_number: "",
      address: "",
      email: "",
      highest_degree: "",
      field_study: "",
      educational_institution: "",
      average: "",
      previous_workplace: "",
      job_responsibilities: "",
      employment_start_date: "",
      employment_end_date: "",
      salary_received: "",
      separation_reason: "",
      technical_skills: "",
      languages: "",
      description_skills: "",
      work_shift: "",
      health_status: "",
      description_disease: "",
      marital_status: "",
      military_service_status: "",
      requested_salary: "",
      overtime: "",
      reward: "",
      file: "",
      job_position_id: "",
    },
  }),
  computed: {
    check_validations() {
      let valid = `valid_step${this.e1}`;

      return this[valid];
    },
  },
  watch: {
    user: {
      deep: true,
      handler() {
        if (this.user.length > 0 && !Boolean(this.modelId)) {
          this.form.user_id = this.user[0].id;
          this.form.national_code = Boolean(this.user[0].national_code)
            ? this.user[0].national_code
            : "";
          this.form.phone_number = Boolean(this.user[0].username)
            ? this.user[0].username
            : "";
          this.form.first_name = Boolean(this.user[0].first_name)
            ? this.user[0].first_name
            : "";
          this.form.last_name = Boolean(this.user[0].last_name)
            ? this.user[0].last_name
            : "";
          this.form.birth_date = Boolean(this.user[0].birth_date)
            ? this.user[0].birth_date
            : "";
        }
      },
    },
  },
  beforeMount() {
    this.jobPosition();
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      if (!Boolean(this.form.description_disease)) {
        this.form.health_status = "healthy";
      } else {
        this.form.health_status = "unhealthy";
      }
      if (this.languages.length > 0) {
        this.form.languages = this.languages;
      }
      if (this.skills_user.length > 0) {
        let items = [];
        for (let i = 0; i < this.skills_user.length; i++) {
          const x = this.skills_user[i];
          items.push(x.text);
        }
        this.form.technical_skills = items;
      }
      let form = { ...this.form };
      this.loading = true;
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          let data = response.model;
          for (let key in data) {
            this.form[key] = data[key];
          }
          data.technical_skills.map((x) => {
            this.skills_user.push({ text: x });
          });
          this.user.push(data.user);

          this.languages = [...data.languages];
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    addItems(key) {
      if (key == "skills") {
        this.skills_user.push({ text: "" });
      } else if (key == "languages") {
        this.languages.push({ lang: "", level: "" });
      }
    },
    jobPosition() {
      this.loading = true;
      let filters = {
        key: {
          op: "=",
          value: "job_position",
        },
      };
      let items = [];
      this.$reqApi("/setting", { row_number: 2000, filters: filters })
        .then(async (response) => {
          for (let i = 0; i < response.model.data.length; i++) {
            const x = response.model.data[i];
            items.push({
              text: x.value,
              value: x.id,
            });
          }
          this.job_position = items;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
  },
};
</script>


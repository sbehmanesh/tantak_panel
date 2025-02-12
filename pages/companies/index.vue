<template>
  <div>
    <BaseTable url="/company" 
    :headers="headers" 
    autoDelete="/company/delete"
     autoUpdate="/companies"
      createUrl="/companies/insert">
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "لیست شرکت ها",
  }),
  beforeMount() {
    this.headers = [
    {
        text: "تصویر",
        value: "logo",
        type: "image",
        disableSort: "true",
        filterable: false,
      },
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {text: "نام شرکت"  ,  value:(body)=>{
        return `<h1 class='my-1'>
          ${body.fa_name}
          <br/>
          <small class='grey--text'>
            ${body.en_name}
            </small>
          
          </h1>`
      }, },
      { text: "نام شهر", value: "city" },

      { text: "ادرس الکترونیکی", value: "email" },
      { text: "شناسه", value: "national_id" },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status,
      },
      {
          filterable: false,
          disableSort: true,
          filterType: "date",
          filterCol: "birth_date",
          text: "تاریخ ثبت نام ",
          value: (body) => {
            if (body.registered_at) {
              return this.$toJalali(
                body.registered_at,
                "YYYY-MM-DD",
                "jYYYY/jMM/jDD"
              );
            }
            return "";
          },
        },
 
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

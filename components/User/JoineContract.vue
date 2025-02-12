<template>
          <v-dialog v-model="dialog"      persistent width="450">
                    <v-card class="pa-3" style="overflow: hidden;" width="450">
                              <v-col cols="12" class="d-flex align-center">
                              <h1>افزودن مخاطبین به کاربران</h1>
                              <v-spacer></v-spacer>       
                   
                              </v-col>
<v-col cols="12">
          <amp-autocomplete multiple v-model="phone_numbers" :items="userContacts" rules="require"></amp-autocomplete>
</v-col>
                              <v-row class="d-flex justify-center">
              <v-col cols="12" md="2">
                <amp-button
                  text="تایید"
                  height="38"
                  block
                  color="teal darken-2"
                  @click="submit"
                  class="ma-1"
                  :loading="loading"
                  :disabled="loading || phone_numbers.length ==0"
                />
              </v-col>
              <v-col cols="12" md="2">
                <amp-button
                  text="انصراف"
                  height="38"
                  block
                  color="red darken-2"
                  @click="closeDialog"
                  class="ma-1"
                />
              </v-col>
            </v-row>
                    </v-card>
          </v-dialog>
</template>
<script>
export default {
          props:{
                    dialog:{
                              default: false
                    } ,userContacts:{
                              require:false
                    }
          },
          data:(()=>({
                    valid:true , loading:false,
                    phone_numbers:[]
                
          })),
          mounted(){
                    
          },
          methods:{
            submit(){
              this.loading = true
              let form  = {}
              form['phone_numbers'] = this.phone_numbers
              this.$reqApi("contact/insert-user" , form).then((res)=>{
                this.loading = false
              this.closeDialog()
              this.$toast.success("عملیات با موفقیت انجام شد")
              }).catch((err)=>{ this.loading = false})
            },
                    closeDialog(){
                              this.$emit("closeDialog")
                    }
          }
}
</script>
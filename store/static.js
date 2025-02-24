export const state = () => ({
  status,
  gender,
  bool_en,
  bool_text,
  week_days,
  user_level,
  person_type,
  status_baranch,
  status_message,
  work_status,
  supervisor_status_items,
  bimehso_aramin,
  aramin_domain,
  call_status,
  months,
  country_division,
  pik,
  sell_type,
  is_main_branch,
  company_name,
  menu_type,
  repeatation_cycle,
  setting_keys,
  status_contact_form,
  ownership_type,
  product_status,
  branch_status,
  message_status,
  sell_status,
  bool_number_enum,
  step_message,
  type_send,
  wallet_type,
  wallet_kind,
  status_work,
  status_type,
  type_message,
  send_for,
  notif_type,
  status_invitor,
  type_invitor,
  step_invitor,
  prepaid_type,
  status_payment_invitor,
  status_transactions,
  status_req_money,
  step_debts,
  step_status_baskets,
  access_request_product,
  origin_of_entry,
  status_basket_refral,
  status_stock,
  step_basket_refral,
  inventory_status,
  inventory_type,
  inventory_type_request,
  tiket_status,
  reterned_type,
  status_cupon,
  discount_type,
  festival_type,
  festival_status,
  type_gift,
  status_return_product,
  step_reterned_product,
  type_questions,
  register_type,
  complaint_step,
  complaint_status,
  ownership_type_agancy,
  agency_request_step,
});

let status_type = [
  { text: "شارژ", value: "charg" },
  { text: "خرید", value: "buy" },
  { text: "برگشت", value: "reject" },
];
let register_type = [
  { text: "پنل", value: "panel" },
  { text: "اپ", value: "app" },
];

let setting_keys = [
  { text: "لوگوی صفحه اصلی", value: "header_logo", type: "image" },
  { text: "تیتر فوتر", value: "footer_text_title", type: "single_text" },
  { text: "متن فوتر", value: "footer_text", type: "text" },
  { text: "شماره تماس", value: "phone", type: "single_text" },
  { text: "پست الکترونیک", value: "email", type: "single_text" },
  { text: "آدرس", value: "email", type: "text" },
  { text: "آدرس آپارات", value: "aparat", type: "single_text" },
  { text: "آدرس یوتیوب", value: "youtube", type: "single_text" },
  { text: "آدرس واتس آپ", value: "whatsup", type: "single_text" },
  { text: "آدرس پینترست", value: "pinterest", type: "single_text" },
  { text: "آدرس فیس بوک", value: "facebook", type: "single_text" },
  { text: "آدرس اینستاگرام ", value: "instagram", type: "single_text" },
  { text: "اسلایدر اصلی", value: "main_slider", type: "image" },
];
let wallet_type = [
  { text: "شارژ", value: "put" },
  { text: "برداشت", value: "remove" },
];
let wallet_kind = [
  { text: "نقد", value: "cash" },
  { text: "اعتباری", value: "credit" },
];
let type_send = [
  { text: "ترخیص خودکار", value: "auto" },
  { text: "دستی", value: "multi" },
  { text: "بر اساس سابقه فروش", value: "sale" },
];

let status_work = [
  { text: "فعال", value: "active" },
  { text: " مرخصی ", value: "leave" },
  { text: " استراحت", value: "rest" },
  { text: " دورکاری", value: "remote" },
];
let status = [
  { text: "فعال", value: "active" },
  { text: "غیر فعال", value: "in_active" },
];
let prepaid_type = [
  { text: "درصدی", value: "percent" },
  { text: "مقدار", value: "amount" },
];

let status_message = [
  { text: "ثبت اولیه", value: "init" },
  { text: "برگشت", value: "regect" },
  { text: "انجام شده", value: "done" },
  { text: "در حال برسی", value: "pending" },
  { text: "معوقه", value: "delayed" },
  { text: "تماس مجدد", value: "call_back" },
  { text: "پرداخت شده", value: "withdrawal" },
  { text: "لغو شده", value: "reject" },
];
let step_message = [
  { text: "ثیت اولیه", value: "init" },
  { text: "بسته شده", value: "close" },
  { text: "از مدیر به مرکز تماس", value: "manager_to_supervisor" },
  { text: "از مرکز تماس به مدیر", value: "supervisor_to_manager" },
  { text: "از مرکز تماس به فروشنده", value: "supervisor_to_operator" },
  { text: "از فروشنده به مرکز تماس", value: "operator_to_supervisor" },
  { text: "انجام شده", value: "done" },
];
let step_debts = [
  { text: "ثیت اولیه", value: "init" },
  { text: "بسته شده", value: "cancel" },
  { text: "ارجاع از بدهکار به برسی کننده", value: "debtor_to_reviewer" },
  { text: "ارجاع از برسی کننده به بدهکار", value: "reviewer_to_debtor" },
  { text: "تایید برسی کننده بدهکاری", value: "accept_reviewer" },
  { text: " عدم تایید برسی کننده بدهکاری ", value: "not_accept_reviewer" },
  { text: "از بدهکار به مدیر واحد مالی", value: "debtor_to_fiscal_manager" },
  { text: "از مدیر واحد مالی به بدهکار", value: "fiscal_manager_to_debtor" },
  {
    text: "ارجاع از مدیر واحد مالی به سرپرست واحد مالی",
    value: "fiscal_manager_to_supervisor",
  },
  {
    text: "ارجاع از سرپرست واحد مالی به مدیر واحد مالی",
    value: "fiscal_supervisor_to_manager",
  },
  {
    text: "ارجاع از سرپرست واحد مالی به واحد مالی",
    value: "fiscal_supervisor_to_fiscal",
  },
  {
    text: "ارجاع از واحد مالی به سرپرست واحد مالی",
    value: "fiscal_to_fiscal_supervisor",
  },
  { text: "انجام شده", value: "done" },
];
let type_message = [
  { text: "کاربر", value: "User" },
  { text: "همه کاربران", value: "All" },
];

let product_status = [
  { text: "فروش آنلاین", value: "published_online" },
  { text: "فروش در محل", value: "published_inplace" },
  { text: "فروش آنلاین و درمحل", value: "published_everywhere" },
  { text: "پیش نویس", value: "draft" },
];

let sell_status = [
  { text: "جزئی", value: "single" },
  { text: "فله", value: "whole" },
];
let work_status = [
  { text: "مشغول به کار", value: "active" },
  { text: "مرخصی", value: "leave" },
  { text: "استراحت", value: "rest" },
  { text: "دور کاری", value: "remote" },
];

let status_contact_form = [
  { text: "انتظار", value: "pending" },
  { text: "بررسی شده", value: "reviewed" },
];

let ownership_type = [
  { text: "مالک", value: "owner" },
  { text: "اجاره", value: "leasehold" },
];

let user_level = [
  { text: "نوع یک", value: "type1" },
  { text: "نوع دو", value: "type2" },
];
let bool_text = [
  { text: "بله", value: true },
  { text: "خیر", value: false },
];

let branch_status = [
  { text: "فعال", value: "active" },
  { text: "غیر فعال", value: "inactive" },
  { text: "پنهان", value: "hidden" },
  { text: "معلق", value: "suspended" },
];
let message_status = [
  { text: "معوقه", value: "delayed" },
  { text: "تایید شده", value: "done" },
  { text: "تماس مجدد", value: "call_back" },
  { text: "پرداخت شده", value: "withdrawal" },
  { text: "لغو شده", value: "reject" },
];

let bool_en = [
  { text: "بله", value: "yes" },
  { text: "خیر", value: "no" },
];

let gender = [
  { text: "مرد", value: "مرد" },
  { text: "زن", value: "زن" },
];
let is_main_branch = [
  { text: "شعبه اصلی", value: 0 },
  { text: "شعبه فرعی", value: 1 },
];
let week_days = [
  { text: "شنبه", value: "saturday" },
  { text: "یکشنبه", value: "sunday" },
  { text: "دوشنبه", value: "monday" },
  { text: "سشنبه", value: "tuesday" },
  { text: "چهارشنبه", value: "wednesday" },
  { text: "پنج شنبه", value: "thursday" },
  { text: "جمعه", value: "Friday" },
  { text: "همه", value: "" },
];

let bool_number_enum = [
  { text: "بله", value: "1" },
  { text: "خیر", value: "0" },
];
let send_for = [
  { text: "همه", value: "All" },
  { text: "کاربر", value: "User" },
];

let person_type = [
  { text: "حقیقی", value: "real" },
  { text: "حقوقی", value: "legal" },
];
let status_baranch = [
  { text: "فعال", value: "active" },
  { text: "غیر فعال", value: "inactive" },
  { text: "پنهان ", value: "hidden" },
  { text: "معلق ", value: "suspended" },
];
let sell_type = [
  { text: "فروش تکی", value: "sell" },
  { text: " فروش  عمده", value: "wholesale" },
  { text: "هردو ", value: "both_sell" },
  { text: "هیچکدام ", value: "none" },
];
let supervisor_status_items = [
  { text: "دارد", value: true },
  { text: "ندارد", value: false },
];

let bimehso_aramin = "https://bimehsho.aramin.ir/";
let aramin_domain = "panel.aramin.ir";
let months = [
  { text: "فروردین", value: "1" },
  { text: "اردیبهشت", value: "2" },
  { text: "خرداد", value: "3" },
  { text: "تیر", value: "4" },
  { text: "مرداد", value: "5" },
  { text: "شهریور", value: "6" },
  { text: "مهر", value: "7" },
  { text: "آبان", value: "8" },
  { text: "آذر", value: "9" },
  { text: "دی", value: "10" },
  { text: "بهمن", value: "11" },
  { text: "اسفند", value: "12" },
];
let call_status = [
  { text: "پاسخ داده شده", value: "ANSWERED" },
  { text: "بی پاسخ", value: "NO ANSWER" },
  //{text:'مشغول', value:'CONGESTION'},
  { text: "مشغول", value: "BUSY" },
  { text: "ناموفق", value: "FAILED" },
  { text: "قطع شده از IVR", value: "s" },
];
let country_division = [
  { text: "استان", value: "province" },
  { text: "شهرستان", value: "township" },
  { text: "بخش", value: "district" },
  { text: "شهر", value: "city" },
  { text: "دهستان", value: "rural_district" },
  { text: "روستا", value: "village" },
];

let pik = [
  { text: "الف", value: 1 },
  { text: "ب", value: 2 },
  { text: "ت", value: 3 },
  { text: "ج", value: 4 },
  { text: "د", value: 5 },
  { text: "س", value: 6 },
  { text: "ص", value: 7 },
  { text: "ط", value: 8 },
  { text: "ع", value: 9 },
  { text: "ق", value: 10 },
  { text: "ل", value: 11 },
  { text: "م", value: 12 },
  { text: "ن", value: 13 },
  { text: "و", value: 14 },
  { text: "ه", value: 15 },
  { text: "ی", value: 16 },
  { text: "ر", value: 17 },
  { text: "ک", value: 18 },
  { text: "ژ", value: 19 },
  { text: "پ", value: 20 },
  { text: "ظ", value: 21 },
  { text: "ض", value: 23 },
  { text: "ز", value: 23 },
  { text: "ش", value: 24 },
  { text: "گ", value: 25 },
  { text: "ث", value: 26 },
  { text: "D", value: 27 },
  { text: "S", value: 28 },
  { text: "ح", value: 29 },
  { text: "ف", value: 30 },
];

let company_name = [
  { text: "بيمه دانا", value: 1 },
  { text: "بيمه ايران", value: 2 },
  { text: "بيمه آسيا", value: 3 },
  { text: "بيمه دي", value: 4 },
  { text: "بيمه ميهن", value: 5 },
  { text: "بيمه البرز", value: 6 },
  { text: "بيمه معلم", value: 7 },
  { text: "بيمه پارسيان", value: 8 },
  { text: "بيمه كارآفرين", value: 9 },
  { text: "بيمه سينا", value: 10 },
  { text: "بيمه رازي", value: 11 },
  { text: "بيمه توسعه", value: 12 },
  { text: "بيمه ملت", value: 13 },
  { text: "-", value: 14 },
  { text: "بيمه سامان", value: 15 },
  { text: "بيمه نوين", value: 16 },
  { text: "بيمه پاسارگاد", value: 17 },
  { text: "بيمه كوثر", value: 18 },
  { text: "بيمه ما", value: 19 },
  { text: "-", value: 20 },
  { text: "بيمه آرمان", value: 21 },
  { text: "دانا (شركت هاي ادغامي)", value: 22 },
  { text: "بيمه حافظ", value: 23 },
  { text: "بيمه اميد", value: 24 },
  { text: "بيمه ايران معين", value: 25 },
  { text: "بيمه متقابل كيش", value: 26 },
  { text: "-", value: 27 },
  { text: "بيمه اتكايي ايرانيان", value: 28 },
  { text: "بيمه تعاون", value: 29 },
  { text: "بيمه اتكايي امين", value: 30 },
  { text: "بيمه آسماري", value: 31 },
  { text: "بيمه متقابل اطمينان متحد قشم", value: 32 },
  { text: "بيمه سرمد", value: 33 },
  { text: "بیمه تجارت نو", value: 34 },
  { text: "بیمه حکمت صبا", value: 52 },
];

let repeatation_cycle = [
  { text: "هر ماه", value: "every_month" },
  { text: "هر سه ماه", value: "every_three_month" },
  { text: "هر شیش ماه", value: "every_six_month" },
  { text: "هر سال", value: "every_year" },
  { text: "بدون تکرار", value: "no_repeat" },
];

let menu_type = [
  { text: "فعال", value: "active" },
  { text: "غیرفعال", value: "hidden" },
];
let status_req_money = [
  { text: "تایید شده", value: "done" },
  { text: "رد شده", value: "reject" },
  { text: " منتظر برسی", value: "wait" },
];
let notif_type = [
  { text: "پیامک", value: "sms" },
  { text: "اعلان", value: "notification" },
  { text: "هردو", value: "all" },
];
let status_invitor = [
  { text: "ثبت اولیه", value: "init" },
  { text: "در حال برسی", value: "wait" },
  { text: "انجام شده", value: "done" },
  { text: "کنسل شده ", value: "cancel" },
];

let status_payment_invitor = [
  { text: "تعریف نشده ", value: "none" },
  { text: "کنسل شده ", value: "cancel" },
  { text: "منتظر پرداخت", value: "wait" },
  { text: "پرداخت شده", value: "payed" },
  { text: "پرداخت نشده", value: "unpayed" },
  { text: "برگشت داده شده", value: "reject" },
  { text: "کنسل شده", value: "cancled" },
  { text: "عودت وجه", value: "owdat" },
];
let type_invitor = [
  { text: "عادی ", value: "normal" },
  { text: "نقص موجودی", value: "deficit" },
];
let step_invitor = [
  { text: "ثبت اولیه", value: "init" },
  { text: "  انجام بسته بندی و ارسال   ", value: "pack_and_send" },
  { text: " درحال بسته بندی سفارش", value: "waiting_packaging" },
  {
    text: " مرجوع به سرپرست انبار مرکزی",
    value: "employee_to_supervisor_stock",
  },
  {
    text: " ارجاع به کارمند انبار مرکزی",
    value: "supervisor_to_employee_stock",
  },
  {
    text: " مرجوع از سرپرست انبار مرکزی به مدیر نمایندگی",
    value: "supervisor_stock_to_manager ",
  },
  {
    text: "از مدیر نمایندگی به سرپرست انبار مرکزی",
    value: "manager_to_supervisor_stock",
  },
  { text: "ارجاع به سرپرست فروش", value: "manager_to_supervisor_sale" },
  {
    text: " سرپرست به مدیر نمایندگی فروش",
    value: "supervisor_to_manager_sale",
  },
  { text: "سرپرست فروش به کارشناس فروش", value: "supervisor_to_employee_sale" },
  { text: "کارشناس فروش به سرپرست فروش", value: "employee_to_supervisor_sale" },
  { text: "کنسل شده", value: "cancel" },
  { text: "تایید کارمند فروش", value: "accept_employee_sale" },
  { text: "تایید شده", value: "done" },
  {
    text: "ارجاع از مدیر نمایندگی فروش به مدیر واحد مالی",
    value: "manager_to_fiscal_manager",
  },
  {
    text: "مرجوع از مدیر واحد مالی به مدیر نمایندگی فروش",
    value: "fiscal_manager_to_manager",
  },
  {
    text: "ارجاع از مدیر واحد مالی به سرپرست واحد مالی",
    value: "fiscal_manager_to_supervisor",
  },
  {
    text: "مرجوع از سرپرست واحد مالی به مدیر واحد مالی",
    value: "fiscal_supervisor_to_manager",
  },
  {
    text: "ارجاع از سرپرست واحد مالی به واحد مالی",
    value: "fiscal_supervisor_to_fiscal",
  },
  {
    text: "مرجوع از واحد مالی به سرپرست واحد مالی",
    value: "fiscal_to_fiscal_supervisor",
  },
  { text: "تایید واحد مالی", value: "accept_fiscal" },
  {
    text: "ارجاع از سفیر مدیر نمایندگی فروش",
    value: "sefir_to_agency_manager",
  },
  {
    text: "  ارجاع  از سفیر به کارمند انبار مرکزی",
    value: "sefir_to_employee_stock",
  },
];
let status_transactions = [
  { text: "منتظر پرداخت", value: "wait" },
  { text: "پرداخت شده", value: "payed" },
  { text: " پرداخت نشده", value: "unpayed" },
  { text: "برگشت ", value: "reject" },
  { text: "کنسل شده", value: "cancled" },
];
let step_status_baskets = [
  { text: "ثبت اولیه", value: "init" },
  { text: "بسته شده", value: "reject" },
  { text: "ارجاع به مدیر واحد مالی", value: "refer_fiscal_manager" },
  { text: "یرگشت از مدیر واحد مالی", value: "reject_fiscal_manager" },
  {
    text: "ارجاع از مدیر واحد مالی به سرپرست",
    value: "manager_supervisor_fiscal",
  },
  {
    text: "برگشت از سرپرست به مدیر واحد مالی",
    value: "supervisor_manager_fiscal",
  },
  { text: "ارجاع از سرپرست به واحد مالی", value: "supervisor_to_fiscal" },
  { text: "برگشت از واحد مالی به سرپرست", value: "fiscal_to_supervisor" },
  { text: "تایید واحد مالی", value: "accept_fiscal" },
  {
    text: "ارجاع به مدیر هماهنگ کننده",
    value: "admin_manager_coordinator",
  },
  {
    text: "برگشت از مدیر هماهنگ کننده به ادمین",
    value: "manager_admin_coordinator",
  },
  {
    text: "ارجاع مدیر به سرپرست هماهنگ کننده",
    value: "manager_supervisor_coordinator",
  },
  {
    text: "برگشت سرپرست به مدیر هماهنگ کننده",
    value: "supervisor_manager_coordinator",
  },
  {
    text: "ارجاع سرپرست هماهنگ کننده به هماهنگ کننده",
    value: "supervisor_to_coordinator",
  },
  {
    text: "برگشت از هماهنگ کننده به سرپرست",
    value: "coordinator_to_supervisor",
  },

  {
    text: "تایید واحد هماهنگی",
    value: "accept_coordinator",
  },
  {
    text: "ادمین به مدیر هماهنگی ارسال ",
    value: "admin_manager_send",
  },
  {
    text: "مدیر هماهنگی به ادمین",
    value: "manager_admin_send",
  },
  {
    text: "مدیر به سرپرست هماهنگی ارسال",
    value: "manager_supervisor_send",
  },
  {
    text: "سرپست به مدیر هماهنگی ارسال ",
    value: "supervisor_manager_send",
  },
  {
    text: "سرپرست به هماهنگی ارسال",
    value: "supervisor_to_send",
  },
  {
    text: " هماهنگی ارسال به سرپرست",
    value: "send_to_supervisor",
  },
  {
    text: "ارجاع به نمایندگی",
    value: "send_to_agency",
  },
  {
    text: "برگشت به هماهنگ کننده ارسال",
    value: "agency_to_send",
  },
  {
    value: "agency_to_stockclerk",
    text: "ارجاع از نمایندگی به انبار دار",
  },
  {
    text: "برگشت از انبار دار به نمایندگی",
    value: "stockclerk_to_agency",
  },
  {
    text: "کارمند به انبار دار",
    value: "employee_to_stockclerk",
  },
  {
    text: "ارجاع انبار دار به کارمند نمایندگی",
    value: "stockclerk_to_employee",
  },
  {
    text: "ارجاع کارمند به پیک",
    value: "employee_to_courier",
  },
  {
    text: "ارجاع از پیک به کارمند",
    value: "courier_to_employee",
  },
  {
    text: "تحویل داده شده",
    value: "done",
  },
];
let access_request_product = [
  { text: " بدون دسترسی تعریف موجودی", value: "no_access" },
  { text: " تعریف موجودی به صورت دستی", value: "add_manual" },
  { text: " تعریف موجودی با فایل اکسل", value: "add_excel" },
  { text: "تعریف موجودی با اکسل و دستی ", value: "both" },
];
let origin_of_entry = [
  { text: "آنلاین", value: "login_source" },
  { text: "فروش تلفنی", value: "sale_phone" },
  { text: "  ورود با اکسل یا کاوه نگار", value: "excel_sale_phone" },
  { text: " افزودن در پنل", value: "manual" },
  { text: "خرید حضوری", value: "sale_person" },
  { text: "آنلاین", value: "online" },
];
let status_basket_refral = [
  {
    text: "پرداخت شده",
    value: "payed",
  },
  {
    text: "باز ",
    value: "open",
  },
  {
    text: "در انتظار",
    value: "waiting",
  },

  {
    text: "تکمیل شده ",
    value: "completed",
  },
  {
    text: "کنسل شده",
    value: "canceled",
  },
  {
    text: "کنسل شده",
    value: "cancel",
  },
  {
    text: "ترکیبی ",
    value: "mixture",
  },
  {
    text: "منتظر تایید تخفیف ",
    value: "wait_discount",
  },
];
let status_stock = [
  { text: "منتظر برداشت", value: "wait" },
  { text: "برداشت انجام شده", value: "done" },
  { text: "کنسل شده", value: "reject" },
];
let step_basket_refral = [
  { text: "ثبت اولیه", value: "init" },
  { text: "بسته شده", value: "reject" },
  { text: "ارجاع به مدیر واحد مالی", value: "refer_fiscal_manager" },
  { text: "یرگشت از مدیر واحد مالی", value: "reject_fiscal_manager" },
  {
    text: "ارجاع از مدیر واحد مالی به سرپرست",
    value: "manager_supervisor_fiscal",
  },
  {
    text: "برگشت از سرپرست به مدیر واحد مالی",
    value: "supervisor_manager_fiscal",
  },
  { text: "ارجاع از سرپرست به واحد مالی", value: "supervisor_to_fiscal" },
  { text: "برگشت از واحد مالی به سرپرست", value: "fiscal_to_supervisor" },
  { text: "تایید واحد مالی", value: "accept_fiscal" },
  {
    text: "ارجاع به مدیر هماهنگ کننده",
    value: "admin_manager_coordinator",
  },
  {
    text: "برگشت از مدیر هماهنگ کننده به ادمین",
    value: "manager_admin_coordinator",
  },
  {
    text: "ارجاع مدیر به سرپرست هماهنگ کننده",
    value: "manager_supervisor_coordinator",
  },
  {
    text: "برگشت سرپرست به مدیر هماهنگ کننده",
    value: "supervisor_manager_coordinator",
  },
  {
    text: "ارجاع سرپرست هماهنگ کننده به هماهنگ کننده",
    value: "supervisor_to_coordinator",
  },
  {
    text: "برگشت از هماهنگ کننده به سرپرست",
    value: "coordinator_to_supervisor",
  },

  {
    text: "تایید واحد هماهنگی",
    value: "accept_coordinator",
  },
  {
    text: "ادمین به مدیر هماهنگی ارسال ",
    value: "admin_manager_send",
  },
  {
    text: "مدیر هماهنگی به ادمین",
    value: "manager_admin_send",
  },
  {
    text: "مدیر به سرپرست هماهنگی ارسال",
    value: "manager_supervisor_send",
  },
  {
    text: "سرپست به مدیر هماهنگی ارسال ",
    value: "supervisor_manager_send",
  },
  {
    text: "سرپرست به هماهنگی ارسال",
    value: "supervisor_to_send",
  },
  {
    text: " هماهنگی ارسال به سرپرست",
    value: "send_to_supervisor",
  },
  {
    text: "ارجاع به نمایندگی",
    value: "send_to_agency",
  },
  {
    text: "برگشت به هماهنگ کننده ارسال",
    value: "agency_to_send",
  },
  {
    value: "agency_to_stockclerk",
    text: "ارجاع از نمایندگی به انبار دار",
  },
  {
    text: "برگشت از انبار دار به نمایندگی",
    value: "stockclerk_to_agency",
  },
  {
    text: "کارمند به انبار دار",
    value: "employee_to_stockclerk",
  },
  {
    text: "ارجاع انبار دار به کارمند نمایندگی",
    value: "stockclerk_to_employee",
  },
  {
    text: "ارجاع کارمند به پیک",
    value: "employee_to_courier",
  },
  {
    text: "ارجاع از پیک به کارمند",
    value: "courier_to_employee",
  },
  {
    text: "تحویل داده شده",
    value: "done",
  },
];
let inventory_status = [
  { text: "منتظر تایید", value: "wait" },
  { text: "تایید", value: "done" },
  { text: "رد", value: "reject" },
];
let inventory_type = [
  { text: "اکسل", value: "excel" },
  { text: "دستی", value: "manual" },
];
let inventory_type_request = [
  { text: "افزودن محصول", value: "insert" },
  { text: "انبار گردانی", value: "stock_check" },
];
let tiket_status = [
  { text: "پاسخ داده شده", value: "support" },
  { text: "منتظر پاسخ", value: "user" },
  { text: "بسته شده", value: "close" },
];
let reterned_type = [
  { text: "ناقص", value: "defect" },
  { text: "تعویض", value: "replacement" },
];
let status_cupon = [
  { text: "فعال", value: "active" },
  { text: "غیرفعال", value: "inactive" },
  { text: "استفاده شده", value: "used" },
  { text: "منقضی شده", value: "expired" },
];
let festival_status = [
  { text: "فعال", value: "active" },
  { text: "غیرفعال", value: "inactive" },
  { text: "منقضی شده", value: "expired" },
];

let discount_type = [
  { text: "درصد", value: "percent" },
  { text: "مقدار", value: "amount" },
];
let ownership_type_agancy = [
  { text: "مالک", value: "owner" },
  { text: "اجاره", value: "rental" },
];
let festival_type = [
  { text: "برای سبد های خرید", value: "on_basket" },
  { text: "برای محصولات", value: "on_product" },
];

let type_gift = [
  { text: "محصول یا پکیج ها", value: "product_package" },
  { text: "محصولات غیر سیستمی", value: "not_system_products" },
  { text: "کد تخفیف", value: "coupon" },
  { text: "شارژ کیف پول نقدی", value: "cash_walet" },
  { text: "اعتباری", value: "credit_wallt" },
];
let status_return_product = [
  { text: "افزودن به انبار", value: "add_stock" },
  { text: "بازگشت", value: "return_fac" },
];

let step_reterned_product = [
  {
    text: "از سفیر به مدیرنمایندگی",
    value: "sefir_to_agency_manager",
    key: "sefir",
  },
  {
    text: "از سفیر به سرپرست انبار مرکزی",
    value: "sefir_to_storage_manager",
    key: "sefir",
  },
  {
    text: "از سرپرست انبار مرکزی به سفیر",
    value: "storage_manager_to_sefir",
    key: "storage_manager",
  },
  {
    text: "سرپرست انبار مرکزی به کارمند",
    value: "storage_manager_to_employee",
    key: "storage_manager",
  },
  {
    text: "کارمند انبار مرکزی به سرپرست انبار مرکزی",
    value: "storage_employee_to_manager",
    key: "storage_employee",
  },
  {
    text: "کارمند انبار مرکزی به واحد مالی",
    value: "storage_employee_to_financial",
    key: "storage_employee",
  },
  { text: "تایید", value: "done", key: "financial" },
  {
    text: " واحد مالی به سرپرست واحد مالی",
    value: "financial_to_supervisor",
    key: "financial",
  },
  {
    text: "مدیر واحد مالی به سرپرست واحد مالی",
    value: "manager_to_supervisor_financial",
    key: "manager_financial",
  },
  {
    text: "سرپرست واحد مالی به مدیر واحد مالی",
    value: "supervisor_to_manager_financial",
    key: "supervisor",
  },
  {
    text: "سرپرست واحد مالی به واحد مالی",
    value: "supervisor_to_financial",
    key: "supervisor",
  },
  { text: "ثبت اولیه", value: "init", key: "---" },
  {
    text: "از مدیر نمایندگی به سفیر",
    value: "agency_manager_to_sefir",
    key: "agency_manager",
  },
  { text: "بستن", value: "close", key: "agency_manager" },
];
let type_questions = [
  { text: "متن", value: "text" },
  { text: "دراپ دان", value: "option" },
];
let complaint_step = [
  { text: "ثبت اولیه", value: "init" },
  {
    text: "ارجاع از واحد پیگیری شکایت به واحد مربوطه (ارجاع به نقش مربوطه) ",
    value: "referral_from_complaint_follow_up",
  },
  {
    text: "مرجوع از واحد مربوطه به واحد پیگیری شکایت",
    value: "referred_to_complaint_follow_up",
  },
  { text: "بستن شکایت", value: "close" },
  { text: "تایید شکایت", value: "done" },
];
let complaint_status = [
  { text: "ثبت اولیه", value: "init" },
  { text: "درحال برسی", value: "reviewing" },
  { text: "انجام شده", value: "done" },
  { text: "لغو شده", value: "cancel" },
];
let agency_request_step = [
  { text: "ثبت اولیه", value: "init" },
  { text: "از مدیر فروش به سرپرست فروش", value: "sale_manager_to_supervisor" },
  { text: "از  سرپرست  فروش به مدیر فروش", value: "sale_supervisor_to_manager" },
  { text: "انجام شده", value: "done" },
  { text: "لغو شده", value: "reject" },
];

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
  mnue_tree,
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
  user_status,
});

let mnue_tree = [
  {
    id: 1,
    name: "کارتابل",
    access: "*",
    route: "/panel",
  },
  {
    id: 2,
    name: "کاربران",
    children: [
      {
        id: 3,
        name: "کاربران",
        access: "user/index",
        route: "/user/list",
      },
      {
        id: 4,
        name: "براساس نقش",
        access: "user/index",
        route: "/user",
      },
      {
        id: 5,
        name: "نقش ها",
        access: "role/index",
        route: "/role",
      },
    ],
  },
  {
    id: 6,
    name: "ناحیه ها",
    access: "region/index",
    route: "/region",
  },
  {
    id: 7,
    name: "شعبات",
    access: "branch/index",
    route: "/branches",
  },
  {
    id: 200,
    name: "فروش تجمیعی",
    access: "collective_sell/index",
    route: "/collective-sell",
  },
  {
    id: 13,
    name: "محصولات",
    children: [
      {
        id: 14,
        name: "فهرست محصولات",
        access: "product/insert",
        route: "/product",
      },
      {
        id: 15,
        name: "دسته بندی محصولات",
        access: "category/index",
        route: "/product/category",
      },
      {
        id: 40,
        name: "برند ها",
        access: "brand/index",
        route: "/product/brand",
      },
      {
        id: 30,
        access: "wholesale_form/index",
        name: "فرم های دریافتی فروش عمده",
        route: "/product/wholesale-form",
      },
      {
        id: 344650,
        access: "payments/index",
        name: "لیست پرداخت ها",
        route: "/product/pay",
      },

    ],
  },
  {
    id: 31,
    name: "موجودی انبار",
    access: "product/index",
    route: "/stock",
  },
  {
    id: 50,
    name: "مرکز فروش تلفنی",
    children: [
      {
        id: 51,
        access: "recived_message/insert",
        name: "ورود اکسل",
        route: "/call-center/import",
      },
      {
        id: 222,
        access: "wholesale_form/index",
        name: "فروش تلفنی",
        route: "/product/buy-person",
      },
      {
        id: 52,
        access: (state) => {
          if (state.auth) {
            if (
              state.auth.action.indexOf('call_center/index-superviser-messages') > -1 ||
              state.auth.action.indexOf('recived_message/index') > -1) {

              return true
            }
          }
        },
        name: "لیست کارکنان",
        route: "/call-center/list",
      },
      {
        id: 53,
        access: "messages/index",
        name: "پیام های دریافتی",
        route: "/new-call-center",
      },

    ],
  },
  {
    id: 18,
    name: "تنظیمات",
    children: [
      {
        id: 10065,
        name: "بازه های زمانی",
        access: "delivery_times/index",
        route: "/setting/delivery-time",
      },
      {
        id: 19,
        name: "اسلایدر",
        access: "setting/index",
        route: "/setting/slider",
      },
      {
        id: 10569,
        name: "حذف سبد خرید",
        access: "setting/index",
        route: "/setting/delete-basket",
      },
      {
        id: 1009,
        name: "فرم نظر سنجی",
        access: "comment_questions/index",
        route: "/setting/comment-questions",
      },
      {
        id: 20,
        name: "بنرها",
        access: "setting/index",
        route: "/setting/main-banner",
      },
      {
        id: 21,
        name: "تنظیمات عمومی",
        access: "setting/index",
        route: "/setting/public/1",
      },
      {
        id: 22,
        name: "ویژگی های محصولات",
        access: "setting/index",
        route: "/setting/variation-type",
      },
      {
        id: 23,
        name: "روش های ارسال",
        access: "setting/index",
        route: "/setting/delivery-method",
      },
      {
        id: 24,
        name: "واحد ها",
        access: "setting/index",
        route: "/setting/units",
      },
      {
        id: 25,
        name: "تنظیمات فروش عمده",
        access: "setting/index",
        route: "/setting/whole-sell",
      },
    ],
  },
  {
    id: 26,
    name: "فرم های دریافتی",
    children: [
      {
        id: 27,
        name: "تماس با ما",
        access: "contact_us_form/index",
        route: "/forms/contact-us-form",
      },
      {
        id: 28,
        name: "درخواست فرم نمایندگی",
        access: "representation_request_form/index",
        route: "/forms/representation-request-form",
      },
      {
        id: 29,
        name: "شکایات",
        access: "complaint_form/index",
        route: "/forms/complaint",
      },
    ],
  },
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
let type_send = [
  { text: "ترخیص خودکار", value: "auto" },
  { text: "دستی", value: "multi" },
  { text: "بر اساس سابقه فروش", value: "sale" },
];

let user_status = [
  { text: "فعال", value: "active" },
  { text: "غیر فعال", value: "in_active" },
  { text: " مرخصی ", value: "leave" },
  { text: " استراحت", value: "rest" },
  { text: " دورکاری", value: "remote" },
];
 let status = [
  // leave','rest','remote
  { text: "فعال", value: "active" },
  { text: "غیر فعال", value: "in_active" },
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
  { text: "مرخصی", value: "inactive" },
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

let person_type = [
  { text: "حقیقی", value: "real" },
  { text: "حقوقی", value: "legal" },
  { text: "هیچ کدام", value: "none" },
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

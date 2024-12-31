export const state = () => ({
  mnue_tree,
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
        access: "user/root",
        route: "/user/list",
      },
      {
        id: 4,
        name: "براساس نقش",
        access: "user/root",
        route: "/user",
      },
      {
        id: 5,
        name: "نقش ها",
        access: "role/root",
        route: "/role",
      },
      {
        id: 7,
        name: "کاربران برتر",
        access: "user/root",
        route: "/user/top-user",
      },
      {
        id: 56554,
        name: "نمایندگی برتر",
        access: "product_requests/root",
        route: "/user/top-sale-agency",
      },
    ],

  },
  {
    id: 618564558145,
    name: "گزارشات تماس",
    access: "messages/issabel_request_call/history",
    route: "/call-reports",
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
      // {
      //   id: 52,
      //   access: (state) => {
      //     if (state.auth) {
      //       if (
      //         state.auth.action.indexOf(
      //           "call_center/index-superviser-messages"
      //         ) > -1 ||
      //         state.auth.action.indexOf("recived_message/index") > -1
      //       ) {
      //         return true;
      //       }
      //     }
      //   },
      //   name: "لیست کارکنان",
      //   route: "/call-center/list",
      // },
      {
        id: 53,
        access: "messages/index",
        name: "پیام های دریافتی",
        route: "/new-call-center",
      },
      {
        id: 55643,
        access: "internals/index",
        name: "اطلاعات داخلی",
        route: "/new-call-center/internal",
      },
      {
        id: 7225855,
        name: "کارکنان  برتر",
        access: "messages/root",
        route: "/product/tops/top-personal",
      }, 
    ],
  },
  {
    id: 610,
    name: "نمایندگی ها",
    children: [
      {
        id: 6185145,
        name: "نمایندگی های فروش",
        access: "sale_agencies/index",
        route: "/product/sale-agency",
      },
      {
        id: 6,
        name: "ناحیه ها",
        access: "region/index",
        route: "/region",
      },
      {
        id: 5461236,
        name: "انبار مرکزی",
        access: "region/index",
        route: "/new-call-center/center-stocks",
      },
    ],
  },
  {
    id: 6185,
    name: "لیست کارکنان",
    access: "user/internal_personnels",
    route: "/user/internal-personnel",
  },



  {
    id: 200564,
    name: "خرید حضوری",
    access: "basket/sale_agency_seller_insert_basket",
    route: "/in-person-shopping",
  },
  {
    id: 2005687564,
    name: "کد های تخفیف",
    access: "coupons/index",
    route: "/discount-code",
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
        id: 112545,
        name: "پکیج ها",
        access: "packages/root",
        route: "/product/packages",
      },
      {
        id: 11257845,
        name: "جعبه  ها",
        access: "packages/root",
        route: "/product/box",
      },
      {
        id: 72278525,
        name: "محصولات برتر",
        access: "basket/root",
        route: "/product/tops/top-product",
      }, 
      {
        id: 722555,
        name: "پکیج های برتر",
        access: "basket/root",
        route: "/product/tops/top-package",
      },
      {
        id: 40,
        name: "برند ها",
        access: "brand/root",
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
        access: "payments/root",
        name: "لیست پرداخت ها",
        route: "/product/pay",
      },
      {
        id: 5457878,
        access: "special_discounts/index",
        name: "تخفیفات ويژه",
        route: "/product/special-discount",
      },
      {
        id: 545787558,
        access: "best_buy_products/index",
        name: "محصولات پیشنهادی",
        route: "/product/suggested",
      },
      {
        id: 98963,
        access: "reduce_products/index",
        name: "محصولات روبه اتمام",
        route: "/product/running-out",
      },
      {
        id: 13731452006,
        name: "رنگ های محصولات",
        access: "setting/index",
        route: "/setting/color-products",
      },
      {
        id: 845065212,
        access: "pending_inventories/index",
        name: "محصولات منتظر تایید",
        route: "/product/pending-inventories",
      },
    ],
  },
  {
    id: 444452,
    name: "سبد های خرید",
    children: [
      {
        id: 3475188,
        name: "سبدهای خرید",
        access: "basket/index",
        route: "/product/basket",
      },
      {
        id: 565,
        name: "لیست سبد های خرید",
        access: "basket/list_referrals",
        route: "/basket/referral-list",
      },
      {
        id: 668541,
        name: "تاریخچه ارجاعات سبد های خرید",
        route: "/basket/all-history",
        access: "basket/referral_history",
      },
    ],
  },

  // {
  //   id: 31,
  //   name: "موجودی انبار",
  //   access: "product/root",
  //   route: "/stock",
  // },
  {
    id: 34751,
    name: "وظیفه ها",
    access: "tasks/index",
    route: "/tasks",
  },


  {
    id: 545613,
    access: "user/access_managers",
    name: "لیست کارکنان",
    route: "/new-call-center/my-staff",
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
  {
    id: 1373,
    access: "small_stocks/index",
    name: "انبارک",
    route: "/new-call-center/small-store",
  },
  // {
  //   id: 75373,
  //   access: "custom_notifications/index",
  //   name: "الگوریتم های اعلان",
  //   route: "/custom-notif",
  // },
  {
    id: 7587453,
    name: "درخواست موجودی",
    children: [
      {
        id: 75874531,
        access: "product_requests/index",
        name: "درخواست موجودی",
        route: "/new-call-center/inventory-request",
      },
      {
        id: 75874532,
        access: "product_request_logs/index",
        name: "تاریخچه درخواست موجودی",
        route: "/new-call-center/referral-history",
      },
    ],
  },
  {
    id: 75874785532,
    access: "money-request/index",
    name: " درخواست وجه",
    route: "/money-request",
  },
  {
    id: 7532,
    access: "debts/index",
    name: "بدهکاری ها",
    route: "/indebtedness",
  },
  {
    id: 75365742,
    access: "debts/logs",
    name: "تاریخچه فعالیت های بدهکاری",
    route: "/indebtedness/all-history",
  },
  {
    id: 618558145,
    name: "موجودی انبار",
    access: "sale_agency_stocks/manager_list_root",
    route: "/warehouses-stock/agency",
  },
  {
    id: 15649,
    name: "پشتیبانی",
    children: [
      {
        id: 24560,
        name: "پشتیبانی",
        access: "ticket/index",
        route: "/ticket",
      },
      {
        id: 24561,
        name: "دسته بندی",
        access: "ticket/root",
        route: "/ticket/ticket-group",
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
        id: 1904505,
        name: "بابت های  کد تخفیف",
        access: "setting/index",
        route: "/setting/for-discount",
      },
      {
        id: 19005,
        name: "بابت های کیف پول",
        access: "setting/index",
        route: "/setting/for-wallet",
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
        id: 101209,
        name: "گارانتی",
        access: "setting/index",
        route: "/setting/warranty",
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
        id: 29541,
        name: "علل های کنسلی",
        access: "setting/index",
        route: "/setting/reason-cancel",
      },
      {
        id: 22,
        name: "ویژگی های محصولات",
        access: "setting/index",
        route: "/setting/variation-type",
      },
      {
        id: 6101373,
        name: "ارسال اعلان",
        access: "notifications/index",
        route: "/notification",
      },
      {
        id: 61013734,
        name: "الگوریتم اعلانات",
        access: "setting/index",
        route: "/setting/message-algouritm",
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
      {
        id: 5214,
        name: "تخفیفات هماهنگ کنندگان",
        access: "discount_coordinator/index",
        route: "/setting/discount-coordinator",
      },
      {
        id: 5265414,
        name: "دسته بندی وظیفه ها",
        access: "setting/index",
        route: "/setting/category-task",
      },
      {
        id: 89563,
        name: "پرداخت های نمایندگی",
        access: "setting/index",
        route: "/setting/payment",
      },
      {
        id: 13731006,
        name: "تغییر روزهای چک",
        access: "setting/index",
        route: "/setting/change-check-days",
      },

      {
        id: 26123,
        name: "مهلت های برگشت",
        access: "setting/index",
        route: "/setting/deadline-back",
      },
      {
        id: 2612213,
        name: "پیام های آماده",
        access: "setting/index",
        route: "/setting/message-example",
      },
    ],
  },

];

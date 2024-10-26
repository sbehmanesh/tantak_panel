var XLSX = require("xlsx");
let jmoment = require("jalali-moment");
let moment = require("moment");

let price_slice = ",";
export default ({ redirect, store, $toast }, inject) => {
  inject("reloadPage", () => {
    window.location.reload();
  });
  inject("reloadLogin", () => {
    window.location.href = "/";
  });
  inject("FarsiToEnglishNumber", (stringNumber) => {
    if (!Boolean(stringNumber)) {
      return stringNumber;
    }
    return String(
      stringNumber
        .toString()
        .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
          return d.charCodeAt(0) - 1632; // Convert Arabic numbers
        })
        .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
          return d.charCodeAt(0) - 1776; // Convert Persian numbers
        })
    );
  });
  inject("inpRules", () => {
    return {
      require: (v) =>
        (typeof v != "undefined" &&
          v !== "" &&
          v != null &&
          v.toString().replace(/\s/g, "") != "") ||
        "کامل نشده",
      max_200: (v) => !v || v.length <= 200 || "حداکثر 200 حرف",
      max_4: (v) => !v || v.length <= 4 || "حداکثر 200 حرف",
      max_10: (v) => !v || v.length <= 10 || "حداکثر 200 حرف",
      fa_chart: (v) => !v || /^[\u0600-\u06FF ]+$/.test(v) || "فقط حروف فارسی",
      text_email: (v) =>
        !v || /^[a-z0-9.]+$/.test(v) || "متن وارد شده صحیح نمی باشد",
      en_chart: (v) =>
        !v || /^[a-z A-Z 0-9 \- _ \.]+$/.test(v) || "عدد و حروف انگلیسی",
      number: (v) => !v || /^[0-9][0-9]*$/.test(v) || "فقط اعداد صحیح",
      number_float: (v) =>
        !v || /^[1-9][0-9 .]*$/.test(v) || "فقط اعداد صحیح و اعشاری",
      len_4: (v) => !v || v.length == 4 || "چهار رقمی وارد کنید",
      min_6: (v) => !v || v.length >= 6 || "حداقل 6 حرف",
      min_3: (v) => !v || v.length >= 3 || "حداقل 3 حرف",
      just_3: (v) => !v || v.length == 3 || "باید 3 حرف باشد",
      check_route: (v) =>
        !v || /^[a-zA-Z0-9\/\-_]+$/.test(v) || "مسیر درست نیست",
      min_2: (v) => !v || v.length >= 2 || "حداقل 2 حرف",
      just_2: (v) => !v || v.length == 2 || "باید 2 حرف باشد",
      min_1: (v) => !v || v.length >= 1 || "حداقل 1 حرف",
      ip: (v) =>
        !v || /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(v) || "آی پی درست نیست",
      min_1: (v) => !v || v.length >= 1 || "حداقل یک مورد انتخاب بشود",
      weekday: (v) => !v || (1 <= v && v <= 7) || "عدد بین 1 تا 7",
      hoursTime: (v) => !v || (0 <= v && v <= 24) || "عدد بین 0 تا 24",
      percent: (v) => !v || (0 <= v && v <= 100) || "عدد بین 0 تا 100",
      url: (v) =>
        !v ||
        /(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}[0-9A-Za-z-\\.@:%_\+~#=]+\.[0-9A-Za-z-\\.@:%_\+~#=]+/.test(
          v
        ) ||
        "آدرس(url) نامعتبر",
      phone: (v) => !v || v.length == 11 || "شماره تلفن درست وارد نشده",
      phone_no_city: (v) =>
        !v || (v.length >= 4 && v.length < 16) || "شماره تلفن درست وارد نشده",
      mobile: (v) =>
        !v ||
        (/^(9|09|٩|٠٩|۹|۰۹)/.test(v) && v.length == 11) ||
        "شماره وارد شده صحیح نیست",
      nationalCode: (v) =>
        !v ||
        (v.length == 10 && /^[0-9][0-9]*$/.test(v)) ||
        "کد ملی اشتباه است",
      postCode: (v) => !v || v.length == 10 || "کدپستی درست وارد نشده",
      cityCode: (v) => !v || v.length == 3 || "کدشهر نامعتبر",
      price: (v) =>
        !v ||
        (v.replaceAll(price_slice, "").length > 4 &&
          !/\D/g.test(v.replaceAll(price_slice, ""))) ||
        "مبلغ نامعتبر",
      email: (v) =>
        !v ||
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) ||
        "پست الکترونیکی نامعتبر",
      plate: (v) =>
        !v ||
        (/\d{2}-[\u0600-\u06FF]{1,3}-\d{3}-\d{2}/.test(v) &&
          (v.length == 11 || v.length == 13)) ||
        "پلاک وارد شده نامعتبر",
      password: [
        (v) => !v || /[a-zA-Z0-9._!@#$%^&*\(\)]+$/.test(v) || "حروف نامعتبر",
        (v) => !v || v.length >= 4 || "حداقل طول 4 حرف",
      ],
    };
  });
  inject("copyForm", (form) => {
    let new_form = {};
    for (const key in form) {
      if (
        typeof form[key] != "undefined" &&
        form[key] !== "" &&
        form[key] != null
      ) {
        new_form[key] = form[key];
      }
    }
    return new_form;
  });
  inject("showUsername", (username) => {
    
    let show = "";
    if (store.state.auth.action.indexOf("users/show_username") > -1) {
      show = username;
    } else {
      let start = username.slice(0, 3);
      let end = username.slice(-4);
      show = start + "****" + end;
    }
    return show;
  });
  inject("checkNotNull", (...item) => {
    for (let index = 0; index < item.length; index++) {
      const element = item[index];
      if (
        typeof element == "undefined" ||
        element === "" ||
        element === "" ||
        element === null
      ) {
        return false;
      }
    }
    return true;
  });
  inject("checkAccess", (access) => {
    if (store.state.auth.action.indexOf(access) > -1) {
      return true;
    } else {
      return false;
    }
  });
  inject("checkRole", (role) => {
    let bool = false;
    if (store.state.auth.user && store.state.auth.panel_token) {
      store.state.auth.user.roles.map((x) => {
        if (x.id == role) {
          bool = true;
        }
      });
    }

    return bool;
  });
  inject("stringToRegex", (str) => {
    const main = str.match(/\/(.+)\/.*/)[1];
    const options = str.match(/\/.+\/(.*)/)[1];
    return new RegExp(main, options);
  });
  inject(
    "toJalali",
    (
      date,
      format_in = "YYYY-MM-DDTHH:mm:ss.SSSZ",
      format_out = "jYYYY/jMM/jDD HH:mm"
    ) => {
      try {
        return jmoment(date, format_in).format(format_out);
      } catch (error) {
        return date;
      }
    }
  );
  inject("getItemEnum", (items, key) => {
    try {
      let item = items.filter(
        (x) => x.value.toString().toLowerCase() == key.toString().toLowerCase()
      );
      if (item.length > 0) {
        return item.map((x) => x.text).join(" , ");
      }
    } catch (error) {}
    return "-";
  });
  inject("getImage", (url, resize = true, small = false) => {
    if (typeof url != "string") {
      url = "/image/logo.png";
    }
    if (url.indexOf("http") == 0) {
      return url;
    }
    if (url.indexOf("/") == 0) {
      url = url.replace("/", "");
    }
    // if (resize) {
    //   url = url.replace('upload/', 'upload/resize/')
    // } else if (small) {
    //   url = url.replace('upload/', 'upload/small/')
    // }
    return store.state.file_url + url;
  });
  inject("price", (money) => {
    try {
      if (money) {
        if (money == "--") {
          return money;
        }
        return Number(money).toLocaleString().replaceAll(",", price_slice);
      }
    } catch (error) {}
    return money;
  });
  inject("getColor", (count) => {
    let list = [
      "#51b34e",
      "#9C27B0",
      "#E91E63",
      "#F44336",
      "#2196F3",
      "#009688",
      "#795548",
    ];

    let items = [];
    for (let index = 0; index < count; index++) {
      items.push(list[index % list.length]);
    }
    return items;
  });
  inject("printById", (id) => {
    const prtHtml = document.getElementById(id).innerHTML;

    let stylesHtml = "";
    for (const node of [
      ...document.querySelectorAll('link[rel="stylesheet"], style'),
    ]) {
      stylesHtml += node.outerHTML;
    }

    const WinPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
    );

    WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
          ${stylesHtml}
        </head>
        <body style='direction: rtl'>
          ${prtHtml}
        </body>
      </html>`);

    WinPrint.document.close();
    setTimeout(() => {
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    }, 1000);
  });
  inject("getAddressContacts", (person) => {
    if (!Boolean(person) || !Boolean(person.AddressContacts)) {
      return [];
    }
    if (Array.isArray(person.AddressContacts)) {
      return JSON.parse(JSON.stringify(person.AddressContacts));
    }
    if (Array.isArray(person.AddressContacts.IdentityContactAddress)) {
      return JSON.parse(
        JSON.stringify(person.AddressContacts.IdentityContactAddress)
      );
    }
    if (Boolean(person.AddressContacts.IdentityContactAddress)) {
      return [
        JSON.parse(
          JSON.stringify(person.AddressContacts.IdentityContactAddress)
        ),
      ];
    }
    return [];
  });
  inject("getContactPhone", (person) => {
    if (!Boolean(person) || !Boolean(person.PhoneContacts)) {
      return [];
    }
    if (Array.isArray(person.PhoneContacts)) {
      return JSON.parse(JSON.stringify(person.PhoneContacts));
    }
    if (Array.isArray(person.PhoneContacts.IdentityContactPhone)) {
      return JSON.parse(
        JSON.stringify(person.PhoneContacts.IdentityContactPhone)
      );
    }
    if (Boolean(person.PhoneContacts.IdentityContactPhone)) {
      return [
        JSON.parse(JSON.stringify(person.PhoneContacts.IdentityContactPhone)),
      ];
    }
    return [];
  });
  inject("getExtendedProperties", (person) => {
    if (!Boolean(person) || !Boolean(person.ExtendedProperties)) {
      return [];
    }
    if (Array.isArray(person.ExtendedProperties)) {
      return JSON.parse(JSON.stringify(person.ExtendedProperties));
    }
    if (
      Array.isArray(person.ExtendedProperties.BaseCrmObjectExtendedPropertyInfo)
    ) {
      return JSON.parse(
        JSON.stringify(
          person.ExtendedProperties.BaseCrmObjectExtendedPropertyInfo
        )
      );
    }
    return [];
  });
  inject("getUsername", (username) => {
    if (typeof username == "string" && username.length > 1) {
      if (username.length < 15) {
        return username;
      }
    }
    return "";
  });
  inject("getRandomString", (length) => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  });
  inject("exportFile", (items, name = "payeshkhj") => {
    try {
      exportFile(items, name);
    } catch (error) {
      $toast.error("خطا در دریافت  طلاعات");
    }
  });

  inject("weekDay", (week_day) => {
    try {
      let week = [
        { value: "شنبه", text: "saturday" },
        { value: "یک‌شنبه", text: "sunday" },
        { value: "دوشنبه", text: "monday" },
        { value: "سه‌شنبه", text: "tuesday" },
        { value: "چهارشنبه", text: "wednesday" },
        { value: "پنج‌شنبه", text: "thursday" },
        { value: "جمعه", text: "friday" },
      ];
      let text = week.filter((x) => x.value == week_day).map((x) => x);

      return text[0].text;
    } catch (error) {
      return "-";
    }
  });
  inject("persianPassedDate", (date) => {
    let minutesPassed = moment().diff(moment(date), "minutes");
    let dateText = "";
    switch (true) {
      case minutesPassed < 0 && minutesPassed > -2:
        dateText = "چند لحظه دیگر";
        break;
      case minutesPassed <= -2 && minutesPassed > -60:
        dateText = Math.abs(minutesPassed) + " دقیقه دیگر";
        break;
      case minutesPassed <= -60 && minutesPassed > -1440:
        dateText = Math.abs(parseInt(minutesPassed / 60)) + " ساعت دیگر";
        break;
      case minutesPassed <= -1440 && minutesPassed > -10080:
        dateText = Math.abs(parseInt(minutesPassed / (60 * 24))) + " روز دیگر";
        break;
      case minutesPassed <= -10080 && minutesPassed > -525600:
        dateText =
          Math.abs(parseInt(minutesPassed / (60 * 24 * 7))) + " هفته دیگر";
        break;
      case minutesPassed <= -525600:
        dateText =
          Math.abs(parseInt(minutesPassed / (60 * 24 * 365))) + " سال دیگر";
        break;
      case minutesPassed == 0:
        dateText = "الان";
        break;
      case minutesPassed < 2 && minutesPassed > 0:
        dateText = "چند لحظه پیش";
        break;
      case minutesPassed < 60 && minutesPassed >= 2:
        dateText = minutesPassed + " دقیقه پیش";
        break;
      case minutesPassed < 1440 && minutesPassed >= 60:
        dateText = parseInt(minutesPassed / 60) + " ساعت پیش";
        break;
      case minutesPassed < 10080 && minutesPassed >= -60:
        dateText = parseInt(minutesPassed / (60 * 24)) + " روز پیش";
        break;
      case minutesPassed < 525600 && minutesPassed >= -60:
        dateText = parseInt(minutesPassed / (60 * 24 * 7)) + " هفته پیش";
        break;
      case minutesPassed >= 525600:
        dateText = parseInt(minutesPassed / (60 * 24 * 365)) + " سال پیش";
        break;
        break;
    }
    return dateText;
  });
};

function exportFile(items, name) {
  const fileName = `${name}.xlsx`;
  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.json_to_sheet(items);
  XLSX.utils.book_append_sheet(wb, ws, "all");
  XLSX.writeFile(wb, fileName);
}

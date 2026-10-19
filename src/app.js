import { COPY, FAQS, GALLERY, REVIEW_KEYS, SERVICES, WHY } from "./content.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");


const state = {
  locale: "en",
  step: 1,
  service: "",
  property: "",
  bedrooms: 2,
  bathrooms: 1,
  businessType: "",
  businessSize: "",
  frequency: "once",
  extras: [],
  date: "",
  time: "",
  user: { name: "", email: "", phone: "", address: "", unit: "", city: "", region: "", postal: "", instructions: "" },
  submitErrors: {}
};

let visibleServiceDetail = "";
let visibleMonth = firstOfMonth(new Date());
let revealObserver;

function t(key) {
  return COPY[state.locale][key] ?? key;
}

function firstOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dayStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date, options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }) {
  if (!date) return "—";
  return new Intl.DateTimeFormat(state.locale === "es" ? "es-US" : "en-US", options).format(date);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function applyStaticTranslations() {
  $$('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  $$('[data-i18n-aria]').forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  document.documentElement.lang = state.locale;
  const languageToggle = $("#languageToggle");
  languageToggle.setAttribute("aria-pressed", String(state.locale === "es"));
  languageToggle.setAttribute("aria-label", t("languageSwitch"));
  languageToggle.children[0].textContent = state.locale === "en" ? "EN" : "ES";
  languageToggle.children[2].textContent = state.locale === "en" ? "ES" : "EN";
  languageToggle.classList.toggle("is-spanish", state.locale === "es");

  const menuToggle = $("#menuToggle");
  const menuIsOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-label", t(menuIsOpen ? "menuClose" : "menuOpen"));

  $("#heroImage").alt = state.locale === "en"
    ? "A warm living room with a fireplace and soft natural light"
    : "Una sala cálida con chimenea y luz natural suave";
  $(".comparison-image--before").alt = state.locale === "en"
    ? "A sink before cleaning, with visible mineral buildup"
    : "Un lavamanos antes de limpiarlo, con depósitos minerales visibles";
  $(".comparison-image--after").alt = state.locale === "en"
    ? "The same sink after cleaning"
    : "El mismo lavamanos después de limpiarlo";
  $("#comparisonRange").setAttribute("aria-label", t("sliderAria"));

  document.title = state.locale === "en"
    ? "Clara Home Care — Thoughtful care, right at home"
    : "Clara Home Care — Cuidado atento, para tu hogar";
  $("meta[name='description']").content = state.locale === "en"
    ? "Thoughtful home and workspace cleaning. Request a service in three simple steps, in English or Spanish."
    : "Limpieza cuidadosa para hogares y espacios de trabajo. Solicítala en tres pasos sencillos, en inglés o español.";
}

function renderServices() {
  const grid = $("#servicesGrid");
  grid.innerHTML = SERVICES.map((service, index) => `
    <article class="service-card service-card--${index + 1} reveal">
      <button class="service-card__button" type="button" data-service-id="${service.id}" aria-label="${escapeHtml(service.name[state.locale])} — ${escapeHtml(t("serviceOpen"))}">
        <img src="${service.image}" alt="${escapeHtml(service.alt[state.locale])}" loading="lazy" />
        <span class="service-card__shade"></span>
        <span class="service-card__number">0${index + 1}</span>
        <span class="service-card__content">
          <span class="service-card__name">${escapeHtml(service.name[state.locale])}</span>
          <span class="service-card__description">${escapeHtml(service.description[state.locale])}</span>
        </span>
        <span class="service-card__arrow" aria-hidden="true">↗</span>
      </button>
    </article>
  `).join("");

  if (visibleServiceDetail) renderServiceDetail(visibleServiceDetail);
  observeReveals(grid);
}

function renderServiceDetail(id) {
  const service = SERVICES.find((item) => item.id === id);
  if (!service) return;
  const detail = $("#serviceDetail");
  detail.innerHTML = `
    <button class="service-detail__back text-link" type="button" data-detail-back>
      <span aria-hidden="true">←</span><span>${escapeHtml(t("serviceBack"))}</span>
    </button>
    <div class="service-detail__layout">
      <div class="service-detail__image-wrap">
        <img src="${service.image}" alt="${escapeHtml(service.alt[state.locale])}" />
        <span class="eyebrow eyebrow--light service-detail__image-label">${escapeHtml(t("serviceDetailEyebrow"))}</span>
      </div>
      <div class="service-detail__copy">
        <p class="eyebrow">${escapeHtml(t("servicesEyebrow"))}</p>
        <h3>${escapeHtml(service.name[state.locale])}</h3>
        <p class="service-detail__description">${escapeHtml(service.description[state.locale])}</p>
        <ul>${service.details[state.locale].map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
        <p class="service-detail__note">${escapeHtml(t("serviceDetailNote"))}</p>
        <button class="button button--olive" type="button" data-detail-book="${service.id}">${escapeHtml(t("serviceDetailCta"))}<span aria-hidden="true">↗</span></button>
      </div>
    </div>
  `;
  detail.hidden = false;
  $("#servicesGrid").hidden = true;
  observeReveals(detail);
}

function showServiceGrid() {
  visibleServiceDetail = "";
  $("#serviceDetail").hidden = true;
  $("#servicesGrid").hidden = false;
  $("#servicesGrid").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
}

function renderGallery() {
  const gallery = $("#galleryGrid");
  gallery.innerHTML = GALLERY.map((item, index) => `
    <figure class="gallery-item ${item.shape} reveal">
      <img src="${item.image}" alt="${escapeHtml(t(item.altKey))}" loading="lazy" />

    </figure>
  `).join("");
  observeReveals(gallery);
}

function renderWhy() {
  $("#whyList").innerHTML = WHY.map((item, index) => `
    <article class="why-item reveal">
      <span class="why-item__index">0${index + 1}</span>
      <div><h3>${escapeHtml(t(item.titleKey))}</h3><p>${escapeHtml(t(item.textKey))}</p></div>
      <span class="why-item__line" aria-hidden="true"></span>
    </article>
  `).join("");
  observeReveals($("#whyList"));
}

function renderReviews() {
  const track = $("#reviewsTrack");
  track.innerHTML = REVIEW_KEYS.map((key, index) => `
    <article class="review-card">
      <span class="review-card__index">0${index + 1} / 0${REVIEW_KEYS.length}</span>
      <p class="review-card__quote">${escapeHtml(t(key))}</p>
      <span class="review-card__attribution">${escapeHtml(t("reviewAttribution"))}</span>
      <span class="review-card__sample">${escapeHtml(t("sampleReview"))}</span>
    </article>
  `).join("");
  $("#reviewsPrev").setAttribute("aria-label", t("previousReviews"));
  $("#reviewsNext").setAttribute("aria-label", t("nextReviews"));
}

function renderFaq() {
  $("#faqList").innerHTML = FAQS.map((faq, index) => `
    <article class="faq-item">
      <h3>
        <button class="faq-question" id="faqQuestion${index + 1}" type="button" aria-expanded="false" aria-controls="faqAnswer${index + 1}" data-faq-index="${index}">
          <span>${escapeHtml(t(faq.questionKey))}</span><span class="faq-question__mark" aria-hidden="true">+</span>
        </button>
      </h3>
      <div class="faq-answer" id="faqAnswer${index + 1}" role="region" aria-labelledby="faqQuestion${index + 1}" hidden>
        <p>${escapeHtml(t(faq.answerKey))}</p>
      </div>
    </article>
  `).join("");
}

function stepLabel(step) {
  return t(["stepOne", "stepTwo", "stepThree"][step - 1]);
}

function renderProgress() {
  const progress = $("#bookingProgress");
  const visualStep = Math.min(state.step, 3);
  $("#bookingStepCounter").textContent = String(visualStep).padStart(2, "0");
  $("#bookingTrackFill").style.width = `${visualStep * (100 / 3)}%`;
  progress.innerHTML = [1, 2, 3].map((step) => {
    const complete = state.step > step || state.step === 4;
    const active = state.step === step;
    return `<li class="booking-progress__item${active ? " is-active" : ""}${complete ? " is-complete" : ""}"${active ? ' aria-current="step"' : ""}>
      <span class="booking-progress__number">${complete ? "✓" : `0${step}`}</span>
      <span class="booking-progress__label">${escapeHtml(stepLabel(step))}</span>
    </li>`;
  }).join("");
}

function getService(id = state.service) {
  return SERVICES.find((service) => service.id === id);
}

function getFrequency() {
  return state.frequency ? t(state.frequency) : "—";
}

function getSpaceSummary() {
  if (state.property === "home") {
    const bedroomUnit = t(state.bedrooms === 1 ? "bedroomSingular" : "bedroomPlural");
    const bathroomUnit = t(state.bathrooms === 1 ? "bathroomSingular" : "bathroomPlural");
    return t("spaceHomeSummary")
      .replace("{bedrooms}", `${state.bedrooms} ${bedroomUnit}`)
      .replace("{bathrooms}", `${state.bathrooms} ${bathroomUnit}`);
  }
  if (state.property === "commercial") {
    const business = state.businessType ? t(state.businessType) : "—";
    const size = state.businessSize ? t(state.businessSize) : "—";
    return t("spaceCommercialSummary").replace("{business}", business).replace("{size}", size);
  }
  return "—";
}

function getAddress() {
  return [state.user.address, state.user.unit, state.user.city, state.user.region, state.user.postal]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ") || "—";
}

function summaryRows(includeAddress = false) {
  const service = getService();
  const date = parseLocalDate(state.date);
  const extrasText = state.extras.length
    ? state.extras.map((extra) => t(extra)).join(", ")
    : t("summaryNone");
  const rows = [
    ["summaryService", service ? service.name[state.locale] : "—"],
    ["summarySpace", getSpaceSummary()],
    ["summaryFrequency", getFrequency()],
    ["summaryExtras", extrasText],
    ["summaryDate", date ? formatDate(date) : "—"],
    ["summaryTime", state.time ? `${t(state.time)} · ${t(state.time === "morning" ? "morningTime" : "afternoonTime")}` : "—"]
  ];
  if (includeAddress) rows.push(["summaryAddress", getAddress()]);
  return rows;
}

function renderSummary(includeAddress = false, className = "summary-card") {
  return `<section class="${className}" aria-label="${escapeHtml(t("reservationSummary"))}">
    <h3>${escapeHtml(t("reservationSummary"))}</h3>
    <dl>${summaryRows(includeAddress).map(([label, value]) => `
      <div class="summary-row"><dt>${escapeHtml(t(label))}</dt><dd>${escapeHtml(value)}</dd></div>
    `).join("")}</dl>
  </section>`;
}

function renderStepOne() {
  const serviceChoices = SERVICES.map((service) => `
    <button class="service-choice${state.service === service.id ? " is-selected" : ""}" type="button" data-action="select-service" data-value="${service.id}" data-focus="service-${service.id}" aria-pressed="${state.service === service.id}">
      <span class="service-choice__mark" aria-hidden="true"></span><img class="service-choice__image" src="${service.image}" alt="" loading="lazy" />
      <span class="service-choice__text"><strong>${escapeHtml(service.name[state.locale])}</strong><small>${escapeHtml(service.description[state.locale])}</small></span>
      <span class="service-choice__arrow" aria-hidden="true">›</span>
    </button>
  `).join("");

  const homeFields = state.property === "home" ? `
    <div class="counter-grid">
      ${counterMarkup("bedrooms", state.bedrooms)}
      ${counterMarkup("bathrooms", state.bathrooms)}
    </div>
  ` : "";

  const businessFields = state.property === "commercial" ? `
    <div class="form-grid form-grid--two">
      <label class="form-field" for="businessType"><span>${escapeHtml(t("businessType"))}</span>
        <select id="businessType" data-field="businessType">
          <option value="">${escapeHtml(t("businessType"))}</option>
          ${["businessOffice", "businessRetail", "businessOther"].map((key) => `<option value="${key}"${state.businessType === key ? " selected" : ""}>${escapeHtml(t(key))}</option>`).join("")}
        </select>
      </label>
      <label class="form-field" for="businessSize"><span>${escapeHtml(t("businessSize"))}</span>
        <select id="businessSize" data-field="businessSize">
          <option value="">${escapeHtml(t("businessSize"))}</option>
          ${["sizeSmall", "sizeMedium", "sizeLarge"].map((key) => `<option value="${key}"${state.businessSize === key ? " selected" : ""}>${escapeHtml(t(key))}</option>`).join("")}
        </select>
      </label>
    </div>
  ` : "";

  const extraKeys = state.property === "commercial"
    ? ["extraDisinfect", "extraWindows"]
    : state.property === "home" ? ["extraOven", "extraFridge", "extraWindows", "extraLaundry"] : [];

  return `
    <div class="step-panel" aria-labelledby="stepPanelTitle">
      <div class="step-panel__intro"><span class="step-panel__number">01</span><div><h3 id="stepPanelTitle" tabindex="-1">${escapeHtml(t("chooseService"))}</h3><p>${escapeHtml(t("chooseServiceHint"))}</p></div></div>
      <fieldset class="service-choice-list"><legend class="sr-only">${escapeHtml(t("chooseService"))}</legend>${serviceChoices}</fieldset>
      <div class="step-divider"></div>
      <fieldset class="property-fieldset"><legend>${escapeHtml(t("propertyQuestion"))}</legend>
        <div class="choice-pills">
          ${["home", "commercial"].map((property) => `<button class="choice-pill${state.property === property ? " is-selected" : ""}" type="button" data-action="set-property" data-value="${property}" data-focus="property-${property}" aria-pressed="${state.property === property}">${escapeHtml(t(property))}</button>`).join("")}
        </div>
      </fieldset>
      ${homeFields}${businessFields}
      <div class="step-divider"></div>
      <fieldset class="property-fieldset"><legend>${escapeHtml(t("frequency"))}</legend>
        <div class="choice-pills choice-pills--wrap">
          ${["once", "weekly", "biweekly", "monthly"].map((frequency) => `<button class="choice-pill${state.frequency === frequency ? " is-selected" : ""}" type="button" data-action="set-frequency" data-value="${frequency}" data-focus="frequency-${frequency}" aria-pressed="${state.frequency === frequency}">${escapeHtml(t(frequency))}</button>`).join("")}
        </div>
      </fieldset>
      ${extraKeys.length ? `<fieldset class="property-fieldset"><legend>${escapeHtml(t("extras"))}</legend><div class="choice-pills choice-pills--wrap">${extraKeys.map((key) => `<button class="choice-pill choice-pill--extra${state.extras.includes(key) ? " is-selected" : ""}" type="button" data-action="toggle-extra" data-value="${key}" data-focus="extra-${key}" aria-pressed="${state.extras.includes(key)}">${escapeHtml(t(key))}</button>`).join("")}</div></fieldset>` : ""}
      <div class="step-actions"><a class="text-link" href="#services"><span aria-hidden="true">←</span><span>${escapeHtml(t("backToServices"))}</span></a><button class="button button--olive" type="button" data-action="next">${escapeHtml(t("continue"))}<span aria-hidden="true">→</span></button></div>
    </div>
  `;
}

function counterMarkup(key, value) {
  const label = t(key);
  return `<div class="counter-control">
    <span class="counter-control__label">${escapeHtml(label)}</span>
    <div class="counter-control__buttons" role="group" aria-label="${escapeHtml(label)}">
      <button type="button" data-action="counter" data-field="${key}" data-delta="-1" data-focus="${key}-down" aria-label="− ${escapeHtml(label)}"${value <= 1 ? " disabled" : ""}>−</button>
      <output aria-live="polite">${value}</output>
      <button type="button" data-action="counter" data-field="${key}" data-delta="1" data-focus="${key}-up" aria-label="+ ${escapeHtml(label)}">+</button>
    </div>
  </div>`;
}

function calendarMarkup() {
  const monthTitle = formatDate(visibleMonth, { month: "long", year: "numeric" });
  const weekdayStart = new Date(2024, 0, 1); // Monday
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekdayStart.getFullYear(), weekdayStart.getMonth(), weekdayStart.getDate() + index);
    return `<span class="calendar-weekday">${escapeHtml(new Intl.DateTimeFormat(state.locale === "es" ? "es-US" : "en-US", { weekday: "short" }).format(date))}</span>`;
  }).join("");
  const offset = (visibleMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const today = dayStart();
  const cells = [];
  for (let blank = 0; blank < offset; blank += 1) cells.push('<span class="calendar-empty" aria-hidden="true"></span>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
    const isPast = date <= today;
    const value = localDateString(date);
    const isSelected = state.date === value;
    cells.push(`<button class="calendar-day${isSelected ? " is-selected" : ""}" type="button" data-action="choose-date" data-value="${value}" data-focus="date-${value}" aria-label="${escapeHtml(formatDate(date))}" aria-pressed="${isSelected}"${isPast ? " disabled" : ""}>${day}</button>`);
  }
  const current = firstOfMonth(new Date());
  const prevDisabled = visibleMonth.getFullYear() === current.getFullYear() && visibleMonth.getMonth() === current.getMonth();
  return `
    <div class="calendar" aria-label="${escapeHtml(t("calendarInstructions"))}">
      <div class="calendar__header">
        <button class="calendar__nav" type="button" data-action="month-prev" data-focus="month-prev" aria-label="${escapeHtml(t("previousMonth"))}"${prevDisabled ? " disabled" : ""}>←</button>
        <h4 aria-live="polite">${escapeHtml(monthTitle)}</h4>
        <button class="calendar__nav" type="button" data-action="month-next" data-focus="month-next" aria-label="${escapeHtml(t("nextMonth"))}">→</button>
      </div>
      <div class="calendar__grid" role="group" aria-label="${escapeHtml(monthTitle)}">${weekdays}${cells.join("")}</div>
      <p class="calendar__selected" aria-live="polite">${state.date ? escapeHtml(formatDate(parseLocalDate(state.date))) : escapeHtml(t("pickDateHint"))}</p>
    </div>
  `;
}

function renderStepTwo() {
  const times = [
    { id: "morning", label: "morning", detail: "morningTime" },
    { id: "afternoon", label: "afternoon", detail: "afternoonTime" }
  ];
  return `
    <div class="step-panel" aria-labelledby="stepPanelTitle">
      <div class="step-panel__intro"><span class="step-panel__number">02</span><div><h3 id="stepPanelTitle" tabindex="-1">${escapeHtml(t("pickDate"))}</h3><p>${escapeHtml(t("pickDateHint"))}</p></div></div>
      <div class="date-time-layout">
        ${calendarMarkup()}
        <div class="time-picker">
          <h4>${escapeHtml(t("chooseWindow"))}</h4>
          <div class="time-choice-list">
            ${times.map((time) => `<button class="time-choice${state.time === time.id ? " is-selected" : ""}" type="button" data-action="choose-time" data-value="${time.id}" data-focus="time-${time.id}" aria-pressed="${state.time === time.id}"><span class="time-choice__radio" aria-hidden="true"></span><span><strong>${escapeHtml(t(time.label))}</strong><small>${escapeHtml(t(time.detail))}</small></span></button>`).join("")}
          </div>
          <p class="availability-note"><span aria-hidden="true">i</span>${escapeHtml(t("timePreferenceNote"))}</p>
        </div>
      </div>
      <div class="step-actions"><button class="button button--quiet" type="button" data-action="previous"><span aria-hidden="true">←</span>${escapeHtml(t("back"))}</button><button class="button button--olive" type="button" data-action="next">${escapeHtml(t("continue"))}<span aria-hidden="true">→</span></button></div>
    </div>
  `;
}

function fieldMarkup(key, labelKey, placeholderKey, type = "text", required = true, extra = "") {
  const value = escapeHtml(state.user[key]);
  const error = state.submitErrors[key] || "";
  const requiredAttr = required ? "required" : "";
  const invalid = error ? ' aria-invalid="true"' : "";
  const fieldId = `guest-${key}`;
  return `<label class="form-field" for="${fieldId}">
    <span>${escapeHtml(t(labelKey))}${required ? '<i aria-hidden="true">*</i>' : ""}</span>
    <input id="${fieldId}" name="${key}" type="${type}" data-field="${key}" value="${value}" placeholder="${escapeHtml(t(placeholderKey))}" aria-describedby="${fieldId}-error" ${requiredAttr}${invalid} ${extra} />
    <small class="field-error" id="${fieldId}-error" aria-live="polite"${error ? "" : " hidden"}>${escapeHtml(error)}</small>
  </label>`;
}

function renderStepThree() {
  return `
    <div class="step-panel" aria-labelledby="stepPanelTitle">
      <div class="step-panel__intro"><span class="step-panel__number">03</span><div><h3 id="stepPanelTitle" tabindex="-1">${escapeHtml(t("stepThree"))}</h3><p>${escapeHtml(t("requestFootnote"))}</p></div></div>
      <div class="your-details-layout">
        <form class="guest-form" id="customerForm" novalidate>
          <div class="form-grid form-grid--two">
            ${fieldMarkup("name", "name", "namePlaceholder")}
            ${fieldMarkup("email", "email", "emailPlaceholder", "email", true, 'autocomplete="email" inputmode="email"')}
            ${fieldMarkup("phone", "phone", "phonePlaceholder", "tel", true, 'autocomplete="tel" inputmode="tel"')}
            ${fieldMarkup("address", "address", "addressPlaceholder", "text", true, 'autocomplete="street-address"')}
            ${fieldMarkup("unit", "unit", "unitPlaceholder", "text", false, 'autocomplete="address-line2"')}
            ${fieldMarkup("city", "city", "cityPlaceholder", "text", true, 'autocomplete="address-level2"')}
            ${fieldMarkup("region", "region", "regionPlaceholder", "text", true, 'autocomplete="address-level1"')}
            ${fieldMarkup("postal", "postal", "postalPlaceholder", "text", true, 'autocomplete="postal-code"')}
            <label class="form-field form-field--full" for="guest-instructions"><span>${escapeHtml(t("instructions"))}</span><textarea id="guest-instructions" name="instructions" data-field="instructions" placeholder="${escapeHtml(t("instructionsPlaceholder"))}">${escapeHtml(state.user.instructions)}</textarea></label>
          </div>
          <div class="form-submit-row"><p>${escapeHtml(t("requestFootnote"))}</p><button class="button button--olive" type="submit">${escapeHtml(t("requestButton"))}<span aria-hidden="true">→</span></button></div>
        </form>
        <div class="summary-column">${renderSummary(true)}</div>
      </div>
      <div class="step-actions step-actions--under-form"><button class="button button--quiet" type="button" data-action="previous"><span aria-hidden="true">←</span>${escapeHtml(t("back"))}</button></div>
    </div>
  `;
}

function renderConfirmation() {
  return `
    <div class="confirmation-panel" aria-labelledby="confirmationTitle">
      <div class="confirmation-panel__ornament" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="eyebrow">${escapeHtml(t("confirmationEyebrow"))}</p>
      <span class="confirmation-label">${escapeHtml(t("confirmationLabel"))}</span>
      <h3 id="confirmationTitle" tabindex="-1">${escapeHtml(t("confirmationTitle"))}</h3>
      <p class="confirmation-panel__body">${escapeHtml(t("confirmationBody"))}</p>
      ${renderSummary(false, "summary-card summary-card--confirmation")}
      <button class="button button--olive" type="button" data-action="restart">${escapeHtml(t("tryAnother"))}<span aria-hidden="true">↻</span></button>
    </div>
  `;
}

function renderBooking() {
  renderProgress();
  const view = $("#bookingStepView");
  const previousStep = Number(view.dataset.step || 0);
  if (state.step === 1) view.innerHTML = renderStepOne();
  else if (state.step === 2) view.innerHTML = renderStepTwo();
  else if (state.step === 3) view.innerHTML = renderStepThree();
  else view.innerHTML = renderConfirmation();
  if (previousStep && previousStep !== state.step) {
    view.dataset.direction = state.step > previousStep ? "forward" : "back";
    view.classList.remove("is-step-changing");
    void view.offsetWidth;
    view.classList.add("is-step-changing");
  }
  view.dataset.step = String(state.step);
  if (state.step === 3) updateFieldErrors();
}

function showBookingError(message) {
  const box = $("#bookingError");
  box.textContent = message;
  box.hidden = false;
  box.focus?.({ preventScroll: true });
}

function clearBookingError() {
  const box = $("#bookingError");
  box.textContent = "";
  box.hidden = true;
}

function scrollStepIntoView() {
  const view = $("#bookingStepView");
  view.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
  requestAnimationFrame(() => view.focus({ preventScroll: true }));
}

function setStep(step) {
  state.step = step;
  clearBookingError();
  renderBooking();
  scrollStepIntoView();
}

function validateStepOne() {
  if (!state.service) return showBookingError(t("errorSelectService")), false;
  if (!state.property) return showBookingError(t("errorProperty")), false;
  if (state.property === "commercial" && (!state.businessType || !state.businessSize)) {
    return showBookingError(t("errorProperty")), false;
  }
  return true;
}

function validateStepTwo() {
  const selectedDate = parseLocalDate(state.date);
  if (!selectedDate || selectedDate <= dayStart()) return showBookingError(t("errorDate")), false;
  if (!state.time) return showBookingError(t("errorTime")), false;
  return true;
}

function nextStep() {
  if (state.step === 1 && validateStepOne()) setStep(2);
  else if (state.step === 2 && validateStepTwo()) setStep(3);
}

function previousStep() {
  if (state.step === 2) setStep(1);
  else if (state.step === 3) setStep(2);
}

function updateFieldErrors() {
  $$(".form-field input, .form-field textarea", $("#bookingStepView")).forEach((field) => {
    if (!field.name) return;
    const error = state.submitErrors[field.name] || "";
    const errorNode = $(`#${field.id}-error`);
    if (errorNode) {
      errorNode.textContent = error;
      errorNode.hidden = !error;
    }
    field.setAttribute("aria-invalid", String(Boolean(error)));
  });
}

function validateGuestForm() {
  const errors = {};
  const requiredFields = ["name", "email", "phone", "address", "city", "region", "postal"];
  for (const key of requiredFields) {
    if (!state.user[key].trim()) errors[key] = t("errorRequired");
  }
  if (state.user.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.user.email.trim())) {
    errors.email = t("errorEmail");
  }
  if (state.user.phone.trim() && state.user.phone.replace(/\D/g, "").length < 7) {
    errors.phone = t("errorPhone");
  }
  return errors;
}

function submitGuestForm(event) {
  if (event.target.id !== "customerForm") return;
  event.preventDefault();
  state.submitErrors = validateGuestForm();
  if (Object.keys(state.submitErrors).length) {
    renderBooking();
    const firstError = $("[aria-invalid='true']", $("#bookingStepView"));
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
    }
    return;
  }
  setStep(4);
}

function resetBooking() {
  state.step = 1;
  state.service = "";
  state.property = "";
  state.bedrooms = 2;
  state.bathrooms = 1;
  state.businessType = "";
  state.businessSize = "";
  state.frequency = "once";
  state.extras = [];
  state.date = "";
  state.time = "";
  state.user = { name: "", email: "", phone: "", address: "", unit: "", city: "", region: "", postal: "", instructions: "" };
  state.submitErrors = {};
  visibleMonth = firstOfMonth(new Date());
  clearBookingError();
  renderBooking();
  scrollStepIntoView();
}

function focusAfterRender(focusKey) {
  if (!focusKey) return;
  requestAnimationFrame(() => {
    const target = $(`[data-focus="${CSS.escape(focusKey)}"]`, $("#bookingStepView"));
    target?.focus({ preventScroll: true });
  });
}

function handleBookingAction(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, value, field, delta, focus } = target.dataset;

  if (action === "next") return nextStep();
  if (action === "previous") return previousStep();
  if (action === "restart") return resetBooking();

  clearBookingError();
  if (action === "select-service") state.service = value;
  else if (action === "set-property") {
    state.property = value;
    state.extras = [];
  } else if (action === "set-frequency") state.frequency = value;
  else if (action === "toggle-extra") {
    state.extras = state.extras.includes(value)
      ? state.extras.filter((extra) => extra !== value)
      : [...state.extras, value];
  } else if (action === "counter") {
    const key = field === "bedrooms" ? "bedrooms" : "bathrooms";
    state[key] = Math.max(1, state[key] + Number(delta));
  } else if (action === "month-prev") {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  } else if (action === "month-next") {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  } else if (action === "choose-date") {
    const date = parseLocalDate(value);
    if (!date || date <= dayStart()) return showBookingError(t("errorDate"));
    state.date = value;
  } else if (action === "choose-time") state.time = value;

  renderBooking();
  focusAfterRender(focus);
}

function updateUserState(event) {
  const target = event.target;
  if (!target.matches("[data-field]")) return;
  const key = target.dataset.field;
  if (key in state.user) {
    state.user[key] = target.value;
    if (state.submitErrors[key]) {
      delete state.submitErrors[key];
      const error = $(`#${target.id}-error`);
      if (error) error.hidden = true;
      target.setAttribute("aria-invalid", "false");
    }
    if (state.step === 3) {
      const summary = $(".summary-column", $("#bookingStepView"));
      if (summary) summary.innerHTML = renderSummary(true);
    }
  } else if (key === "businessType" || key === "businessSize") {
    state[key] = target.value;
  }
}

function renderAll() {
  applyStaticTranslations();
  renderServices();
  renderGallery();
  renderWhy();
  renderReviews();
  renderFaq();
  renderBooking();
}

function initLanguageToggle() {
  $("#languageToggle").addEventListener("click", () => {
    state.locale = state.locale === "en" ? "es" : "en";
    applyStaticTranslations();
    renderServices();
    renderGallery();
    renderWhy();
    renderReviews();
    renderFaq();
    renderBooking();
    renderSonnyLocale();
  });
}

function initServices() {
  $("#servicesGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-service-id]");
    if (!button) return;
    visibleServiceDetail = button.dataset.serviceId;
    renderServiceDetail(visibleServiceDetail);
    $("#serviceDetail").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
  });

  $("#serviceDetail").addEventListener("click", (event) => {
    if (event.target.closest("[data-detail-back]")) return showServiceGrid();
    const bookButton = event.target.closest("[data-detail-book]");
    if (bookButton) {
      state.service = bookButton.dataset.detailBook;
      state.step = 1;
      clearBookingError();
      renderBooking();
      scrollStepIntoView();
    }
  });
}

function closeMobileMenu() {
  $("#menuToggle").setAttribute("aria-expanded", "false");
  $("#menuToggle").setAttribute("aria-label", t("menuOpen"));
  $("#mobileNav").hidden = true;
  document.body.classList.remove("menu-is-open");
}

function initMobileMenu() {
  const button = $("#menuToggle");
  const nav = $("#mobileNav");
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", t(open ? "menuClose" : "menuOpen"));
    nav.hidden = !open;
    document.body.classList.toggle('menu-is-open', open);
  });
  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    closeMobileMenu();
  });
}

function initFaq() {
  $("#faqList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-faq-index]");
    if (!button) return;
    const panel = $(`#faqAnswer${Number(button.dataset.faqIndex) + 1}`);
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    $(".faq-question__mark", button).textContent = open ? "−" : "+";
  });
}

function initReviewControls() {
  const track = $("#reviewsTrack");
  $("#reviewsPrev").addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: reduceMotion.matches ? "auto" : "smooth" }));
  $("#reviewsNext").addEventListener("click", () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: reduceMotion.matches ? "auto" : "smooth" }));
}

function initComparison() {
  const range = $("#comparisonRange");
  const widget = $("#comparisonWidget");
  const frame = $("#comparisonFrame");
  const updateFromPointer = (event) => {
    const bounds = frame.getBoundingClientRect();
    const value = Math.round(Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100)));
    range.value = String(value);
    widget.style.setProperty("--split", `${value}%`);
  };
  let dragging = false;
  range.addEventListener("input", () => widget.style.setProperty("--split", `${range.value}%`));
  frame.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType !== "touch") return;
    event.preventDefault();
    dragging = true;
    try { frame.setPointerCapture?.(event.pointerId); } catch { /* Pointer capture is an enhancement, not a dependency. */ }
    range.focus({ preventScroll: true });
    updateFromPointer(event);
  });
  frame.addEventListener("pointermove", (event) => {
    if (dragging) updateFromPointer(event);
  });
  const stopDragging = () => { dragging = false; };
  frame.addEventListener("pointerup", stopDragging);
  frame.addEventListener("pointercancel", stopDragging);
}

function observeReveals(root = document) {
  const elements = $$(".reveal", root);
  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  }
  elements.forEach((element) => revealObserver.observe(element));
}

function initHeroMotion() {
  const hero = $("#hero");
  const image = $("#heroImage");
  if (reduceMotion.matches) return;
  let queued = false;
  const update = () => {
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
    image.style.transform = `scale(${1.035 + progress * 0.075}) translate3d(0, ${progress * 2.2}%, 0)`;
    queued = false;
  };
  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

const SONNY = {
  en: {
    status: "Interactive demo guide", hint: "Chat with booking assistant", open: "Chat with the AI booking assistant",
    close: "Close chat", inputLabel: "Ask the booking assistant a question", placeholder: "Ask about booking...", send: "Send message",
    note: "Demo assistant. No live AI or messages sent.",
    intro: "Hi! I can guide you through the booking demo. What would you like to know?",
    topics: [["book", "Try a booking"], ["quote", "Request a quote"], ["times", "Available times"]],
    book: "Choose a cleaning service, select a preferred future date and time, then enter demo details. It takes just 3 steps!",
    quote: "Select Custom Quote under Services, then describe the space and what you need in the final step.",
    times: "The calendar shows future dates for demonstration only. These time windows are preferences, not live availability.",
    data: "This is a safe front-end demo. It never transmits or saves the details you enter, and no real booking is made.",
    other: "I can help with booking steps, custom quotes, or preferred dates. Which would you like to try?",
    go: "Go to the booking form"
  },
  es: {
    status: "Guía interactiva de demostración", hint: "Chat con el asistente", open: "Chatea con el asistente de reservas con IA",
    close: "Cerrar chat", inputLabel: "Pregúntale al asistente de reservas", placeholder: "Pregunta sobre reservas...", send: "Enviar mensaje",
    note: "Asistente de demostración. No usa IA en vivo ni envía mensajes.",
    intro: "¡Hola! Puedo ayudarte a probar este demo de reservas. ¿Qué necesitas saber?",
    topics: [["book", "Probar reserva"], ["quote", "Pedir cotización"], ["times", "Fechas disponibles"]],
    book: "Elige un servicio, una fecha y un horario preferido, y completa tus datos de prueba. ¡Son solo 3 pasos!",
    quote: "Elige Custom Quote en Servicios y describe el espacio y lo que necesitas en el último paso.",
    times: "El calendario muestra fechas futuras como demostración. Los horarios son preferencias, no disponibilidad en vivo.",
    data: "Este demo no envía ni guarda los datos que escribes, y no crea reservas reales.",
    other: "Puedo ayudarte con los pasos para reservar, cotizaciones o fechas preferidas. ¿Qué quieres probar?",
    go: "Ir al formulario de reserva"
  }
};
let sonnyIntroduced = false;
function sonnyText() { return SONNY[state.locale]; }
function appendSonnyMessage(message, author = "assistant") {
  const log = $("#sonnyMessages");
  const bubble = document.createElement("p");
  bubble.className = "sonny-message sonny-message--" + author;
  bubble.textContent = message;
  log.append(bubble);
  log.scrollTop = log.scrollHeight;
}
function renderSonnyLocale() {
  const copy = sonnyText();
  $("#sonnyStatus").textContent = copy.status;
  $("#sonnyToggleHint").textContent = copy.hint;
  $("#sonnyToggle").setAttribute("aria-label", copy.open);
  $("#sonnyClose").setAttribute("aria-label", copy.close);
  $("#sonnyInputLabel").textContent = copy.inputLabel;
  $("#sonnyInput").placeholder = copy.placeholder;
  $("#sonnySend").setAttribute("aria-label", copy.send);
  $("#sonnyNote").textContent = copy.note;
  $("#sonnyTopics").replaceChildren();
  for (const [topic, label] of copy.topics) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.sonnyTopic = topic;
    button.textContent = label;
    $("#sonnyTopics").append(button);
  }
  if (!sonnyIntroduced) return;
  $("#sonnyMessages").replaceChildren();
  appendSonnyMessage(copy.intro);
}
function toggleSonny(open) {
  const panel = $("#sonnyPanel");
  panel.hidden = !open;
  $("#sonnyToggle").setAttribute("aria-expanded", String(open));
  $("#sonnyAssistant").classList.toggle("is-open", open);
  if (open) {
    if (!sonnyIntroduced) { sonnyIntroduced = true; appendSonnyMessage(sonnyText().intro); }
    $("#sonnyInput").focus({ preventScroll: true });
  } else $("#sonnyToggle").focus({ preventScroll: true });
}
function answerSonny(query, topic) {
  const q = (query || "").toLowerCase();
  const copy = sonnyText();
  let selected = topic;
  if (!selected) {
    if (/quot|estim|cotiz|presup|custom/.test(q)) selected = "quote";
    else if (/date|time|calendar|avail|fecha|hora|dispon/.test(q)) selected = "times";
    else if (/data|privacy|informaci|save|send|real|segur|priv/.test(q)) selected = "data";
    else if (/book|reserv|clean|step|paso|service|servicio/.test(q)) selected = "book";
  }
  appendSonnyMessage(copy[selected] || copy.other);
  if (selected === "book" || selected === "quote") {
    const link = document.createElement("a");
    link.href = selected === "quote" ? "#services" : "#booking";
    link.className = "sonny-jump";
    link.textContent = copy.go + " ↗";
    link.addEventListener("click", () => toggleSonny(false));
    $("#sonnyMessages").append(link);
  }
}
function initSonny() {
  renderSonnyLocale();
  $("#sonnyToggle").addEventListener("click", () => toggleSonny($("#sonnyPanel").hidden));
  $("#sonnyClose").addEventListener("click", () => toggleSonny(false));
  $("#sonnyTopics").addEventListener("click", (event) => {
    const topic = event.target.closest("[data-sonny-topic]")?.dataset.sonnyTopic;
    if (!topic) return;
    const label = sonnyText().topics.find((item) => item[0] === topic)?.[1] || topic;
    appendSonnyMessage(label, "visitor");
    answerSonny("", topic);
  });
  $("#sonnyForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#sonnyInput");
    const value = input.value.trim();
    if (!value) return;
    appendSonnyMessage(value.slice(0, 240), "visitor");
    input.value = "";
    answerSonny(value);
    input.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!$("#sonnyPanel").hidden) toggleSonny(false);
    if ($("#menuToggle").getAttribute("aria-expanded") === "true") closeMobileMenu();
  });
}

function init() {
  renderAll();
  initLanguageToggle();
  initServices();
  initMobileMenu();
  initFaq();
  initReviewControls();
  initComparison();
  initHeroMotion();
  initSonny();

  const bookingView = $("#bookingStepView");
  bookingView.addEventListener("click", handleBookingAction);
  bookingView.addEventListener("change", updateUserState);
  bookingView.addEventListener("input", updateUserState);
  bookingView.addEventListener("submit", submitGuestForm);

  observeReveals(document);
}

init();

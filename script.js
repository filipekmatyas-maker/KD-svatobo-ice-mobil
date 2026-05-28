const toggle = document.querySelector('.mobile-toggle');
const links = document.querySelector('.nav-links');

if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));


// Přepínání dnů v denním menu
const dayTabs = document.querySelectorAll('.day-tab');
const dayPanels = document.querySelectorAll('.day-panel');

dayTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const day = tab.dataset.day;

    dayTabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');

    dayPanels.forEach((panel) => {
      panel.classList.remove('active', 'switching');
      if (panel.id === `day-${day}`) {
        panel.classList.add('active', 'switching');
        setTimeout(() => panel.classList.remove('switching'), 450);
      }
    });
  });
});

// Naklikávací objednávka rozvozu + doprava podle obce
const orderFoods = document.querySelectorAll('.order-food');
const orderTextarea = document.querySelector('#jidlo');
const totalPriceEl = document.querySelector('#total-price');
const foodPriceEl = document.querySelector('#food-price');
const deliveryPriceEl = document.querySelector('#delivery-price');
const hiddenFoodEl = document.querySelector('#cena-jidel');
const hiddenDeliveryEl = document.querySelector('#cena-dopravy');
const hiddenTotalEl = document.querySelector('#celkova-cena');
const deliveryTownSelect = document.querySelector('#delivery-town');

function getDeliveryFee() {
  if (!deliveryTownSelect) return 0;
  const selectedOption = deliveryTownSelect.options[deliveryTownSelect.selectedIndex];
  return Number(selectedOption?.dataset.fee || 0);
}

function updateDeliveryOrder() {
  if (!orderTextarea || !totalPriceEl) return;

  const selectedItems = [];
  let foodTotal = 0;

  orderFoods.forEach((item) => {
    const qtyEl = item.querySelector('.qty');
    const qty = Number(qtyEl?.textContent || 0);
    const name = item.dataset.name;
    const price = Number(item.dataset.price || 0);

    if (qty > 0) {
      selectedItems.push(`${qty}× ${name} (${price} Kč/ks)`);
      foodTotal += qty * price;
    }
  });

  const deliveryFee = getDeliveryFee();
  const total = foodTotal + deliveryFee;

  orderTextarea.value = selectedItems.join('\\n');

  if (foodPriceEl) foodPriceEl.textContent = `${foodTotal} Kč`;
  if (deliveryPriceEl) {
    const townValue = deliveryTownSelect?.value || '';
    deliveryPriceEl.textContent = townValue === 'Jiná obec' ? 'po domluvě' : `${deliveryFee} Kč`;
  }

  totalPriceEl.textContent = deliveryTownSelect?.value === 'Jiná obec' ? `${foodTotal} Kč + doprava` : `${total} Kč`;

  if (hiddenFoodEl) hiddenFoodEl.value = `${foodTotal} Kč`;
  if (hiddenDeliveryEl) hiddenDeliveryEl.value = deliveryTownSelect?.value === 'Jiná obec' ? 'po domluvě' : `${deliveryFee} Kč`;
  if (hiddenTotalEl) hiddenTotalEl.value = deliveryTownSelect?.value === 'Jiná obec' ? `${foodTotal} Kč + doprava po domluvě` : `${total} Kč`;
}

orderFoods.forEach((item) => {
  const plus = item.querySelector('.plus');
  const minus = item.querySelector('.minus');
  const qtyEl = item.querySelector('.qty');

  plus?.addEventListener('click', () => {
    qtyEl.textContent = Number(qtyEl.textContent) + 1;
    updateDeliveryOrder();
  });

  minus?.addEventListener('click', () => {
    qtyEl.textContent = Math.max(0, Number(qtyEl.textContent) - 1);
    updateDeliveryOrder();
  });
});

deliveryTownSelect?.addEventListener('change', updateDeliveryOrder);
updateDeliveryOrder();


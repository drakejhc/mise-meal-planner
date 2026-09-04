import { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  CalendarDays,
  Carrot,
  Check,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Clock3,
  Flame,
  GripVertical,
  Home as HomeIcon,
  Leaf,
  ListChecks,
  MoreHorizontal,
  PackageOpen,
  Plus,
  Search,
  Settings2,
  ShoppingBasket,
  SlidersHorizontal,
  Sparkles,
  Store,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

type PageId = "dashboard" | "pantry" | "meal-plan" | "grocery-list" | "settings";

type NavItem = {
  id: PageId;
  label: string;
  path: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Today", path: "/", icon: HomeIcon },
  { id: "pantry", label: "Pantry", path: "/pantry", icon: PackageOpen },
  { id: "meal-plan", label: "Meal plan", path: "/meal-plan", icon: CalendarDays },
  { id: "grocery-list", label: "Groceries", path: "/grocery-list", icon: ShoppingBasket },
  { id: "settings", label: "Settings", path: "/settings", icon: Settings2 },
];

const mealImages = {
  teriyaki: "/manus-storage/teriyaki-chicken-bowl_680634fa.jpg",
  tacos: "/manus-storage/chicken-tacos_41c6d35b.jpg",
  pasta: "/manus-storage/broccoli-pasta_51eeab65.jpeg",
};

const weekDays = [
  { weekday: "Mon", date: "8" },
  { weekday: "Tue", date: "9" },
  { weekday: "Wed", date: "10" },
  { weekday: "Thu", date: "11" },
  { weekday: "Fri", date: "12" },
  { weekday: "Sat", date: "13" },
  { weekday: "Sun", date: "14" },
];

const mealPlan = [
  {
    day: "Monday",
    date: "Sep 8",
    name: "Teriyaki chicken bowls",
    details: "Chicken thighs · rice · broccoli",
    tag: "Cook tonight",
    image: mealImages.teriyaki,
    duration: "35 min",
    uses: "3 pantry items",
  },
  {
    day: "Tuesday",
    date: "Sep 9",
    name: "Chicken tacos with green salsa",
    details: "Chicken · tortillas · avocado",
    tag: "Pantry-first",
    image: mealImages.tacos,
    duration: "30 min",
    uses: "4 pantry items",
  },
  {
    day: "Wednesday",
    date: "Sep 10",
    name: "Pasta with roasted broccoli",
    details: "Pasta · broccoli · lemon",
    tag: "Use it up",
    image: mealImages.pasta,
    duration: "25 min",
    uses: "2 pantry items",
  },
  {
    day: "Thursday",
    date: "Sep 11",
    name: "Vegetable fried rice",
    details: "Eggs · rice · carrots · peas",
    tag: "Fast night",
    image: mealImages.teriyaki,
    duration: "20 min",
    uses: "3 pantry items",
  },
  {
    day: "Friday",
    date: "Sep 12",
    name: "Build-your-own taco night",
    details: "Black beans · tortillas · toppings",
    tag: "Family favorite",
    image: mealImages.tacos,
    duration: "25 min",
    uses: "2 pantry items",
  },
];

const pantryGroups = [
  {
    name: "Use soon",
    note: "2 items need a plan this week",
    items: [
      { icon: "🥦", name: "Broccoli", meta: "Best by Tue", urgency: true },
      { icon: "🍇", name: "Grapes", meta: "Best by Wed", urgency: true },
    ],
  },
  {
    name: "Fridge",
    note: "8 items",
    items: [
      { icon: "🍗", name: "Chicken thighs", meta: "1.5 lb", urgency: false },
      { icon: "🥚", name: "Eggs", meta: "8 left", urgency: false },
      { icon: "🥕", name: "Carrots", meta: "4 left", urgency: false },
      { icon: "🧀", name: "Parmesan", meta: "Half block", urgency: false },
    ],
  },
  {
    name: "Cupboard",
    note: "7 items",
    items: [
      { icon: "🍚", name: "Jasmine rice", meta: "2 cups", urgency: false },
      { icon: "🍝", name: "Penne", meta: "1 box", urgency: false },
      { icon: "🫘", name: "Black beans", meta: "2 cans", urgency: false },
      { icon: "🫙", name: "Sesame oil", meta: "Half bottle", urgency: false },
    ],
  },
];

const groceryGroups = [
  {
    name: "Produce",
    color: "bg-[#dfe9ce] text-[#4f662f]",
    items: [
      { id: "gochujang", name: "Gochujang", quantity: "1 small tub", recipe: "Teriyaki bowls" },
      { id: "avocado", name: "Avocados", quantity: "3", recipe: "Taco night" },
      { id: "lime", name: "Limes", quantity: "4", recipe: "Taco night" },
      { id: "cilantro", name: "Cilantro", quantity: "1 bunch", recipe: "Tacos + fried rice" },
    ],
  },
  {
    name: "Pantry",
    color: "bg-[#f4e3c9] text-[#825a24]",
    items: [
      { id: "tortillas", name: "Corn tortillas", quantity: "1 pack", recipe: "Taco night" },
      { id: "peas", name: "Frozen peas", quantity: "1 bag", recipe: "Fried rice" },
      { id: "coconut", name: "Coconut milk", quantity: "1 can", recipe: "Friday tacos" },
    ],
  },
  {
    name: "Dairy & eggs",
    color: "bg-[#e9e2f5] text-[#6b5791]",
    items: [
      { id: "yogurt", name: "Greek yogurt", quantity: "1 tub", recipe: "Lunches" },
      { id: "feta", name: "Feta", quantity: "1 block", recipe: "Pasta" },
    ],
  },
];

function useAppPage(pathname: string): PageId {
  if (pathname === "/pantry") return "pantry";
  if (pathname === "/meal-plan") return "meal-plan";
  if (pathname === "/grocery-list") return "grocery-list";
  if (pathname === "/settings") return "settings";
  return "dashboard";
}

function Metric({ icon: Icon, value, label, tint }: { icon: LucideIcon; value: string; label: string; tint: string }) {
  return (
    <div className="rounded-[1.25rem] border border-[#e8e3d9] bg-white/80 p-3.5 shadow-[0_8px_24px_rgba(56,47,34,0.035)] transition-transform duration-200 hover:-translate-y-0.5 sm:p-4">
      <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-xl ${tint}`}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <p className="font-display text-[1.45rem] font-semibold leading-none tracking-[-0.04em] text-[#282a22]">{value}</p>
      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#858576]">{label}</p>
    </div>
  );
}

function WeekStrip({ selectedDay, setSelectedDay }: { selectedDay: string; setSelectedDay: (day: string) => void }) {
  return (
    <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max gap-1.5">
        {weekDays.map((item) => {
          const active = selectedDay === item.date;
          return (
            <button
              aria-label={`${item.weekday}, September ${item.date}`}
              className={`group flex w-[48px] flex-col items-center rounded-2xl py-2.5 transition-all duration-200 ${
                active ? "bg-[#2f3b22] text-white shadow-[0_6px_14px_rgba(47,59,34,0.18)]" : "text-[#8b8c7b] hover:bg-[#efefe8]"
              }`}
              key={item.date}
              onClick={() => setSelectedDay(item.date)}
              type="button"
            >
              <span className={`text-[10px] font-bold uppercase tracking-[0.06em] ${active ? "text-[#dce5ca]" : ""}`}>{item.weekday}</span>
              <span className="mt-1 font-display text-lg font-semibold leading-none">{item.date}</span>
              <span className={`mt-1.5 h-1 w-1 rounded-full ${active ? "bg-[#cddcae]" : item.date === "10" ? "bg-[#de9a5d]" : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8c9279]">{eyebrow}</p>
        <h1 className="mt-1 font-display text-[2rem] font-semibold tracking-[-0.055em] text-[#292b23] sm:text-[2.55rem]">{title}</h1>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#77796d]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function TodayPage({ goTo }: { goTo: (path: string) => void }) {
  const [selectedDay, setSelectedDay] = useState("8");

  return (
    <>
      <PageHeader
        eyebrow="The Rivera household"
        title="What should we make this week?"
        description="A flexible plan built around what is already in your kitchen."
        action={
          <button className="soft-button" onClick={() => goTo("/meal-plan")} type="button">
            View full week <ArrowRight className="h-4 w-4" />
          </button>
        }
      />

      <section className="mb-7 rounded-[1.5rem] border border-[#e3e0d5] bg-[#fbfaf5] p-3 shadow-[0_15px_35px_rgba(58,50,34,0.045)] sm:p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#4f5245]">
            <CalendarDays className="h-4 w-4 text-[#667349]" />
            <span>Sep 8–14</span>
          </div>
          <button className="flex items-center gap-1 text-xs font-bold text-[#747766] hover:text-[#383b31]" type="button">
            This week <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <WeekStrip selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      </section>

      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        <Metric icon={UtensilsCrossed} label="Dinners planned" tint="bg-[#e8efdc] text-[#607544]" value="5" />
        <Metric icon={ShoppingBasket} label="Estimated shop" tint="bg-[#f7e7d7] text-[#b66c38]" value="$73" />
        <Metric icon={Leaf} label="Food used" tint="bg-[#e3edf0] text-[#4b7981]" value="94%" />
        <Metric icon={Clock3} label="Cooking time" tint="bg-[#eee9f7] text-[#705d98]" value="2.1h" />
      </section>

      <section className="mt-7 overflow-hidden rounded-[1.6rem] bg-[#364326] text-white shadow-[0_20px_45px_rgba(40,53,27,0.18)] sm:mt-8">
        <div className="grid lg:grid-cols-[1.02fr_1fr]">
          <div className="relative min-h-[252px] overflow-hidden lg:min-h-[335px] lg:order-2">
            <img alt="Teriyaki chicken and vegetables over rice" className="h-full w-full object-cover" src={mealImages.teriyaki} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17200f]/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-full bg-[#1e2915]/85 px-3 py-1.5 text-[11px] font-bold backdrop-blur-sm">35 min · serves 4</div>
          </div>
          <div className="relative p-6 sm:p-8 lg:order-1 lg:p-9">
            <div className="absolute -left-8 -top-7 h-28 w-28 rounded-full bg-[#596b40] opacity-30 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#728455] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f0f4e7]">
                  <Flame className="h-3 w-3" /> Tonight
                </span>
                <span className="text-xs text-[#cbd4bc]">Mon, Sep 8</span>
              </div>
              <h2 className="max-w-sm font-display text-3xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-[2.5rem]">Teriyaki chicken bowls</h2>
              <p className="mt-3 text-sm leading-6 text-[#d6ddca]">Sweet, savory, and mostly waiting for you in the kitchen already.</p>
              <div className="mt-6 space-y-2.5 border-y border-white/10 py-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#bfc9b0]">Uses from your pantry</span>
                  <span className="font-semibold text-white">chicken, rice, broccoli</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#bfc9b0]">Still to pick up</span>
                  <span className="font-semibold text-[#f0d2a7]">gochujang, sesame oil</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button className="rounded-xl bg-[#f3f0e8] px-4 py-2.5 text-sm font-bold text-[#303d21] transition duration-150 hover:bg-white active:scale-[0.97]" onClick={() => toast("Recipe view is ready for the next build phase.", { description: "This frontend prototype does not load recipe instructions yet." })} type="button">
                  Start cooking
                </button>
                <button className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white transition duration-150 hover:bg-white/10 active:scale-[0.97]" onClick={() => goTo("/meal-plan")} type="button">
                  Swap meal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.36fr]">
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="section-kicker">Next up</p>
              <h2 className="section-title">The rest of your week</h2>
            </div>
            <button className="inline-flex items-center gap-1 text-xs font-bold text-[#64734b] hover:text-[#3e4d2b]" onClick={() => goTo("/meal-plan")} type="button">
              See plan <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {mealPlan.slice(1, 4).map((meal) => (
              <button className="meal-preview group text-left" key={meal.day} onClick={() => goTo("/meal-plan")} type="button">
                <div className="relative h-28 overflow-hidden rounded-2xl sm:h-32">
                  <img alt={meal.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={meal.image} />
                  <span className="absolute left-2.5 top-2.5 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-[#4d513f] backdrop-blur-sm">{meal.day.slice(0, 3)}</span>
                </div>
                <p className="mt-3 text-[13px] font-bold leading-5 text-[#36382e]">{meal.name}</p>
                <p className="mt-1 text-xs text-[#87887c]">{meal.duration} · {meal.uses}</p>
              </button>
            ))}
          </div>
        </div>
        <aside className="rounded-[1.4rem] border border-[#e4e1d8] bg-white p-5 shadow-[0_10px_25px_rgba(56,47,34,0.035)]">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eddc] text-[#b06d37]"><Carrot className="h-4 w-4" /></div>
            <span className="rounded-full bg-[#f4e3d0] px-2.5 py-1 text-[10px] font-bold text-[#af6834]">2 to use soon</span>
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold tracking-[-0.04em] text-[#35372f]">A little kitchen nudge</h2>
          <p className="mt-1.5 text-sm leading-5 text-[#77796d]">Your broccoli and grapes are best enjoyed before Wednesday.</p>
          <button className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#f0f1ea] px-3.5 py-3 text-sm font-bold text-[#4d5938] transition hover:bg-[#e6eadb]" onClick={() => goTo("/pantry")} type="button">
            Check pantry <ArrowRight className="h-4 w-4" />
          </button>
        </aside>
      </section>
    </>
  );
}

function PantryPage({ addItem }: { addItem: () => void }) {
  return (
    <>
      <PageHeader
        eyebrow="Your kitchen, at a glance"
        title="Pantry"
        description="Keep the essentials in view. The next plan will lean on what you have first."
        action={
          <button className="primary-button" onClick={addItem} type="button"><CirclePlus className="h-4 w-4" /> Add item</button>
        }
      />
      <section className="grid gap-3 sm:grid-cols-3">
        <Metric icon={PackageOpen} label="Items in kitchen" tint="bg-[#e7eddc] text-[#5f7442]" value="15" />
        <Metric icon={Flame} label="Use this week" tint="bg-[#f4e3d2] text-[#b46a32]" value="6" />
        <Metric icon={Leaf} label="Estimated saved" tint="bg-[#e3eef0] text-[#527c82]" value="$18" />
      </section>
      <section className="mt-7 rounded-[1.4rem] border border-[#e3e1d6] bg-white p-3.5 shadow-[0_10px_28px_rgba(56,47,34,0.035)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex flex-1 items-center gap-2.5 rounded-xl bg-[#f5f5f0] px-3.5 py-3 text-sm text-[#7e8074]">
            <Search className="h-4 w-4" />
            <input aria-label="Search pantry" className="w-full bg-transparent outline-none placeholder:text-[#9b9c91]" placeholder="Search your kitchen" />
          </label>
          <button className="soft-button justify-center" onClick={addItem} type="button"><Plus className="h-4 w-4" /> Quick add</button>
        </div>
      </section>
      <section className="mt-5 space-y-5">
        {pantryGroups.map((group) => (
          <div className="rounded-[1.4rem] border border-[#e4e1d8] bg-white p-4 shadow-[0_8px_22px_rgba(56,47,34,0.03)] sm:p-5" key={group.name}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold tracking-[-0.04em] text-[#36382e]">{group.name}</h2>
                <p className="mt-0.5 text-xs text-[#858679]">{group.note}</p>
              </div>
              <button aria-label={`Add item to ${group.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f2f3ed] text-[#617044] transition hover:bg-[#e6eadb]" onClick={addItem} type="button"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <div className={`flex items-center gap-3 rounded-xl px-3 py-3 ${item.urgency ? "bg-[#fff5e8]" : "bg-[#f8f8f5]"}`} key={item.name}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xl shadow-sm">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#4b4d42]">{item.name}</p>
                    <p className={`mt-0.5 text-xs ${item.urgency ? "font-semibold text-[#bd7040]" : "text-[#8d8e81]"}`}>{item.meta}</p>
                  </div>
                  <button aria-label={`Options for ${item.name}`} className="text-[#a0a195] hover:text-[#53564c]" type="button"><MoreHorizontal className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function MealPlanPage({ goTo }: { goTo: (path: string) => void }) {
  return (
    <>
      <PageHeader
        eyebrow="A flexible five-day plan"
        title="Your week, simplified"
        description="Five dinners that make the most of what is in the house—and leave space for real life."
        action={
          <button className="primary-button" onClick={() => toast("Meal generation is not connected yet.", { description: "This prototype shows the planned-week interface only." })} type="button"><Sparkles className="h-4 w-4" /> Plan from pantry</button>
        }
      />
      <section className="mb-6 flex flex-wrap gap-2.5 rounded-[1.3rem] border border-[#e5e1d7] bg-[#f4f1e9] p-3.5 text-sm sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2 text-[#59653f]"><Leaf className="h-4 w-4" /><span><strong>94% pantry use</strong> across this week's dinners</span></div>
        <button className="inline-flex items-center gap-1.5 font-bold text-[#65734a] hover:text-[#394829]" onClick={() => goTo("/grocery-list")} type="button">Review groceries <ArrowRight className="h-4 w-4" /></button>
      </section>
      <section className="space-y-3">
        {mealPlan.map((meal, index) => (
          <article className="group flex gap-3 rounded-[1.35rem] border border-[#e5e2d9] bg-white p-3 shadow-[0_8px_20px_rgba(56,47,34,0.03)] transition duration-200 hover:border-[#d7d8ca] hover:shadow-[0_12px_30px_rgba(56,47,34,0.06)] sm:gap-5 sm:p-4" key={meal.day}>
            <div className="hidden shrink-0 items-center text-[#c2c2b8] sm:flex"><GripVertical className="h-5 w-5" /></div>
            <div className="w-11 shrink-0 pt-1 text-center sm:w-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8c8e81]">{meal.day.slice(0, 3)}</p>
              <p className="mt-1 font-display text-xl font-semibold leading-none text-[#383a30]">{meal.date.replace("Sep ", "")}</p>
            </div>
            <img alt={meal.name} className="h-[84px] w-[70px] shrink-0 rounded-2xl object-cover sm:h-[94px] sm:w-[112px]" src={meal.image} />
            <div className="min-w-0 flex-1 py-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${index === 0 ? "bg-[#e5efda] text-[#5f7541]" : "bg-[#f3f0e7] text-[#80745b]"}`}>{meal.tag}</span>
                <span className="flex items-center gap-1 text-[11px] text-[#87897d]"><Clock3 className="h-3 w-3" />{meal.duration}</span>
              </div>
              <h2 className="mt-1.5 line-clamp-2 font-display text-lg font-semibold leading-5 tracking-[-0.035em] text-[#36382f] sm:text-xl sm:leading-6">{meal.name}</h2>
              <p className="mt-1 truncate text-xs text-[#7e8075] sm:text-sm">{meal.details}</p>
              <p className="mt-2 hidden text-xs font-semibold text-[#728157] sm:block">{meal.uses}</p>
            </div>
            <div className="flex shrink-0 flex-col justify-between py-1 sm:flex-row sm:items-center sm:gap-2">
              <button className="rounded-lg p-2 text-[#8b8d80] transition hover:bg-[#f4f4ef] hover:text-[#4d523f]" onClick={() => toast("Swap options will be available with meal generation.")} type="button" aria-label={`Swap ${meal.name}`}><MoreHorizontal className="h-4 w-4" /></button>
              <button className="hidden rounded-xl border border-[#e2e2d8] px-3 py-2 text-xs font-bold text-[#596247] transition hover:border-[#c7cfb8] hover:bg-[#f4f6ed] sm:block" onClick={() => toast("Swap options will be available with meal generation.")} type="button">Swap</button>
            </div>
          </article>
        ))}
      </section>
      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-[1.2rem] border border-dashed border-[#cdd5be] bg-[#f7f8f3] px-4 py-4 text-sm font-bold text-[#68754e] transition hover:bg-[#eff2e7]" onClick={() => toast("Meal generation is a future integration.", { description: "No AI has been connected in this frontend build." })} type="button"><Plus className="h-4 w-4" /> Add a dinner</button>
    </>
  );
}

function GroceryListPage({ checked, toggleItem }: { checked: string[]; toggleItem: (id: string) => void }) {
  const allItems = groceryGroups.flatMap((group) => group.items);
  const completeAll = () => {
    const ids = allItems.map((item) => item.id);
    if (checked.length === ids.length) {
      ids.forEach((id) => checked.includes(id) && toggleItem(id));
    } else {
      ids.forEach((id) => !checked.includes(id) && toggleItem(id));
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="One list, sorted for you"
        title="Grocery list"
        description="Everything missing from your plan, combined so you can get in and out of the store."
        action={
          <button className="soft-button" onClick={() => toast("Store selection will be available once shopping integrations are added.")} type="button"><Store className="h-4 w-4" /> Main store <ChevronDown className="h-3.5 w-3.5" /></button>
        }
      />
      <section className="overflow-hidden rounded-[1.5rem] bg-[#40342b] p-5 text-white shadow-[0_18px_38px_rgba(59,46,34,0.16)] sm:p-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#d8c5a9]">This week’s shop</p>
            <div className="mt-1 flex items-end gap-3"><p className="font-display text-4xl font-semibold tracking-[-0.06em]">$73</p><p className="mb-1 text-sm text-[#ded1c1]">estimated total</p></div>
          </div>
          <div className="flex gap-6 border-t border-white/15 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <div><p className="font-display text-xl font-semibold">9</p><p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#c6bbaa]">Items</p></div>
            <div><p className="font-display text-xl font-semibold">3</p><p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#c6bbaa]">Aisles</p></div>
            <div><p className="font-display text-xl font-semibold">5</p><p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#c6bbaa]">Dinners</p></div>
          </div>
        </div>
      </section>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-[#797b70]"><strong className="text-[#4e5146]">{checked.length}</strong> of {allItems.length} picked up</p>
        <button className="text-xs font-bold text-[#65754b] hover:text-[#3d4c2b]" onClick={completeAll} type="button">{checked.length === allItems.length ? "Clear all" : "Mark all"}</button>
      </div>
      <section className="mt-3 space-y-4">
        {groceryGroups.map((group) => (
          <div className="overflow-hidden rounded-[1.35rem] border border-[#e4e1d9] bg-white shadow-[0_8px_22px_rgba(56,47,34,0.03)]" key={group.name}>
            <div className="flex items-center justify-between px-4 pb-2.5 pt-4 sm:px-5">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${group.color}`}>{group.name}</span>
              <span className="text-xs text-[#98998e]">{group.items.length} items</span>
            </div>
            <div className="divide-y divide-[#efeee9]">
              {group.items.map((item) => {
                const isChecked = checked.includes(item.id);
                return (
                  <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5 transition hover:bg-[#fcfcfa] sm:px-5" key={item.id}>
                    <input checked={isChecked} className="sr-only" onChange={() => toggleItem(item.id)} type="checkbox" />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${isChecked ? "border-[#697b4d] bg-[#697b4d] text-white" : "border-[#cfd0c6] bg-white"}`}><Check className={`h-3.5 w-3.5 ${isChecked ? "opacity-100" : "opacity-0"}`} /></span>
                    <span className="min-w-0 flex-1"><span className={`block text-sm font-bold ${isChecked ? "text-[#a6a69c] line-through" : "text-[#47493f]"}`}>{item.name}</span><span className="mt-0.5 block text-[11px] text-[#999a8e]">{item.recipe}</span></span>
                    <span className={`text-xs font-semibold ${isChecked ? "text-[#b1b1a8]" : "text-[#77796e]"}`}>{item.quantity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </section>
      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-[1.1rem] border border-dashed border-[#cdd4bf] bg-[#f5f7f1] py-3.5 text-sm font-bold text-[#65754b] transition hover:bg-[#edf1e7]" onClick={() => toast("Add-item entry will save to your shared list once the backend is connected.")} type="button"><Plus className="h-4 w-4" /> Add something else</button>
    </>
  );
}

function SettingsPage() {
  const [householdSize, setHouseholdSize] = useState(4);
  const [leftovers, setLeftovers] = useState(true);
  const [budget, setBudget] = useState(true);
  const adjustSize = (direction: number) => setHouseholdSize((current) => Math.max(1, Math.min(8, current + direction)));

  return (
    <>
      <PageHeader eyebrow="Make Mise feel like home" title="Settings" description="A few details that help keep each weekly plan grounded in your household." />
      <section className="space-y-5">
        <div className="settings-card">
          <div className="settings-heading"><div className="icon-tile bg-[#edf0e5] text-[#68784c]"><UsersRound className="h-4 w-4" /></div><div><h2>Household</h2><p>Who are we cooking for?</p></div></div>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-[#f7f7f2] p-3.5"><div><p className="text-sm font-bold text-[#4c4e44]">The Rivera home</p><p className="mt-0.5 text-xs text-[#8d8e82]">Shared meal planning space</p></div><button className="text-xs font-bold text-[#66764b]" onClick={() => toast("Household editing will be available once accounts are connected.")} type="button">Edit</button></div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f7f7f2] p-3.5"><div><p className="text-sm font-bold text-[#4c4e44]">People at dinner</p><p className="mt-0.5 text-xs text-[#8d8e82]">Adjusts serving estimates</p></div><div className="flex items-center gap-3"><button aria-label="Decrease household size" className="counter-button" onClick={() => adjustSize(-1)} type="button">−</button><span className="w-3 text-center text-sm font-bold text-[#4c4e44]">{householdSize}</span><button aria-label="Increase household size" className="counter-button" onClick={() => adjustSize(1)} type="button">+</button></div></div>
        </div>
        <div className="settings-card">
          <div className="settings-heading"><div className="icon-tile bg-[#f5e9dc] text-[#b6733e]"><SlidersHorizontal className="h-4 w-4" /></div><div><h2>Planning preferences</h2><p>Small choices for a more useful week.</p></div></div>
          <div className="mt-5 space-y-1 divide-y divide-[#e9e8e2]">
            <div className="flex items-center justify-between py-3.5"><div><p className="text-sm font-bold text-[#4c4e44]">Plan for leftovers</p><p className="mt-0.5 text-xs text-[#8d8e82]">Build extra portions into the week</p></div><button aria-pressed={leftovers} className={`toggle ${leftovers ? "toggle-on" : ""}`} onClick={() => setLeftovers(!leftovers)} type="button"><span /></button></div>
            <div className="flex items-center justify-between py-3.5"><div><p className="text-sm font-bold text-[#4c4e44]">Keep an eye on budget</p><p className="mt-0.5 text-xs text-[#8d8e82]">Show an estimate with each shop</p></div><button aria-pressed={budget} className={`toggle ${budget ? "toggle-on" : ""}`} onClick={() => setBudget(!budget)} type="button"><span /></button></div>
          </div>
        </div>
        <div className="settings-card">
          <div className="settings-heading"><div className="icon-tile bg-[#e7eef0] text-[#52777e]"><UtensilsCrossed className="h-4 w-4" /></div><div><h2>Food preferences</h2><p>Helpful context for future plans.</p></div></div>
          <div className="mt-5 flex flex-wrap gap-2"><span className="preference-chip">No shellfish</span><span className="preference-chip">Weeknight-friendly</span><button className="preference-chip border-dashed text-[#6c7757] hover:bg-[#eff2e8]" onClick={() => toast("Food preference editing is not connected in this prototype.")} type="button"><Plus className="h-3.5 w-3.5" /> Add preference</button></div>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  const [location, setLocation] = useLocation();
  const activePage = useAppPage(location);
  const [checkedGroceries, setCheckedGroceries] = useState<string[]>([]);

  const goTo = (path: string) => {
    setLocation(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleGrocery = (id: string) => {
    setCheckedGroceries((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]);
  };

  const addPantryItem = () => {
    toast.success("Added cherry tomatoes to the demo pantry.", { description: "Changes live only in this frontend preview." });
  };

  const currentLabel = navItems.find((item) => item.id === activePage)?.label ?? "Today";

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#373a31]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[236px] flex-col border-r border-[#e6e3d9] bg-[#f3f2eb]/95 px-4 py-6 backdrop-blur-xl lg:flex">
        <button className="flex items-center gap-2.5 px-2 text-left" onClick={() => goTo("/")} type="button">
          <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-[#354326] font-display text-lg font-semibold text-[#f6f4ea] shadow-[0_5px_12px_rgba(47,59,34,0.18)]">m</span>
          <span><span className="block font-display text-xl font-semibold leading-none tracking-[-0.045em] text-[#303429]">mise</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.19em] text-[#96978b]">at home</span></span>
        </button>
        <div className="mt-11">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a1a196]">Kitchen</p>
          <nav className="mt-3 space-y-1.5" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activePage;
              return <button className={`nav-button ${isActive ? "nav-button-active" : ""}`} key={item.id} onClick={() => goTo(item.path)} type="button"><Icon className="h-[17px] w-[17px]" strokeWidth={isActive ? 2.2 : 1.9} /><span>{item.label}</span>{item.id === "pantry" && <span className="ml-auto rounded-md bg-[#e8ecdd] px-1.5 py-0.5 text-[10px] font-bold text-[#65754b]">2</span>}</button>;
            })}
          </nav>
        </div>
        <div className="mt-auto rounded-2xl bg-[#e6ebd9] p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f7f7f1] text-[#65774a]"><Sparkles className="h-4 w-4" /></div>
          <p className="mt-3 text-sm font-bold text-[#465238]">Build a better week</p>
          <p className="mt-1 text-xs leading-5 text-[#717d63]">A few pantry updates make the next plan feel more like yours.</p>
          <button className="mt-3 text-xs font-bold text-[#52623c] hover:text-[#354526]" onClick={() => goTo("/pantry")} type="button">Update pantry →</button>
        </div>
        <div className="mt-5 flex items-center gap-2.5 px-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dec7b1] text-xs font-bold text-[#71533d]">ER</span><div><p className="text-xs font-bold text-[#53564a]">Elena Rivera</p><p className="text-[10px] text-[#96978b]">The Rivera home</p></div></div>
      </aside>

      <header className="sticky top-0 z-10 border-b border-[#e7e4db]/80 bg-[#f8f7f2]/85 px-4 py-3.5 backdrop-blur-xl lg:ml-[236px] lg:px-8">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between">
          <button className="flex items-center gap-2 lg:hidden" onClick={() => goTo("/")} type="button"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#354326] font-display text-base font-semibold text-[#f6f4ea]">m</span><span className="font-display text-lg font-semibold tracking-[-0.04em] text-[#34362d]">mise</span></button>
          <div className="hidden items-center gap-2 text-xs text-[#939488] lg:flex"><span>Kitchen</span><ChevronRight className="h-3.5 w-3.5" /><strong className="font-semibold text-[#585a50]">{currentLabel}</strong></div>
          <div className="flex items-center gap-3"><button aria-label="Open settings" className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#e5e2d9] bg-white text-[#75776b] transition hover:bg-[#f0f1ea] sm:flex" onClick={() => goTo("/settings")} type="button"><Settings2 className="h-4 w-4" /></button><button aria-label="Open household settings" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dec7b1] text-xs font-bold text-[#71533d]" onClick={() => goTo("/settings")} type="button">ER</button></div>
        </div>
      </header>

      <main className="pb-24 pt-7 lg:ml-[236px] lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-7 lg:px-8">
          <div className="page-enter">
            {activePage === "dashboard" && <TodayPage goTo={goTo} />}
            {activePage === "pantry" && <PantryPage addItem={addPantryItem} />}
            {activePage === "meal-plan" && <MealPlanPage goTo={goTo} />}
            {activePage === "grocery-list" && <GroceryListPage checked={checkedGroceries} toggleItem={toggleGrocery} />}
            {activePage === "settings" && <SettingsPage />}
          </div>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-[#e6e3d9] bg-[#f8f7f2]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;
          return <button className={`mobile-nav-button ${isActive ? "mobile-nav-active" : ""}`} key={item.id} onClick={() => goTo(item.path)} type="button"><span className={`flex h-7 w-7 items-center justify-center rounded-lg ${isActive ? "bg-[#e5ebd9]" : ""}`}><Icon className="h-4 w-4" /></span><span>{item.label === "Meal plan" ? "Plan" : item.label}</span></button>;
        })}
      </nav>
    </div>
  );
}
